#!/usr/bin/env python3
"""Generate deterministic catalog statistics, charts, and README analysis."""

from __future__ import annotations

import argparse
import csv
import html
import sys
from pathlib import Path

from catalog_stats import (
    ROOT,
    CatalogStatistics,
    CatalogValidationError,
    compute_statistics,
    load_papers,
)


OUTPUT_DIR = ROOT / "visualization"
YEAR_CHART_PATH = OUTPUT_DIR / "papers-by-year.svg"
GROUP_CHART_PATH = OUTPUT_DIR / "papers-by-group.svg"
ANALYSIS_PATH = OUTPUT_DIR / "analysis.md"


def escape(value: object) -> str:
    return html.escape(str(value), quote=True)


def axis_step(maximum: int) -> int:
    if maximum <= 20:
        return 5
    if maximum <= 50:
        return 10
    if maximum <= 100:
        return 20
    return 50


def axis_maximum(maximum: int) -> int:
    step = axis_step(maximum)
    return max(step, ((maximum + step - 1) // step) * step)


def svg_header(width: int, height: int, title: str, description: str) -> list[str]:
    return [
        (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            'role="img" aria-labelledby="chart-title chart-description">'
        ),
        f'  <title id="chart-title">{escape(title)}</title>',
        f'  <desc id="chart-description">{escape(description)}</desc>',
        "  <style>",
        (
            "    :root { color-scheme: light dark; --background: #ffffff; "
            "--foreground: #202124; --muted: #5f6368; --grid: #e2e7ee; "
            "--frame: #c8d0da; --llm: #1a73e8; --other: #a9bfdc; "
            "--group: #5b8def; }"
        ),
        (
            "    @media (prefers-color-scheme: dark) { :root { --background: #202124; "
            "--foreground: #e8eaed; --muted: #aeb4bc; --grid: #3c4043; "
            "--frame: #5f6368; --llm: #8ab4f8; --other: #596b83; "
            "--group: #8ab4f8; } }"
        ),
        "    text { fill: var(--foreground); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
        "    .title { font-size: 26px; font-weight: 700; }",
        "    .subtitle, .note, .legend, .axis-label { fill: var(--muted); }",
        "    .subtitle { font-size: 15px; }",
        "    .legend, .axis-label, .note { font-size: 13px; }",
        "    .value { font-size: 13px; font-weight: 700; }",
        "    .grid { stroke: var(--grid); stroke-width: 1; }",
        "    .frame { fill: none; stroke: var(--frame); stroke-width: 1; }",
        "  </style>",
        f'  <rect width="{width}" height="{height}" rx="16" fill="var(--background)"/>',
    ]


def render_year_chart(stats: CatalogStatistics) -> str:
    width, height = 1200, 560
    plot_left, plot_right = 78, 1150
    plot_top, plot_bottom = 142, 462
    plot_width = plot_right - plot_left
    plot_height = plot_bottom - plot_top
    maximum = axis_maximum(max(item.total for item in stats.by_year))
    step = axis_step(maximum)
    slot = plot_width / len(stats.by_year)
    bar_width = min(46.0, slot * 0.62)

    lines = svg_header(
        width,
        height,
        "Publication coverage by year",
        "Stacked bars show cataloged LLM-related and other education papers by publication year.",
    )
    lines.extend(
        [
            '  <text class="title" x="54" y="46">Publication coverage by year</text>',
            '  <text class="subtitle" x="54" y="73">Cataloged papers split by LLM relationship</text>',
            '  <rect x="54" y="94" width="12" height="12" rx="2" fill="var(--llm)"/>',
            '  <text class="legend" x="74" y="105">LLM-related</text>',
            '  <rect x="180" y="94" width="12" height="12" rx="2" fill="var(--other)"/>',
            '  <text class="legend" x="200" y="105">Other AI/education</text>',
        ]
    )

    for tick in range(0, maximum + 1, step):
        y = plot_bottom - (tick / maximum) * plot_height
        lines.append(
            f'  <line class="grid" x1="{plot_left}" y1="{y:.1f}" x2="{plot_right}" y2="{y:.1f}"/>'
        )
        lines.append(
            f'  <text class="axis-label" x="{plot_left - 12}" y="{y + 4:.1f}" text-anchor="end">{tick}</text>'
        )

    for index, item in enumerate(stats.by_year):
        center = plot_left + slot * (index + 0.5)
        x = center - bar_width / 2
        other_height = item.other / maximum * plot_height
        llm_height = item.llm_related / maximum * plot_height
        other_y = plot_bottom - other_height
        llm_y = other_y - llm_height
        lines.extend(
            [
                f'  <g><title>{item.year}: {item.total} papers ({item.llm_related} LLM-related, {item.other} other)</title>',
                f'    <rect x="{x:.1f}" y="{other_y:.1f}" width="{bar_width:.1f}" height="{other_height:.1f}" fill="var(--other)"/>',
                f'    <rect x="{x:.1f}" y="{llm_y:.1f}" width="{bar_width:.1f}" height="{llm_height:.1f}" rx="3" fill="var(--llm)"/>',
                "  </g>",
                f'  <text class="value" x="{center:.1f}" y="{max(plot_top, llm_y) - 8:.1f}" text-anchor="middle">{item.total}</text>',
                f'  <text class="axis-label" x="{center:.1f}" y="{plot_bottom + 24}" text-anchor="middle">{item.year}</text>',
            ]
        )

    lines.extend(
        [
            f'  <rect class="frame" x="{plot_left}" y="{plot_top}" width="{plot_width}" height="{plot_height}"/>',
            '  <text class="note" x="54" y="530">Source: data/papers.csv · Counts describe catalog coverage, not total field output</text>',
            "</svg>",
        ]
    )
    return "\n".join(lines) + "\n"


def render_group_chart(stats: CatalogStatistics) -> str:
    width = 1200
    row_height = 52
    plot_left, plot_right = 310, 1100
    plot_top = 118
    plot_bottom = plot_top + row_height * len(stats.by_group)
    height = plot_bottom + 92
    plot_width = plot_right - plot_left
    maximum = axis_maximum(max(item.count for item in stats.by_group))
    step = axis_step(maximum)

    lines = svg_header(
        width,
        height,
        "Research group distribution",
        "Horizontal bars compare cataloged paper counts across eight research groups.",
    )
    lines.extend(
        [
            '  <text class="title" x="54" y="46">Research group distribution</text>',
            '  <text class="subtitle" x="54" y="73">Primary group assigned to each cataloged paper</text>',
        ]
    )

    for tick in range(0, maximum + 1, step):
        x = plot_left + tick / maximum * plot_width
        lines.append(
            f'  <line class="grid" x1="{x:.1f}" y1="{plot_top}" x2="{x:.1f}" y2="{plot_bottom}"/>'
        )
        lines.append(
            f'  <text class="axis-label" x="{x:.1f}" y="{plot_top - 12}" text-anchor="middle">{tick}</text>'
        )

    for index, item in enumerate(stats.by_group):
        y = plot_top + index * row_height + 12
        bar_width = item.count / maximum * plot_width
        share = item.count / stats.total * 100
        lines.extend(
            [
                f'  <text x="{plot_left - 16}" y="{y + 19}" text-anchor="end">{escape(item.name)}</text>',
                f'  <rect x="{plot_left}" y="{y}" width="{bar_width:.1f}" height="28" rx="4" fill="var(--group)">',
                f'    <title>{escape(item.name)}: {item.count} papers ({share:.1f}%)</title>',
                "  </rect>",
                f'  <text class="value" x="{plot_left + bar_width + 10:.1f}" y="{y + 19}">{item.count} · {share:.1f}%</text>',
            ]
        )

    lines.extend(
        [
            f'  <rect class="frame" x="{plot_left}" y="{plot_top}" width="{plot_width}" height="{plot_bottom - plot_top}"/>',
            f'  <text class="note" x="54" y="{height - 28}">Source: data/papers.csv · Each paper is counted once by its primary group</text>',
            "</svg>",
        ]
    )
    return "\n".join(lines) + "\n"


def render_analysis(stats: CatalogStatistics) -> str:
    largest_group = stats.by_group[0]
    return f"""## Catalog Trends

> [!NOTE]
> These charts summarize this curated catalog. Coverage changes may reflect collection activity as well as research activity, and {stats.latest_year} is an incomplete publication year.

<p align="center">
  <img src="visualization/papers-by-year.svg" alt="Stacked bar chart of cataloged papers by year and LLM relationship" width="100%">
</p>

<p align="center">
  <img src="visualization/papers-by-group.svg" alt="Horizontal bar chart of cataloged papers by research group" width="100%">
</p>

- **Catalog coverage:** {stats.total} papers spanning **{stats.earliest_year}–{stats.latest_year}**.
- **LLM-related coverage:** {stats.llm_related} papers (**{stats.llm_share:.1%}** of the catalog).
- **Publication sources:** {stats.source_count} venues and preprint sources.
- **Largest research group:** {largest_group.name} — **{largest_group.count} papers ({largest_group.count / stats.total:.1%})**.

*Source: `data/papers.csv`; generated by `scripts/generate_statistics.py`.*
"""


def build_outputs(stats: CatalogStatistics | None = None) -> dict[Path, str]:
    if stats is None:
        stats = compute_statistics(load_papers())
    return {
        YEAR_CHART_PATH: render_year_chart(stats),
        GROUP_CHART_PATH: render_group_chart(stats),
        ANALYSIS_PATH: render_analysis(stats),
    }


def sync_outputs(outputs: dict[Path, str], check: bool = False) -> list[Path]:
    stale = [
        path
        for path, expected in outputs.items()
        if not path.exists() or path.read_text(encoding="utf-8") != expected
    ]
    if check:
        return stale

    for path, content in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    return []


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if generated statistics are stale")
    args = parser.parse_args()

    try:
        outputs = build_outputs()
    except (OSError, csv.Error, CatalogValidationError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    stale = sync_outputs(outputs, check=args.check)
    if stale:
        for path in stale:
            print(f"stale: {path.relative_to(ROOT)}", file=sys.stderr)
        return 1

    action = "verified" if args.check else "generated"
    print(f"{action} {len(outputs)} catalog statistics artifacts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
