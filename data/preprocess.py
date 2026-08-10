import csv
import io
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


def render_processed_csv():
    rows = load_papers()
    rows.sort(
        key=lambda row: (
            row['category'], row['publisher'], int(row['year']), row['type']
        )
    )

    output = io.StringIO(newline='')
    writer = csv.DictWriter(output, fieldnames=COLUMNS, lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue()


def write_processed_csv():
    OUTPUT_PATH.write_text(render_processed_csv(), encoding='utf-8')


def main():
    write_processed_csv()


if __name__ == '__main__':
    main()
