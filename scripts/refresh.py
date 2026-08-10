#!/usr/bin/env python3
"""Refresh or verify every artifact derived from data/papers.csv."""

from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "data"))
sys.path.insert(0, str(ROOT / "src"))

import preprocess  # noqa: E402
from generator import convert_csv_to_md  # noqa: E402
from generate_statistics import ANALYSIS_PATH, build_outputs, sync_outputs  # noqa: E402


def render_readmes(analysis_path: Path, output_dir: Path) -> dict[Path, str]:
    readme_path = output_dir / "README.md"
    llm_path = output_dir / "LLM4EDU.md"
    convert_csv_to_md(
        ROOT / "data" / "papers.csv",
        readme_path,
        ROOT / "data" / "header.md",
        only_llm_related=False,
        analysis_path=analysis_path,
    )
    convert_csv_to_md(
        ROOT / "data" / "papers.csv",
        llm_path,
        ROOT / "data" / "header.md",
        only_llm_related=True,
    )
    return {
        ROOT / "README.md": readme_path.read_text(encoding="utf-8"),
        ROOT / "LLM4EDU.md": llm_path.read_text(encoding="utf-8"),
    }


def check_outputs() -> int:
    statistics_outputs = build_outputs()
    stale = sync_outputs(statistics_outputs, check=True)

    expected_processed = preprocess.render_processed_csv()
    if (
        not preprocess.OUTPUT_PATH.exists()
        or preprocess.OUTPUT_PATH.read_text(encoding="utf-8") != expected_processed
    ):
        stale.append(preprocess.OUTPUT_PATH)

    with tempfile.TemporaryDirectory() as directory:
        temporary = Path(directory)
        temporary_analysis = temporary / "analysis.md"
        temporary_analysis.write_text(statistics_outputs[ANALYSIS_PATH], encoding="utf-8")
        expected_readmes = render_readmes(temporary_analysis, temporary)

    for path, expected in expected_readmes.items():
        if not path.exists() or path.read_text(encoding="utf-8") != expected:
            stale.append(path)

    if stale:
        for path in dict.fromkeys(stale):
            print(f"stale: {path.relative_to(ROOT)}", file=sys.stderr)
        return 1

    print("verified all generated catalog artifacts")
    return 0


def refresh_outputs() -> int:
    statistics_outputs = build_outputs()
    sync_outputs(statistics_outputs)
    preprocess.write_processed_csv()
    render_readmes(ANALYSIS_PATH, ROOT)
    print("refreshed processed data, statistics, README.md, and LLM4EDU.md")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if any generated artifact is stale")
    args = parser.parse_args()
    return check_outputs() if args.check else refresh_outputs()


if __name__ == "__main__":
    raise SystemExit(main())
