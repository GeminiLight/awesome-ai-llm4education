(function initPublisherCatalog(root, factory) {
    const catalog = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = catalog;
    }
    if (root) {
        root.PublisherCatalog = catalog;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    const GROUP_DEFINITIONS = Object.freeze([
        {
            id: 'education-conferences',
            label: 'Education conferences',
            description: 'Learning sciences, analytics, and tutoring',
            prefixes: [
                'aied', 'edm', 'learning@scale',
                'learning analytics and knowledge',
                'international conference on intelligent tutoring systems',
                'its', 'ectel', 'ec-tel', 'cognitive sciences'
            ]
        },
        {
            id: 'education-journals',
            label: 'Education journals',
            description: 'Education technology and learning science',
            prefixes: [
                'npj science of learning', 'computers & education',
                'ijaied', 'ieee tlt'
            ]
        },
        {
            id: 'artificial-intelligence',
            label: 'Artificial intelligence',
            description: 'General AI research',
            prefixes: ['aaai', 'ijcai']
        },
        {
            id: 'machine-learning',
            label: 'Machine learning',
            description: 'Learning methods and foundations',
            prefixes: ['neurips', 'icml', 'iclr']
        },
        {
            id: 'natural-language-processing',
            label: 'Natural language processing',
            description: 'Language, dialogue, and generation',
            prefixes: ['acl', 'emnlp', 'naacl', 'eacl', 'coling', 'colm']
        },
        {
            id: 'data-mining-information-retrieval',
            label: 'Data mining & information retrieval',
            description: 'Search, recommendation, and knowledge discovery',
            prefixes: [
                'kdd', 'www', 'sigir', 'tkde', 'tois', 'cikm', 'wsdm',
                'bigdata', 'knowledge-based systems'
            ]
        },
        {
            id: 'human-computer-interaction',
            label: 'Human-computer interaction',
            description: 'Interactive and human-centered systems',
            prefixes: ['chi', 'chigreece', 'cscw', 'uist', 'iui', 'umap']
        },
        {
            id: 'computer-vision-multimedia',
            label: 'Computer vision & multimedia',
            description: 'Visual and multimodal systems',
            prefixes: ['cvpr', 'iccv', 'eccv', 'mm']
        },
        {
            id: 'software-engineering',
            label: 'Software engineering',
            description: 'Software and computing education',
            prefixes: ['icse', 'sigcse']
        },
        {
            id: 'preprints',
            label: 'Preprints',
            description: 'Open manuscripts and early results',
            prefixes: ['arxiv']
        },
        {
            id: 'other-sources',
            label: 'Other sources',
            description: 'Interdisciplinary journals and conferences',
            prefixes: []
        }
    ]);

    const normalizePublisher = value => (
        String(value || '').normalize('NFC').trim().toLocaleLowerCase('en-US')
    );

    function classifyPublisher(publisher) {
        const normalized = normalizePublisher(publisher);
        const match = GROUP_DEFINITIONS.slice(0, -1).find(group => (
            group.prefixes.some(prefix => (
                normalized === prefix || normalized.startsWith(`${prefix} `) ||
                normalized.startsWith(`${prefix}-`)
            ))
        ));
        return match ? match.id : 'other-sources';
    }

    function groupPublishers(publishers) {
        const grouped = new Map(GROUP_DEFINITIONS.map(group => [group.id, {
            id: group.id,
            label: group.label,
            description: group.description,
            paperCount: 0,
            publishers: []
        }]));

        publishers.forEach(({ name, count }) => {
            const group = grouped.get(classifyPublisher(name));
            const paperCount = Number(count) || 0;
            group.publishers.push({ name, count: paperCount });
            group.paperCount += paperCount;
        });

        return GROUP_DEFINITIONS.map(group => grouped.get(group.id))
            .filter(group => group.publishers.length > 0)
            .map(group => ({
                ...group,
                publishers: group.publishers.sort((a, b) => (
                    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
                ))
            }));
    }

    return Object.freeze({
        GROUP_DEFINITIONS,
        classifyPublisher,
        groupPublishers
    });
}));
