# Code Auto-generator

When adding new papers, update `data/papers.csv`, then refresh all generated files from the repository root.

The allowed `section/group/category` hierarchy is defined once in
`data/taxonomy.json`; both validation and Markdown generation read that file.
`src/visualize.ipynb` is a historical exploratory notebook and is not part of
the supported generation pipeline.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python3 scripts/refresh.py
python3 scripts/refresh.py --check
```
