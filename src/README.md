# Code Auto-generator

When adding new papers, please add them in "data/papers.csv", then run generator.py to update "README.md".

p.s.
1. When adding a paper containing more than one problem, please use ";" to separate them in the first column.
2. When adding a problem that has accepted abbreviations, please add it to the "abbr" map at the beginning of generator.py.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
cd src
python generator.py
```