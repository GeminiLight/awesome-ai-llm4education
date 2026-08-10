import csv
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_stats import (  # noqa: E402
    REQUIRED_COLUMNS,
    CatalogValidationError,
    compute_statistics,
    load_papers,
)
from generate_statistics import build_outputs  # noqa: E402


class CatalogStatisticsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.papers = load_papers()
        cls.stats = compute_statistics(cls.papers)

    def test_summary_metrics(self):
        self.assertEqual(self.stats.total, 310)
        self.assertEqual(self.stats.llm_related, 185)
        self.assertEqual(self.stats.source_count, 50)
        self.assertEqual(self.stats.earliest_year, 2001)
        self.assertEqual(self.stats.latest_year, 2026)

    def test_distributions_preserve_catalog_total(self):
        self.assertEqual(sum(item.total for item in self.stats.by_year), self.stats.total)
        self.assertEqual(
            sum(item.count for item in self.stats.by_section), self.stats.total
        )
        self.assertEqual(sum(item.count for item in self.stats.by_group), self.stats.total)
        self.assertEqual(
            sum(item.count for item in self.stats.by_category),
            sum(bool(paper["category"]) for paper in self.papers),
        )
        self.assertEqual(
            self.stats.by_section[0].name, "Teaching & Learning Lifecycle"
        )
        self.assertEqual(self.stats.by_section[0].count, 239)
        self.assertEqual(self.stats.by_group[0].name, "Learner Modeling")
        self.assertEqual(self.stats.by_group[0].count, 101)

    def test_socialcoach_uses_the_application_domain_taxonomy(self):
        socialcoach = next(
            paper for paper in self.papers if paper["title"].startswith("SocialCoach:")
        )
        self.assertEqual(socialcoach["section"], "Application Domains")
        self.assertEqual(socialcoach["group"], "Social Skills")
        self.assertEqual(socialcoach["category"], "")

    def test_recent_kdd_and_www_education_papers_are_covered(self):
        counts = {}
        for paper in self.papers:
            key = (paper["publisher"], paper["year"])
            counts[key] = counts.get(key, 0) + 1

        self.assertEqual(counts[("KDD", "2025")], 8)
        self.assertEqual(counts[("KDD", "2026")], 3)
        self.assertEqual(counts[("WWW", "2026")], 6)
        titles = {paper["title"] for paper in self.papers}
        self.assertIn(
            "COMA: A Collaborative Multi-Role Agent Framework for Automated "
            "Lesson Plan Generation",
            titles,
        )

    def test_duplicate_papers_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            duplicate_catalog = Path(directory) / "papers.csv"
            with duplicate_catalog.open("w", encoding="utf-8", newline="") as output:
                writer = csv.DictWriter(output, fieldnames=REQUIRED_COLUMNS)
                writer.writeheader()
                writer.writerows([self.papers[0], self.papers[0]])

            with self.assertRaisesRegex(CatalogValidationError, "duplicate title"):
                load_papers(duplicate_catalog)

    def test_generated_artifacts_are_accessible_and_source_labeled(self):
        outputs = build_outputs(self.stats)
        for path, content in outputs.items():
            self.assertTrue(content.endswith("\n"), path)
            self.assertIn("data/papers.csv", content, path)
        svg_outputs = [
            content for path, content in outputs.items() if path.suffix == ".svg"
        ]
        self.assertTrue(all('role="img"' in content for content in svg_outputs))
        self.assertTrue(
            all(
                "<title" in content and "<desc" in content
                for content in svg_outputs
            )
        )
        self.assertTrue(all("#4d8b7d" in content for content in svg_outputs))
        self.assertIn(ROOT / "visualization" / "papers-by-section.svg", outputs)


if __name__ == "__main__":
    unittest.main()
