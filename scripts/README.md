# Catalog statistics workflow

All catalog statistics derive from `data/papers.csv`; no metric is maintained by hand.

| Metric | Definition | Display |
|---|---|---|
| Papers | Number of canonical CSV records | Summary card |
| LLM-related | Records where `is_llm_related == 1`, with share of all papers | Summary card and yearly stacked bars |
| Publication sources | Distinct `publisher` values, including venues and preprint sources | Summary card |
| Latest year | Maximum publication year in the catalog | Summary card |
| Catalog section mix | Paper count and share for each top-level `section` | Horizontal bars |
| Catalog group/category mix | Counts for every canonical `section/group/category` path | Validation and reusable statistics API |

These are coverage metrics, not claims about total research output. The current year is always labeled as incomplete.

Refresh every derived artifact:

```bash
python3 scripts/refresh.py
```

Verify that generated files are current without changing them:

```bash
python3 scripts/refresh.py --check
```

Generate or verify only the statistical artifacts:

```bash
python3 scripts/generate_statistics.py
python3 scripts/generate_statistics.py --check
```

Generated files:

- `data/processed_data.csv`
- `visualization/papers-by-year.svg`
- `visualization/papers-by-section.svg`
- `visualization/papers-by-group.svg` (compatibility copy for existing links)
- `visualization/analysis.md`
- `README.md`
- `LLM4EDU.md`
