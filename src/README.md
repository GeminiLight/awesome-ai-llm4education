# Code Auto-generator

When adding new papers, update `data/papers.csv`, then refresh all generated files from the repository root.

p.s.
1. When adding a paper containing more than one problem, please use ";" to separate them in the first column.
2. When adding a problem that has accepted abbreviations, please add it to the "abbr" map at the beginning of generator.py.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python3 scripts/refresh.py
python3 scripts/refresh.py --check
```
