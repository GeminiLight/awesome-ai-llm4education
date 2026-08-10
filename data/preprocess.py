import csv
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parent
SOURCE_PATH = DATA_DIR / 'papers.csv'
OUTPUT_PATH = DATA_DIR / 'processed_data.csv'
COLUMNS = [
    'group', 'category', 'publisher', 'year', 'type',
    'is_llm_related', 'title', 'link', 'authors', 'code',
]


def load_papers():
    with SOURCE_PATH.open(encoding='utf-8-sig', newline='') as source:
        reader = csv.DictReader(source, strict=True)
        if reader.fieldnames != COLUMNS:
            raise ValueError(
                f'Unexpected papers.csv columns: {reader.fieldnames}; expected {COLUMNS}'
            )

        rows = list(reader)

    for record_number, row in enumerate(rows, start=2):
        if None in row or any(value is None for value in row.values()):
            raise ValueError(f'Malformed CSV record {record_number}')

    return rows


def main():
    rows = load_papers()
    rows.sort(
        key=lambda row: (
            row['category'], row['publisher'], int(row['year']), row['type']
        )
    )

    with OUTPUT_PATH.open('w', encoding='utf-8', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=COLUMNS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    main()
