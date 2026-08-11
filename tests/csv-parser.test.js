const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { parseCSV } = require('../assets/js/csv-parser.js');

const projectRoot = path.resolve(__dirname, '..');
const mainColumns = [
    'section', 'group', 'category', 'publisher', 'year', 'type',
    'is_llm_related', 'title', 'link', 'authors', 'code'
];
const monthlyFiles = {
    'data/monthly/papers_2025_11_llm_education.csv': 21,
    'data/monthly/papers_2025_12_llm_education.csv': 16,
    'data/monthly/papers_2026_01_llm_education.csv': 16,
    'data/monthly/papers_2026_02_llm_education.csv': 18
};

const readCSV = relativePath => (
    parseCSV(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'))
);

test('parses quoted commas, escaped quotes, CRLF, and multiline fields', () => {
    const rows = parseCSV(
        '\uFEFFgroup,title,authors,code\r\n' +
        '"Survey, Analysis & Vision","A ""quoted"", title","One, Two",\r\n' +
        'Testing,"A multiline\ntitle",Solo,https://example.com/code\r\n'
    );

    assert.deepEqual(rows, [
        {
            group: 'Survey, Analysis & Vision',
            title: 'A "quoted", title',
            authors: 'One, Two',
            code: ''
        },
        {
            group: 'Testing',
            title: 'A multiline\ntitle',
            authors: 'Solo',
            code: 'https://example.com/code'
        }
    ]);
});

test('rejects malformed CSV instead of silently shifting fields', () => {
    assert.throws(
        () => parseCSV('a,b\n1,2,3\n'),
        /CSV record 2 has 3 fields; expected 2/
    );
    assert.throws(
        () => parseCSV('a,b\n1,"unterminated\n'),
        /Unterminated quoted field/
    );
    assert.throws(
        () => parseCSV('a,b\n1,"closed"junk\n'),
        /Unexpected character after closing quote/
    );
});

test('distinguishes blank lines from explicit empty records', () => {
    assert.deepEqual(parseCSV('value\n\n""\n'), [{ value: '' }]);
});

test('parses every canonical paper without field shifts', () => {
    const papers = readCSV('data/papers.csv');

    assert.equal(papers.length, 330);
    assert.deepEqual(Object.keys(papers[0]), mainColumns);
    assert.equal(papers[0].section, 'Surveys, Analyses & Perspectives');
    assert.equal(papers[0].group, 'Comprehensive Surveys');
    assert.equal(papers[0].year, '2023');
    assert.equal(papers[0].is_llm_related, '1');
    assert.equal(
        papers[0].authors,
        'Wensheng Gan, Zhenlian Qi, Jiayang Wu, Jerry Chun-Wei Lin'
    );
    assert.ok(papers.every(paper => /^\d{4}$/.test(paper.year)));
    assert.ok(papers.every(paper => ['0', '1'].includes(paper.is_llm_related)));
    assert.ok(papers.every(paper => !paper.link || /^https?:\/\//.test(paper.link)));
    assert.equal(new Set(papers.map(paper => paper.title.toLowerCase())).size, papers.length);
});

test('keeps processed_data as a complete sorted copy of papers.csv', () => {
    const papers = readCSV('data/papers.csv');
    const processed = readCSV('data/processed_data.csv');
    const normalize = rows => rows.map(row => JSON.stringify(row)).sort();

    assert.equal(processed.length, papers.length);
    assert.deepEqual(Object.keys(processed[0]), mainColumns);
    assert.deepEqual(normalize(processed), normalize(papers));
});

test('parses all monthly CSV records with the extended schema', () => {
    for (const [relativePath, expectedCount] of Object.entries(monthlyFiles)) {
        const rows = readCSV(relativePath);
        assert.equal(rows.length, expectedCount, relativePath);
        assert.deepEqual(Object.keys(rows[0]), [...mainColumns, 'zh_abstract']);
        assert.ok(rows.every(row => /^\d{4}$/.test(row.year)), relativePath);
        assert.ok(rows.every(row => row.is_llm_related === '1'), relativePath);
        assert.ok(rows.every(row => /^https?:\/\//.test(row.link)), relativePath);
    }
});

test('keeps categorical labels canonically cased and spaced', () => {
    const rows = [
        ...readCSV('data/papers.csv'),
        ...Object.keys(monthlyFiles).flatMap(readCSV)
    ];
    assert.ok(rows.some(row => row.section === 'Application Domains'));
    assert.ok(rows.every(row => row.section !== 'Specific Scenario'));

    for (const field of ['section', 'group', 'category', 'publisher', 'type']) {
        const variants = new Map();
        for (const row of rows) {
            const canonicalSpacing = row[field].normalize('NFC').trim().replace(/\s+/g, ' ');
            assert.equal(row[field], canonicalSpacing, `${field} has non-canonical whitespace`);

            const normalized = canonicalSpacing.toLocaleLowerCase('en-US');
            const existing = variants.get(normalized);
            assert.ok(
                existing === undefined || existing === row[field],
                `${field} has conflicting variants: ${existing} / ${row[field]}`
            );
            variants.set(normalized, row[field]);
        }
    }
});

test('uses only section/group/category combinations declared by the taxonomy', () => {
    const taxonomy = JSON.parse(
        fs.readFileSync(path.join(projectRoot, 'data/taxonomy.json'), 'utf8')
    );
    const allowed = new Map(taxonomy.sections.map(section => [
        section.name,
        new Map(section.groups.map(group => [group.name, group.categories]))
    ]));
    const rows = [
        ...readCSV('data/papers.csv'),
        ...Object.keys(monthlyFiles).flatMap(readCSV)
    ];

    for (const row of rows) {
        assert.ok(allowed.has(row.section), `unknown section: ${row.section}`);
        const groups = allowed.get(row.section);
        assert.ok(groups.has(row.group), `unknown group: ${row.section} > ${row.group}`);
        const categories = groups.get(row.group);
        if (categories.length === 0) {
            assert.equal(row.category, '', `category must be blank: ${row.section} > ${row.group}`);
        } else {
            assert.ok(
                categories.includes(row.category),
                `unknown category: ${row.section} > ${row.group} > ${row.category}`
            );
        }
    }
});

test('renders the lifecycle taxonomy at three Markdown heading levels', () => {
    const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8');

    assert.match(readme, /^## \[Teaching & Learning Lifecycle\]\(#content\)$/m);
    assert.match(readme, /^### \[Tutoring Systems\]\(#content\)$/m);
    assert.match(readme, /^#### \[General Tutoring\]\(#content\)$/m);
    assert.match(readme, />2\.1\.1\. General Tutoring<\/a>/);
    assert.doesNotMatch(readme, /^## \[Tutoring Strategy\]/m);
});

test('places Survey Scope and Catalog Trends before Content as peer sections', () => {
    const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8');
    const scopeHeading = '\n## Survey Scope\n';
    const trendsHeading = '\n## Catalog Trends\n';
    const contentHeading = '\n## [Content](#content)\n';

    assert.ok(readme.includes(scopeHeading));
    assert.ok(readme.includes(trendsHeading));
    assert.ok(readme.includes(contentHeading));
    assert.ok(
        readme.indexOf(scopeHeading) < readme.indexOf(trendsHeading),
        'Survey Scope must appear before Catalog Trends'
    );
    assert.ok(
        readme.indexOf(trendsHeading) < readme.indexOf(contentHeading),
        'Catalog Trends must appear before Content'
    );
});

test('loads the parser before the app and uses only the canonical CSV in the UI', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
    const app = fs.readFileSync(path.join(projectRoot, 'assets/js/app.js'), 'utf8');

    assert.ok(
        html.indexOf('assets/js/csv-parser.js') < html.indexOf('assets/js/app.js'),
        'csv-parser.js must load before app.js'
    );
    assert.match(app, /CSVParser\.parseCSV/);
    assert.match(app, /fetch\('data\/papers\.csv', \{ cache: 'no-cache' \}\)/);
    assert.doesNotMatch(app, /processed_data\.csv/);
});
