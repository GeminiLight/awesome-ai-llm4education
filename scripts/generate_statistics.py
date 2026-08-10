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
    load_taxonomy,
)


OUTPUT_DIR = ROOT / "visualization"
YEAR_CHART_PATH = OUTPUT_DIR / "papers-by-year.svg"
SECTION_CHART_PATH = OUTPUT_DIR / "papers-by-section.svg"
LEGACY_GROUP_CHART_PATH = OUTPUT_DIR / "papers-by-group.svg"
ANALYSIS_PATH = OUTPUT_DIR / "analysis.md"
LIFECYCLE_SECTION = "Teaching & Learning Lifecycle"

SECTION_COLOR_TOKENS = {
    "Surveys, Analyses & Perspectives": "section-surveys",
    "Teaching & Learning Lifecycle": "section-lifecycle",
    "Application Domains": "section-applications",
    "Datasets, Benchmarks & Toolkits": "section-resources",
}
LIFECYCLE_GROUP_COLOR_TOKENS = {
    "Tutoring Systems": "lifecycle-tutoring",
    "Material Preparation": "lifecycle-material",
    "Teaching Support": "lifecycle-support",
    "Learner Modeling": "lifecycle-modeling",
    "Learning Assessment": "lifecycle-assessment",
}
SURVEY_SCOPE = (
    ("Artificial Intelligence", "AAAI, IJCAI"),
    (
        "Data Mining, Web & Information Retrieval",
        "KDD, WWW, SIGIR, CIKM, WSDM",
    ),
    (
        "Education & Learning Sciences",
        "AIED, EDM, LAK, Learning@Scale, EC-TEL, ITS, ICALT",
    ),
    ("Human-Computer Interaction", "CHI, CSCW, UIST, IUI"),
    ("Machine Learning", "NeurIPS, ICML, ICLR"),
    (
        "Natural Language Processing",
        "ACL, EMNLP, NAACL, EACL, COLING, COLM, and Findings tracks",
    ),
    (
        "Selected Journals",
        "IJAIED, Computers & Education, IEEE TLT, TKDE, TOIS, "
        "npj Science of Learning",
    ),
    (
        "Software Engineering & Computing Education",
        "ICSE, SIGCSE, ITiCSE",
    ),
)


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
            "    :root { color-scheme: light dark; --background: #fcfbf8; "
            "--plot: #f7f5f0; --foreground: #26332e; --muted: #68756f; "
            "--grid: #e2e6e1; --frame: #cbd4ce; --llm: #4d8b7d; "
            "--other: #d7a28e; --section-surveys: #c49a52; "
            "--section-lifecycle: #4d8b7d; --section-applications: #c7746b; "
            "--section-resources: #8878a5; --section-default: #7c9189; "
            "--lifecycle-tutoring: #386d63; --lifecycle-material: #4f877b; "
            "--lifecycle-support: #6fa093; --lifecycle-modeling: #8bb5aa; "
            "--lifecycle-assessment: #a9c7bf; }"
        ),
        (
            "    @media (prefers-color-scheme: dark) { :root { --background: #18201e; "
            "--plot: #202a27; --foreground: #edf2ef; --muted: #a9b5af; "
            "--grid: #34413c; --frame: #4b5b55; --llm: #77b6a8; "
            "--other: #dda58e; --section-surveys: #d5af69; "
            "--section-lifecycle: #77b6a8; --section-applications: #de9187; "
            "--section-resources: #aa99c8; --section-default: #9cb3aa; "
            "--lifecycle-tutoring: #85c5b6; --lifecycle-material: #73b3a5; "
            "--lifecycle-support: #62a092; --lifecycle-modeling: #528b80; "
            "--lifecycle-assessment: #43766d; } }"
        ),
        "    text { fill: var(--foreground); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
        "    .title { font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700; }",
        "    .subtitle, .note, .legend, .axis-label { fill: var(--muted); }",
        "    .subtitle { font-size: 15px; letter-spacing: 0.01em; }",
        "    .legend, .axis-label, .note { font-size: 13px; }",
        "    .value { font-size: 13px; font-variant-numeric: tabular-nums; font-weight: 700; }",
        "    .grid { stroke: var(--grid); stroke-width: 1; }",
        "    .frame { fill: none; stroke: var(--frame); stroke-width: 1; }",
        "    .plot-background { fill: var(--plot); }",
        "    .lifecycle-segment { stroke: var(--background); stroke-width: 1.5; }",
        "  </style>",
        f'  <rect width="{width}" height="{height}" rx="18" fill="var(--background)"/>',
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
            '  <rect x="54" y="94" width="12" height="12" rx="6" fill="var(--llm)"/>',
            '  <text class="legend" x="74" y="105">LLM-related</text>',
            '  <rect x="180" y="94" width="12" height="12" rx="6" fill="var(--other)"/>',
            '  <text class="legend" x="200" y="105">Other AI/education</text>',
            f'  <rect class="plot-background" x="{plot_left}" y="{plot_top}" width="{plot_width}" height="{plot_height}" rx="10"/>',
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
                f'    <rect x="{x:.1f}" y="{llm_y:.1f}" width="{bar_width:.1f}" height="{llm_height:.1f}" rx="5" fill="var(--llm)"/>',
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


def render_section_chart(stats: CatalogStatistics) -> str:
    width = 1200
    row_height = 52
    plot_left, plot_right = 310, 1100
    plot_top = 154
    plot_bottom = plot_top + row_height * len(stats.by_section)
    height = plot_bottom + 92
    plot_width = plot_right - plot_left
    maximum = axis_maximum(max(item.count for item in stats.by_section))
    step = axis_step(maximum)
    group_counts = {
        (item.section, item.name): item.count for item in stats.by_group
    }
    lifecycle_groups = [
        (
            group_name,
            group_counts.get((LIFECYCLE_SECTION, group_name), 0),
            LIFECYCLE_GROUP_COLOR_TOKENS.get(group_name, "section-lifecycle"),
        )
        for group_name in load_taxonomy()[LIFECYCLE_SECTION]
    ]
    lifecycle_count = next(
        item.count for item in stats.by_section if item.name == LIFECYCLE_SECTION
    )
    if sum(count for _, count, _ in lifecycle_groups) != lifecycle_count:
        raise ValueError("lifecycle group counts do not match the section total")

    lines = svg_header(
        width,
        height,
        "Catalog section distribution",
        "Horizontal bars compare four top-level sections. The Teaching and Learning "
        "Lifecycle bar is segmented into its five groups.",
    )
    lines.extend(
        [
            '  <text class="title" x="54" y="46">Catalog section distribution</text>',
            '  <text class="subtitle" x="54" y="73">Top-level sections; the lifecycle is segmented into its five groups</text>',
            f'  <rect class="plot-background" x="{plot_left}" y="{plot_top}" width="{plot_width}" height="{plot_bottom - plot_top}" rx="10"/>',
        ]
    )

    legend_x = 54.0
    for group_name, count, color_token in lifecycle_groups:
        legend_label = f"{group_name} · {count}"
        lines.extend(
            [
                f'  <rect x="{legend_x:.1f}" y="94" width="12" height="12" rx="3" fill="var(--{color_token})"/>',
                f'  <text class="legend" x="{legend_x + 20:.1f}" y="105">{escape(legend_label)}</text>',
            ]
        )
        legend_x += 28 + len(legend_label) * 6.5

    for tick in range(0, maximum + 1, step):
        x = plot_left + tick / maximum * plot_width
        lines.append(
            f'  <line class="grid" x1="{x:.1f}" y1="{plot_top}" x2="{x:.1f}" y2="{plot_bottom}"/>'
        )
        lines.append(
            f'  <text class="axis-label" x="{x:.1f}" y="{plot_top - 12}" text-anchor="middle">{tick}</text>'
        )

    for index, item in enumerate(stats.by_section):
        y = plot_top + index * row_height + 12
        bar_width = item.count / maximum * plot_width
        share = item.count / stats.total * 100
        color_token = SECTION_COLOR_TOKENS.get(item.name, "section-default")
        lines.append(
            f'  <text x="{plot_left - 16}" y="{y + 19}" text-anchor="end">{escape(item.name)}</text>'
        )
        if item.name == LIFECYCLE_SECTION:
            lines.extend(
                [
                    '  <defs><clipPath id="lifecycle-bar-clip">',
                    f'    <rect x="{plot_left}" y="{y}" width="{bar_width:.1f}" height="28" rx="7"/>',
                    "  </clipPath></defs>",
                    '  <g clip-path="url(#lifecycle-bar-clip)">',
                ]
            )
            segment_x = float(plot_left)
            for group_name, count, group_color_token in lifecycle_groups:
                segment_width = count / maximum * plot_width
                lifecycle_share = count / item.count * 100
                lines.extend(
                    [
                        f'    <rect class="lifecycle-segment" x="{segment_x:.1f}" y="{y}" width="{segment_width:.1f}" height="28" fill="var(--{group_color_token})">',
                        f'      <title>{escape(group_name)}: {count} papers ({lifecycle_share:.1f}% of lifecycle)</title>',
                        "    </rect>",
                    ]
                )
                segment_x += segment_width
            lines.append("  </g>")
        else:
            lines.extend(
                [
                    f'  <rect x="{plot_left}" y="{y}" width="{bar_width:.1f}" height="28" rx="7" fill="var(--{color_token})">',
                    f'    <title>{escape(item.name)}: {item.count} papers ({share:.1f}%)</title>',
                    "  </rect>",
                ]
            )
        lines.append(
            f'  <text class="value" x="{plot_left + bar_width + 10:.1f}" y="{y + 19}">{item.count} · {share:.1f}%</text>'
        )

    lines.extend(
        [
            f'  <rect class="frame" x="{plot_left}" y="{plot_top}" width="{plot_width}" height="{plot_bottom - plot_top}"/>',
            f'  <text class="note" x="54" y="{height - 28}">Source: data/papers.csv · Lifecycle segments sum to its top-level section total</text>',
            "</svg>",
        ]
    )
    return "\n".join(lines) + "\n"


def render_analysis(stats: CatalogStatistics) -> str:
    largest_section = stats.by_section[0]
    survey_scope = "\n".join(
        f"- **{field}:** {venues}" for field, venues in SURVEY_SCOPE
    )
    return f"""## Survey Scope

This catalog monitors representative venues across AI, computing, and education. The list is indicative rather than exhaustive; relevant workshops, journals, and arXiv preprints are also considered.

{survey_scope}

## Catalog Trends

> [!NOTE]
> These charts summarize this curated catalog. Coverage changes may reflect collection activity as well as research activity, and {stats.latest_year} is an incomplete publication year.

<p align="center">
  <img src="visualization/papers-by-year.svg" alt="Stacked bar chart of cataloged papers by year and LLM relationship" width="100%">
</p>

<p align="center">
  <img src="visualization/papers-by-section.svg" alt="Horizontal bar chart of cataloged papers by top-level section, with Teaching and Learning Lifecycle split into five groups" width="100%">
</p>

- **Catalog coverage:** {stats.total} papers spanning **{stats.earliest_year}–{stats.latest_year}**.
- **LLM-related coverage:** {stats.llm_related} papers (**{stats.llm_share:.1%}** of the catalog).
- **Publication sources:** {stats.source_count} venues and preprint sources.
- **Largest catalog section:** {largest_section.name} — **{largest_section.count} papers ({largest_section.count / stats.total:.1%})**.

*Source: `data/papers.csv`; generated by `scripts/generate_statistics.py`.*
"""


def build_outputs(stats: CatalogStatistics | None = None) -> dict[Path, str]:
    if stats is None:
        stats = compute_statistics(load_papers())
    section_chart = render_section_chart(stats)
    return {
        YEAR_CHART_PATH: render_year_chart(stats),
        SECTION_CHART_PATH: section_chart,
        # Preserve existing external links while the canonical filename migrates.
        LEGACY_GROUP_CHART_PATH: section_chart,
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
    parser.add_argument(
        "--check",
        action="store_true",
        help="fail if generated statistics are stale",
    )
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
