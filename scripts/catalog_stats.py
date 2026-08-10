"""Load and summarize the canonical paper catalog without external dependencies."""

from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PAPERS_PATH = ROOT / "data" / "papers.csv"
TAXONOMY_PATH = ROOT / "data" / "taxonomy.json"
REQUIRED_COLUMNS = (
    "section",
    "group",
    "category",
    "publisher",
    "year",
    "type",
    "is_llm_related",
    "title",
    "link",
    "authors",
    "code",
)
REQUIRED_VALUES = (
    "section",
    "group",
    "publisher",
    "year",
    "type",
    "is_llm_related",
    "title",
    "authors",
)
CATEGORICAL_COLUMNS = ("section", "group", "category", "publisher", "type")


class CatalogValidationError(ValueError):
    """Raised when catalog data cannot be summarized safely."""


@dataclass(frozen=True)
class YearCount:
    year: int
    llm_related: int
    other: int

    @property
    def total(self) -> int:
        return self.llm_related + self.other


@dataclass(frozen=True)
class SectionCount:
    name: str
    count: int


@dataclass(frozen=True)
class GroupCount:
    section: str
    name: str
    count: int


@dataclass(frozen=True)
class CategoryCount:
    section: str
    group: str
    name: str
    count: int


@dataclass(frozen=True)
class CatalogStatistics:
    total: int
    llm_related: int
    source_count: int
    earliest_year: int
    latest_year: int
    by_year: tuple[YearCount, ...]
    by_section: tuple[SectionCount, ...]
    by_group: tuple[GroupCount, ...]
    by_category: tuple[CategoryCount, ...]

    @property
    def llm_share(self) -> float:
        return self.llm_related / self.total if self.total else 0.0


def normalize_label(value: str) -> str:
    normalized = unicodedata.normalize("NFC", value).strip()
    return re.sub(r"\s+", " ", normalized).casefold()


def load_taxonomy(path: Path = TAXONOMY_PATH) -> dict[str, dict[str, tuple[str, ...]]]:
    """Load the canonical section/group/category combinations."""
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        sections = raw["sections"]
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as error:
        raise CatalogValidationError(f"invalid taxonomy file {path}: {error}") from error

    taxonomy: dict[str, dict[str, tuple[str, ...]]] = {}
    try:
        for section in sections:
            section_name = section["name"]
            if section_name in taxonomy:
                raise CatalogValidationError(
                    f"duplicate taxonomy section: {section_name!r}"
                )
            groups: dict[str, tuple[str, ...]] = {}
            for group in section["groups"]:
                group_name = group["name"]
                if group_name in groups:
                    raise CatalogValidationError(
                        f"duplicate taxonomy group in {section_name!r}: {group_name!r}"
                    )
                categories = tuple(group["categories"])
                if len(categories) != len(set(categories)):
                    raise CatalogValidationError(
                        f"duplicate taxonomy category in {group_name!r}"
                    )
                groups[group_name] = categories
            taxonomy[section_name] = groups
    except (KeyError, TypeError) as error:
        raise CatalogValidationError(f"invalid taxonomy structure in {path}: {error}") from error

    if not taxonomy:
        raise CatalogValidationError(f"{path} contains no taxonomy sections")
    return taxonomy


def load_papers(path: Path = PAPERS_PATH) -> list[dict[str, str]]:
    taxonomy = load_taxonomy()
    with path.open(encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source, strict=True)
        if tuple(reader.fieldnames or ()) != REQUIRED_COLUMNS:
            raise CatalogValidationError(
                f"unexpected columns in {path}: {reader.fieldnames}; "
                f"expected {list(REQUIRED_COLUMNS)}"
            )
        papers = list(reader)

    variants = {column: {} for column in CATEGORICAL_COLUMNS}
    seen_titles: dict[str, int] = {}
    for record_number, paper in enumerate(papers, start=2):
        if None in paper or any(value is None for value in paper.values()):
            raise CatalogValidationError(f"malformed CSV record {record_number}")

        for column in REQUIRED_VALUES:
            if not paper[column].strip():
                raise CatalogValidationError(
                    f"missing {column} in CSV record {record_number}"
                )
        if not re.fullmatch(r"\d{4}", paper["year"]):
            raise CatalogValidationError(
                f"invalid year in CSV record {record_number}: {paper['year']}"
            )
        if paper["is_llm_related"] not in {"0", "1"}:
            raise CatalogValidationError(
                "invalid is_llm_related value in CSV record "
                f"{record_number}: {paper['is_llm_related']}"
            )
        if paper["link"] and not paper["link"].startswith(("http://", "https://")):
            raise CatalogValidationError(
                f"invalid link in CSV record {record_number}: {paper['link']}"
            )

        section = paper["section"]
        group = paper["group"]
        category = paper["category"].strip()
        if section not in taxonomy:
            raise CatalogValidationError(
                f"unknown section in CSV record {record_number}: {section!r}"
            )
        if group not in taxonomy[section]:
            raise CatalogValidationError(
                f"unknown group in CSV record {record_number}: "
                f"{section!r} > {group!r}"
            )
        allowed_categories = taxonomy[section][group]
        if allowed_categories and category not in allowed_categories:
            raise CatalogValidationError(
                f"unknown category in CSV record {record_number}: "
                f"{section!r} > {group!r} > {category!r}"
            )
        if not allowed_categories and category:
            raise CatalogValidationError(
                f"category must be blank in CSV record {record_number}: "
                f"{section!r} > {group!r} > {category!r}"
            )

        normalized_title = normalize_label(paper["title"])
        previous_title_record = seen_titles.get(normalized_title)
        if previous_title_record is not None:
            raise CatalogValidationError(
                f"duplicate title in CSV records {previous_title_record} and "
                f"{record_number}: {paper['title']}"
            )
        seen_titles[normalized_title] = record_number

        for column in CATEGORICAL_COLUMNS:
            if not paper[column]:
                continue
            normalized = normalize_label(paper[column])
            existing = variants[column].get(normalized)
            if existing is not None and existing != paper[column]:
                raise CatalogValidationError(
                    f"conflicting {column} labels: {existing!r} and {paper[column]!r}"
                )
            variants[column][normalized] = paper[column]

    if not papers:
        raise CatalogValidationError(f"{path} contains no paper records")
    return papers


def compute_statistics(papers: list[dict[str, str]]) -> CatalogStatistics:
    year_counts: dict[int, Counter[str]] = {}
    for paper in papers:
        year = int(paper["year"])
        year_counts.setdefault(year, Counter())[paper["is_llm_related"]] += 1

    by_year = tuple(
        YearCount(
            year=year,
            llm_related=year_counts[year]["1"],
            other=year_counts[year]["0"],
        )
        for year in sorted(year_counts)
    )
    section_counts = Counter(paper["section"] for paper in papers)
    by_section = tuple(
        SectionCount(name=name, count=count)
        for name, count in sorted(
            section_counts.items(), key=lambda item: (-item[1], item[0].casefold())
        )
    )
    group_counts = Counter(
        (paper["section"], paper["group"]) for paper in papers
    )
    by_group = tuple(
        GroupCount(section=section, name=name, count=count)
        for (section, name), count in sorted(
            group_counts.items(),
            key=lambda item: (
                -item[1],
                item[0][0].casefold(),
                item[0][1].casefold(),
            ),
        )
    )
    category_counts = Counter(
        (paper["section"], paper["group"], paper["category"])
        for paper in papers
        if paper["category"]
    )
    by_category = tuple(
        CategoryCount(section=section, group=group, name=name, count=count)
        for (section, group, name), count in sorted(
            category_counts.items(),
            key=lambda item: (
                -item[1],
                item[0][0].casefold(),
                item[0][1].casefold(),
                item[0][2].casefold(),
            ),
        )
    )

    return CatalogStatistics(
        total=len(papers),
        llm_related=sum(paper["is_llm_related"] == "1" for paper in papers),
        source_count=len({paper["publisher"] for paper in papers}),
        earliest_year=by_year[0].year,
        latest_year=by_year[-1].year,
        by_year=by_year,
        by_section=by_section,
        by_group=by_group,
        by_category=by_category,
    )
