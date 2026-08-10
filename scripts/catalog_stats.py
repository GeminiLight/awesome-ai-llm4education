"""Load and summarize the canonical paper catalog without external dependencies."""

from __future__ import annotations

import csv
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PAPERS_PATH = ROOT / "data" / "papers.csv"
REQUIRED_COLUMNS = (
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
    "group",
    "category",
    "publisher",
    "year",
    "type",
    "is_llm_related",
    "title",
    "authors",
)
CATEGORICAL_COLUMNS = ("group", "category", "publisher", "type")


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
class GroupCount:
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
    by_group: tuple[GroupCount, ...]

    @property
    def llm_share(self) -> float:
        return self.llm_related / self.total if self.total else 0.0


def normalize_label(value: str) -> str:
    normalized = unicodedata.normalize("NFC", value).strip()
    return re.sub(r"\s+", " ", normalized).casefold()


def load_papers(path: Path = PAPERS_PATH) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source, strict=True)
        if tuple(reader.fieldnames or ()) != REQUIRED_COLUMNS:
            raise CatalogValidationError(
                f"unexpected columns in {path}: {reader.fieldnames}; "
                f"expected {list(REQUIRED_COLUMNS)}"
            )
        papers = list(reader)

    variants = {column: {} for column in CATEGORICAL_COLUMNS}
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

        for column in CATEGORICAL_COLUMNS:
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
    group_counts = Counter(paper["group"] for paper in papers)
    by_group = tuple(
        GroupCount(name=name, count=count)
        for name, count in sorted(
            group_counts.items(), key=lambda item: (-item[1], item[0].casefold())
        )
    )

    return CatalogStatistics(
        total=len(papers),
        llm_related=sum(paper["is_llm_related"] == "1" for paper in papers),
        source_count=len({paper["publisher"] for paper in papers}),
        earliest_year=by_year[0].year,
        latest_year=by_year[-1].year,
        by_year=by_year,
        by_group=by_group,
    )
