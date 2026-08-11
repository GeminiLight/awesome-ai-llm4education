import csv
import re
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
        self.assertEqual(self.stats.total, 334)
        self.assertEqual(self.stats.llm_related, 196)
        self.assertEqual(self.stats.source_count, 51)
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
        self.assertEqual(self.stats.by_section[0].count, 251)
        self.assertEqual(self.stats.by_group[0].name, "Learner Modeling")
        self.assertEqual(self.stats.by_group[0].count, 111)

    def test_socialcoach_uses_the_application_domain_taxonomy(self):
        socialcoach = next(
            paper for paper in self.papers if paper["title"].startswith("SocialCoach:")
        )
        self.assertEqual(socialcoach["section"], "Application Domains")
        self.assertEqual(socialcoach["group"], "Social Skills")
        self.assertEqual(socialcoach["category"], "")

    def test_section_chart_splits_the_lifecycle_into_five_groups(self):
        expected_groups = {
            "Tutoring Systems": 66,
            "Material Preparation": 37,
            "Teaching Support": 10,
            "Learner Modeling": 111,
            "Learning Assessment": 27,
        }
        lifecycle_groups = {
            item.name: item.count
            for item in self.stats.by_group
            if item.section == "Teaching & Learning Lifecycle"
        }
        self.assertEqual(lifecycle_groups, expected_groups)

        section_chart = build_outputs(self.stats)[
            ROOT / "visualization" / "papers-by-section.svg"
        ]
        for group, count in expected_groups.items():
            self.assertIn(f"{group} · {count}", section_chart)
            self.assertIn(f"{group}: {count} papers", section_chart)

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

    def test_recent_top_venue_additions_are_covered(self):
        recent = [
            paper
            for paper in self.papers
            if 2022 <= int(paper["year"]) <= 2026
        ]
        venue_counts = {}
        for paper in recent:
            venue_counts[paper["publisher"]] = venue_counts.get(
                paper["publisher"], 0
            ) + 1

        minimum_counts = {
            "AAAI": 16,
            "IJCAI": 6,
            "NeurIPS": 10,
            "ICML": 10,
            "ICLR": 2,
            "ACL": 11,
            "EMNLP": 12,
            "CVPR": 2,
            "ICCV": 2,
        }
        for venue, minimum in minimum_counts.items():
            self.assertGreaterEqual(venue_counts.get(venue, 0), minimum, venue)

        expected_titles = {
            "BETA-CD: A Bayesian Meta-Learned Cognitive Diagnosis Framework "
            "for Personalized Learning": "AAAI",
            "Exploiting Non-Interactive Exercises in Cognitive Diagnosis": "IJCAI",
            "XES3G5M: A Knowledge Tracing Benchmark Dataset with Auxiliary "
            "Information": "NeurIPS",
            "Language Models as Science Tutors": "ICML",
            "Predictive, scalable and interpretable knowledge tracing on "
            "structured domains": "ICLR",
            "Dr.Academy: A Benchmark for Evaluating Questioning Capability in "
            "Education for Large Language Models": "ACL",
            "Automatic Generation of Socratic Subquestions for Teaching Math "
            "Word Problems": "EMNLP",
            "ExpertAF: Expert Actionable Feedback from Video": "CVPR",
            "CPR-Coach: Recognizing Composite Error Actions based on "
            "Single-class Training": "CVPR",
            "Context-Aware Academic Emotion Dataset and Benchmark": "ICCV",
            "Towards Comprehensive Lecture Slides Understanding: Large-scale "
            "Dataset and Effective Method": "ICCV",
        }
        papers_by_title = {paper["title"]: paper for paper in recent}
        for title, venue in expected_titles.items():
            self.assertIn(title, papers_by_title)
            self.assertEqual(papers_by_title[title]["publisher"], venue)

        personality_simulation = papers_by_title[
            "Personality-aware Student Simulation for Conversational "
            "Intelligent Tutoring Systems"
        ]
        self.assertEqual(personality_simulation["publisher"], "EMNLP")
        self.assertEqual(personality_simulation["group"], "Learner Modeling")
        self.assertEqual(personality_simulation["category"], "Student Simulation")

        expected_paths = {
            "ExpertAF: Expert Actionable Feedback from Video": (
                "Teaching & Learning Lifecycle",
                "Learning Assessment",
                "Feedback",
                "1",
            ),
            "CPR-Coach: Recognizing Composite Error Actions based on "
            "Single-class Training": (
                "Application Domains",
                "Medical Education",
                "",
                "0",
            ),
            "Context-Aware Academic Emotion Dataset and Benchmark": (
                "Datasets, Benchmarks & Toolkits",
                "Datasets",
                "",
                "0",
            ),
            "Towards Comprehensive Lecture Slides Understanding: Large-scale "
            "Dataset and Effective Method": (
                "Datasets, Benchmarks & Toolkits",
                "Datasets",
                "",
                "0",
            ),
        }
        for title, expected_path in expected_paths.items():
            paper = papers_by_title[title]
            actual_path = (
                paper["section"],
                paper["group"],
                paper["category"],
                paper["is_llm_related"],
            )
            self.assertEqual(actual_path, expected_path)

    def test_analysis_documents_the_cross_field_survey_scope(self):
        analysis = build_outputs(self.stats)[
            ROOT / "visualization" / "analysis.md"
        ]
        self.assertIn("## Survey Scope", analysis)
        self.assertLess(
            analysis.index("## Survey Scope"),
            analysis.index("## Catalog Trends"),
        )
        scope = analysis.split("## Survey Scope\n", 1)[1].split(
            "\n## Catalog Trends", 1
        )[0]
        fields = re.findall(r"^- \*\*(.+?):\*\*", scope, flags=re.MULTILINE)
        self.assertEqual(fields[:-1], sorted(fields[:-1], key=str.casefold))
        self.assertEqual(fields[0], "Artificial Intelligence")
        self.assertEqual(fields[-1], "Selected Journals")
        self.assertIn("**Computer Vision:** CVPR, ICCV, ECCV", scope)
        self.assertIn("**Data Mining & Information Retrieval:**", analysis)
        self.assertIn(
            "KDD, WWW, SIGIR, CIKM, WSDM, TKDE, TOIS", analysis
        )
        self.assertIn("**Machine Learning:** NeurIPS, ICML, ICLR", analysis)
        self.assertNotIn("NeurIPS, ICML, ICLR, COLM", analysis)
        self.assertIn(
            "**Natural Language Processing:** ACL, EMNLP, NAACL, EACL, "
            "COLING, COLM, and Findings tracks",
            analysis,
        )
        self.assertIn("**Human-Computer Interaction:**", analysis)
        self.assertIn(
            "**Selected Journals:** npj Science of Learning, "
            "Computers & Education, IJAIED, IEEE TLT",
            analysis,
        )
        self.assertIn("CHI, CSCW, UIST, IUI", analysis)
        self.assertIn("**Education & Learning Sciences:**", analysis)
        self.assertIn("AIED, EDM, LAK, Learning@Scale, ITS", scope)
        self.assertNotIn("EC-TEL", scope)
        self.assertNotIn("ICALT", scope)
        self.assertIn(
            "**Software Engineering & Computing Education:** ICSE, SIGCSE",
            scope,
        )
        self.assertNotIn("ITiCSE", scope)
        self.assertNotIn("ICALT", {paper["publisher"] for paper in self.papers})

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
