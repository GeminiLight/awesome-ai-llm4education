(function (root) {
    'use strict';

    function parseCSV(text) {
        if (typeof text !== 'string') {
            throw new TypeError('CSV input must be a string');
        }

        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.slice(1);
        }

        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        let quotedFieldClosed = false;
        let rowHasContent = false;

        const finishField = () => {
            row.push(field);
            field = '';
            quotedFieldClosed = false;
        };

        const finishRow = () => {
            finishField();
            if (rowHasContent || row.length > 1 || row[0] !== '') {
                rows.push(row);
            }
            row = [];
            rowHasContent = false;
        };

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (inQuotes) {
                if (char === '"') {
                    if (nextChar === '"') {
                        field += '"';
                        i++;
                    } else {
                        inQuotes = false;
                        quotedFieldClosed = true;
                    }
                } else {
                    field += char;
                }
                continue;
            }

            if (quotedFieldClosed && char !== ',' && char !== '\r' && char !== '\n') {
                throw new Error(`Unexpected character after closing quote at offset ${i}`);
            }

            if (char === '"') {
                if (field.length > 0) {
                    throw new Error(`Unexpected quote in unquoted field at offset ${i}`);
                }
                inQuotes = true;
                rowHasContent = true;
            } else if (char === ',') {
                rowHasContent = true;
                finishField();
            } else if (char === '\r' || char === '\n') {
                finishRow();
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
            } else {
                field += char;
                rowHasContent = true;
            }
        }

        if (inQuotes) {
            throw new Error('Unterminated quoted field at end of CSV input');
        }

        if (field !== '' || row.length > 0 || quotedFieldClosed) {
            finishRow();
        }

        if (rows.length === 0) {
            return [];
        }

        const headers = rows[0];
        if (headers.some(header => header === '')) {
            throw new Error('CSV header contains an empty column name');
        }
        if (new Set(headers).size !== headers.length) {
            throw new Error('CSV header contains duplicate column names');
        }

        return rows.slice(1).map((values, index) => {
            if (values.length !== headers.length) {
                throw new Error(
                    `CSV record ${index + 2} has ${values.length} fields; expected ${headers.length}`
                );
            }

            return Object.fromEntries(headers.map((header, column) => [header, values[column]]));
        });
    }

    const api = Object.freeze({ parseCSV });
    root.CSVParser = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window);
