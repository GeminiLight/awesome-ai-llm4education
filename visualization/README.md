# Catalog visualizations

The SVG charts and `analysis.md` in this directory are generated from `data/papers.csv`.
`papers-by-section.svg` is the canonical taxonomy chart; `papers-by-group.svg` is
kept as a compatibility copy for existing links.
Do not edit them directly; update the CSV or scripts and run:

```bash
python3 scripts/refresh.py
python3 scripts/refresh.py --check
```
