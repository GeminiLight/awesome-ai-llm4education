        // Utility: debounce
        const debounce = (fn, delay = 200) => {
            let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
        };
        // Field mapping: resolve headers case-insensitively
        let fieldMap = {};
        const F = (name) => fieldMap[name?.toLowerCase?.()] || name;
        const displayLabels = {
            'section': 'Section 🧭',
            'category': 'Category 🏷️',
            'is_llm_related': 'LLM-related 🤖',
            'type': 'Type 🧩',
            'group': 'Group 🗂️',
            'publisher': 'Publisher',
            'year': 'Year',
            'title': 'Title',
            'authors': 'Authors'
        };
        // Normalize helpers for boolean-like fields
        const normalizeBool = (val) => {
            const s = (val ?? '').toString().trim().toLowerCase();
            if(['1','true','yes','y','t'].includes(s)) return 'true';
            if(['0','false','no','n','f'].includes(s)) return 'false';
            return s;
        };
        // HTML escape function to prevent XSS
        const escapeHtml = (text) => {
            if (!text) return text;
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        // Night/Day mode toggle
        const toggleBtn = document.getElementById('toggleModeBtn');
        if (!toggleBtn) {
            console.warn('Toggle button not found');
        } else {
            toggleBtn.onclick = () => {
                document.body.classList.toggle('dark');
                toggleBtn.innerHTML = document.body.classList.contains('dark') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
                localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
            };
            if(localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark');
                toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        }

        const REQUIRED_PAPER_COLUMNS = [
            'section', 'group', 'category', 'publisher', 'year', 'type',
            'is_llm_related', 'title', 'link', 'authors', 'code'
        ];

        function validatePaperData(papers) {
            if (papers.length === 0) {
                throw new Error('The papers CSV contains no data rows');
            }

            const missingColumns = REQUIRED_PAPER_COLUMNS.filter(
                column => !Object.prototype.hasOwnProperty.call(papers[0], column)
            );
            if (missingColumns.length > 0) {
                throw new Error(`Missing required CSV columns: ${missingColumns.join(', ')}`);
            }

            const requiredValues = [
                'section', 'group', 'publisher', 'year', 'type',
                'is_llm_related', 'title', 'authors'
            ];
            papers.forEach((paper, index) => {
                const recordNumber = index + 2;
                const missingValue = requiredValues.find(column => !paper[column].trim());
                if (missingValue) {
                    throw new Error(`Missing ${missingValue} in CSV record ${recordNumber}`);
                }
                if (!/^\d{4}$/.test(paper.year)) {
                    throw new Error(`Invalid year in CSV record ${recordNumber}: ${paper.year}`);
                }
                if (!['0', '1'].includes(paper.is_llm_related)) {
                    throw new Error(
                        `Invalid is_llm_related value in CSV record ${recordNumber}: ${paper.is_llm_related}`
                    );
                }
                if (paper.link && !/^https?:\/\//.test(paper.link)) {
                    throw new Error(`Invalid link in CSV record ${recordNumber}: ${paper.link}`);
                }
            });
        }

        // Fetch the canonical data source. Processed files are derived copies, not additional papers.
        async function fetchCSV() {
            const loader = document.getElementById('loader');
            loader.classList.add('active');
            try {
                const response = await fetch('data/papers.csv', { cache: 'no-cache' });
                if (!response.ok) {
                    throw new Error(`Failed to load data/papers.csv (${response.status})`);
                }

                const papers = CSVParser.parseCSV(await response.text());
                validatePaperData(papers);
                return papers;
            } finally {
                loader.classList.remove('active');
            }
        }
        // Helper: detect which fields are categorical (for dropdown)
        function isCategorical(header, papers) {
            // Always treat these specific fields as categorical
            if(['section', 'category', 'group', 'year', 'type', 'publisher', 'is_llm_related'].includes(header.toLowerCase())) {
                return true;
            }
            // For other fields, use the original logic
            const values = Array.from(new Set(papers.map(p => p[header]).filter(Boolean)));
            return values.length > 1 && values.length <= 20 && values.every(v => v.length < 32);
        }
        // Taxonomy levels use chip-based multi-select filters.
        
        // Create filter controls
        function createFilters(papers, headers) {
            const bar = document.getElementById('filterBar');
            bar.innerHTML = '';

            // Add search box first
            const searchSection = document.createElement('div');
            searchSection.className = 'search-box';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.name = 'title';
            searchInput.placeholder = 'Search papers by title, authors, or keywords...';
            searchInput.oninput = debounce(renderPapers, 250);
            const searchIcon = document.createElement('i');
            searchIcon.className = 'fa-solid fa-search';
            searchSection.appendChild(searchInput);
            searchSection.appendChild(searchIcon);
            bar.appendChild(searchSection);

            // Create filter sections for button-based filters
            const chipFilters = ['section', 'group', 'category', 'type', 'is_llm_related'];
            chipFilters.forEach(fieldName => {
                const key = F(fieldName);
                if(key && headers.includes(key)) {
                    let rawValues = papers.map(p => p[key]).filter(v => v !== undefined && v !== null && String(v).trim() !== '');
                    if(fieldName === 'is_llm_related') {
                        rawValues = rawValues.map(v => normalizeBool(v));
                        const hasTrue = rawValues.includes('true');
                        const hasFalse = rawValues.includes('false');
                        const values = [];
                        if(hasTrue) values.push('Yes');
                        if(hasFalse) values.push('No');
                        if(values.length) {
                            createChipFilterSection(bar, key, values, displayLabels[fieldName] || key);
                            return;
                        }
                    }
                    const values = Array.from(new Set(rawValues)).sort();
                    if(values.length > 0) {
                        createChipFilterSection(bar, key, values, displayLabels[fieldName] || key);
                    }
                }
            });

            // Add year and publisher dropdowns
            ['year', 'publisher'].forEach(fieldName => {
                const key = F(fieldName);
                if(key && headers.includes(key)) {
                    const values = Array.from(new Set(papers.map(p => p[key]).filter(Boolean))).sort((a,b) => {
                        if(fieldName === 'year') return parseInt(b) - parseInt(a);
                        return a.localeCompare(b);
                    });
                    if(values.length > 0) {
                        const section = document.createElement('div');
                        section.className = 'filter-group';

                        const label = document.createElement('label');
                        label.className = 'filter-label';
                        label.textContent = displayLabels[fieldName] || key;
                        section.appendChild(label);

                        // Create custom select
                        const customSelect = createCustomSelect(key, values, displayLabels[fieldName] || key);
                        section.appendChild(customSelect);
                        bar.appendChild(section);
                    }
                }
            });
        }

        // Create custom select dropdown
        function createCustomSelect(name, options, label) {
            const container = document.createElement('div');
            container.className = 'custom-select';
            container.dataset.name = name;

            const trigger = document.createElement('div');
            trigger.className = 'select-trigger';
            trigger.innerHTML = `
                <span class="select-value">All ${label}</span>
                <i class="fa-solid fa-chevron-down"></i>
            `;

            const dropdown = document.createElement('div');
            dropdown.className = 'select-dropdown';

            // Add "All" option
            const allOption = document.createElement('div');
            allOption.className = 'select-option selected';
            allOption.dataset.value = '';
            allOption.textContent = `All ${label}`;
            allOption.onclick = () => selectOption(container, '', `All ${label}`);
            dropdown.appendChild(allOption);

            // Add other options
            options.forEach(opt => {
                const option = document.createElement('div');
                option.className = 'select-option';
                option.dataset.value = opt;
                option.textContent = opt;
                option.onclick = () => selectOption(container, opt, opt);
                dropdown.appendChild(option);
            });

            trigger.onclick = (e) => {
                e.stopPropagation();
                const wasActive = trigger.classList.contains('active');

                // Close all other dropdowns
                document.querySelectorAll('.select-trigger.active').forEach(t => {
                    t.classList.remove('active');
                    t.nextElementSibling.classList.remove('active');
                });

                if(!wasActive) {
                    trigger.classList.add('active');
                    dropdown.classList.add('active');
                }
            };

            container.appendChild(trigger);
            container.appendChild(dropdown);

            return container;
        }

        function selectOption(container, value, text) {
            const trigger = container.querySelector('.select-trigger');
            const valueSpan = trigger.querySelector('.select-value');
            const dropdown = container.querySelector('.select-dropdown');

            valueSpan.textContent = text;
            container.dataset.value = value;

            // Update selected state
            dropdown.querySelectorAll('.select-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.value === value);
            });

            // Close dropdown
            trigger.classList.remove('active');
            dropdown.classList.remove('active');

            // Trigger filter update
            renderPapers();
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.select-trigger.active').forEach(trigger => {
                trigger.classList.remove('active');
                trigger.nextElementSibling.classList.remove('active');
            });
        });

        // Create chip-based multi-select filter section
        function createChipFilterSection(container, actualFieldName, values, labelText) {
            const section = document.createElement('div');
            section.className = 'filter-group';

            const label = document.createElement('label');
            label.className = 'filter-label';
            label.textContent = labelText || actualFieldName;
            section.appendChild(label);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'filter-options';

            values.forEach(value => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.dataset.field = actualFieldName;
                btn.dataset.value = value;
                btn.textContent = value;
                btn.onclick = () => {
                    btn.classList.toggle('active');
                    renderPapers();
                };
                buttonsContainer.appendChild(btn);
            });

            section.appendChild(buttonsContainer);
            container.appendChild(section);
        }
        
        function renderCatalogOverview(papers) {
            const total = papers.length;
            const llmCount = papers.filter(
                paper => normalizeBool(paper[F('is_llm_related')]) === 'true'
            ).length;
            const publishers = new Set(papers.map(paper => paper[F('publisher')]).filter(Boolean));
            const years = papers.map(paper => Number(paper[F('year')])).sort((a, b) => a - b);
            const earliestYear = years[0];
            const latestYear = years[years.length - 1];

            document.getElementById('statTotal').textContent = total.toLocaleString();
            document.getElementById('statLLMCount').textContent = llmCount.toLocaleString();
            document.getElementById('statLLMShare').textContent =
                `${total ? ((llmCount / total) * 100).toFixed(1) : '0.0'}% of catalog`;
            document.getElementById('statSources').textContent = publishers.size.toLocaleString();
            document.getElementById('statLatestYear').textContent = latestYear || '—';
            document.getElementById('statYearRange').textContent =
                earliestYear && latestYear ? `${earliestYear}–${latestYear} coverage` : 'Coverage range';
            document.getElementById('statResultTotal').textContent = total.toLocaleString();

            const yearCounts = new Map();
            papers.forEach(paper => {
                const year = Number(paper[F('year')]);
                const count = yearCounts.get(year) || { total: 0, llm: 0 };
                count.total += 1;
                if(normalizeBool(paper[F('is_llm_related')]) === 'true') count.llm += 1;
                yearCounts.set(year, count);
            });
            const byYear = Array.from(yearCounts.entries()).sort(([a], [b]) => a - b);
            const maxYearCount = Math.max(...byYear.map(([, count]) => count.total), 1);
            const yearChart = document.getElementById('yearCoverageChart');
            yearChart.style.setProperty('--year-count', byYear.length);
            yearChart.innerHTML = byYear.map(([year, count]) => {
                const other = count.total - count.llm;
                const totalHeight = Math.max((count.total / maxYearCount) * 100, 2);
                const llmHeight = count.total ? (count.llm / count.total) * 100 : 0;
                const otherHeight = 100 - llmHeight;
                return `
                    <div class="year-bar-column" aria-label="${year}: ${count.total} papers, ${count.llm} LLM-related">
                        <span class="year-bar-value">${count.total}</span>
                        <div class="year-bar-track">
                            <div class="year-bar-stack" style="height: ${totalHeight.toFixed(2)}%">
                                <span class="year-bar-segment year-bar-llm" style="height: ${llmHeight.toFixed(2)}%" title="${count.llm} LLM-related papers"></span>
                                <span class="year-bar-segment year-bar-other" style="height: ${otherHeight.toFixed(2)}%" title="${other} other AI/education papers"></span>
                            </div>
                        </div>
                        <span class="year-bar-label">${year}</span>
                    </div>
                `;
            }).join('');

            const sectionCounts = new Map();
            papers.forEach(paper => {
                const section = paper[F('section')];
                sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1);
            });
            const bySection = Array.from(sectionCounts.entries()).sort(
                ([sectionA, countA], [sectionB, countB]) => countB - countA || sectionA.localeCompare(sectionB)
            );
            const maxSectionCount = Math.max(...bySection.map(([, count]) => count), 1);
            document.getElementById('sectionCoverageChart').innerHTML = bySection.map(([section, count]) => {
                const share = total ? ((count / total) * 100).toFixed(1) : '0.0';
                return `
                    <div class="group-bar-row" aria-label="${escapeHtml(section)}: ${count} papers, ${share}% of catalog">
                        <span class="group-bar-label">${escapeHtml(section)}</span>
                        <span class="group-bar-track" aria-hidden="true">
                            <span class="group-bar-fill" style="width: ${((count / maxSectionCount) * 100).toFixed(2)}%"></span>
                        </span>
                        <span class="group-bar-value">${count} <small>${share}%</small></span>
                    </div>
                `;
            }).join('');

            const toggleButtons = document.querySelectorAll('[data-coverage-view]');
            toggleButtons.forEach(button => {
                button.onclick = () => {
                    const selectedView = button.dataset.coverageView;
                    toggleButtons.forEach(toggle => {
                        const isActive = toggle === button;
                        toggle.classList.toggle('active', isActive);
                        toggle.setAttribute('aria-pressed', String(isActive));
                    });
                    document.getElementById('coverageYearView').hidden = selectedView !== 'year';
                    document.getElementById('coverageSectionView').hidden = selectedView !== 'section';
                };
            });
        }

        // Update filtered-results stats and active filter display
        function updateStats() {
            const filters = getFilters();
            const filtered = allPapers.filter(paper => matchesFilters(paper, filters));

            // Update visible count
            const statVisible = document.getElementById('statVisible');
            if(statVisible) statVisible.textContent = filtered.length;

            // Update active filters display
            const activeFiltersChips = document.getElementById('activeFiltersChips');
            const quickClearBtn = document.getElementById('quickClearBtn');

            if(activeFiltersChips) {
                const filterEntries = Object.entries(filters).filter(([k, v]) => k !== 'search' && v);

                if(filterEntries.length === 0 && !filters.search) {
                    activeFiltersChips.innerHTML = '<span class="active-filters-empty">No filters applied</span>';
                    if(quickClearBtn) quickClearBtn.classList.add('hidden');
                } else {
                    const chips = [];

                    if(filters.search) {
                        chips.push(`<span class="filter-chip">Search: "${escapeHtml(filters.search)}"</span>`);
                    }

                    filterEntries.forEach(([field, values]) => {
                        const label = displayLabels[field.toLowerCase()] || field;
                        if(Array.isArray(values)) {
                            values.forEach(v => {
                                chips.push(`<span class="filter-chip">${escapeHtml(label)}: ${escapeHtml(v)}</span>`);
                            });
                        } else {
                            chips.push(`<span class="filter-chip">${escapeHtml(label)}: ${escapeHtml(values)}</span>`);
                        }
                    });

                    activeFiltersChips.innerHTML = chips.join('');
                    if(quickClearBtn) quickClearBtn.classList.remove('hidden');
                }
            }
        }
        let allPapers = [], allHeaders = [];

        function getFilters() {
            const bar = document.getElementById('filterBar');
            const filters = {};

            // Get search input
            const searchInput = bar.querySelector('input[name="title"]');
            if(searchInput && searchInput.value) filters.search = searchInput.value;

            // Get custom select filters
            const customSelects = bar.querySelectorAll('.custom-select');
            customSelects.forEach(select => {
                const name = select.dataset.name;
                const value = select.dataset.value;
                if(value) filters[name] = value;
            });

            // Get active filter buttons (multi-select)
            const activeButtons = bar.querySelectorAll('.filter-btn.active');
            activeButtons.forEach(btn => {
                const field = btn.dataset.field;
                const value = btn.dataset.value;
                if(!filters[field]) filters[field] = [];
                filters[field].push(value);
            });

            return filters;
        }

        function matchesFilters(paper, filters) {
            return Object.entries(filters).every(([k, v]) => {
                if(k === 'search') {
                    const searchTerm = v.toLowerCase();
                    const title = (paper[F('title')] || '').toLowerCase();
                    const authors = (paper[F('authors')] || '').toLowerCase();
                    return title.includes(searchTerm) || authors.includes(searchTerm);
                }

                const key = F(k) || k;
                const kLower = k.toLowerCase();

                if(Array.isArray(v) && v.length) {
                    return v.some(val => {
                        if(kLower === 'is_llm_related') {
                            const paperVal = normalizeBool(paper[key]);
                            return (val === 'Yes' && paperVal === 'true') || (val === 'No' && paperVal === 'false');
                        }
                        return (paper[key] || '').toLowerCase() === val.toLowerCase();
                    });
                }

                if(kLower === 'is_llm_related') {
                    const paperVal = normalizeBool(paper[key]);
                    return (v === 'Yes' && paperVal === 'true') || (v === 'No' && paperVal === 'false');
                }

                return (paper[key] || '').toLowerCase().includes(v.toLowerCase());
            });
        }

        function renderPapers() {
            const filters = getFilters();
            let filtered = allPapers.filter(paper => matchesFilters(paper, filters));

            // Sort: year desc, then title asc
            filtered.sort((a,b) => {
                const ya = parseInt(a[F('year')]) || 0;
                const yb = parseInt(b[F('year')]) || 0;
                if(yb !== ya) return yb - ya;
                return (a[F('title')] || '').localeCompare(b[F('title')] || '');
            });

            const list = document.getElementById('paperList');
            if(filtered.length === 0) {
                list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-search"></i><p>No papers found matching your filters</p></div>';
            } else {
                list.innerHTML = filtered.map(paper => {
                    const isLLM = normalizeBool(paper[F('is_llm_related')]) === 'true';
                    const link = paper[F('link')] || '';
                    const year = paper[F('year')] || 'N/A';
                    const publisher = paper[F('publisher')] || 'N/A';
                    const title = escapeHtml(paper[F('title')] || 'Untitled');
                    const authors = escapeHtml(paper[F('authors')] || 'Unknown');
                    const section = paper[F('section')] ? escapeHtml(paper[F('section')]) : '';
                    const group = paper[F('group')] ? escapeHtml(paper[F('group')]) : '';
                    const category = paper[F('category')] ? escapeHtml(paper[F('category')]) : '';
                    const type = paper[F('type')] ? escapeHtml(paper[F('type')]) : '';

                    return `
                        <article class="paper-card">
                            <div class="paper-header">
                                <span class="paper-venue">${escapeHtml(publisher)} ${escapeHtml(year)}</span>
                                ${isLLM ? '<span class="llm-badge">🤖 LLM</span>' : ''}
                            </div>
                            <h3 class="paper-title">${title}</h3>
                            <p class="paper-authors">${authors}</p>
                            <div class="paper-footer">
                                <div class="paper-tags">
                                    ${section ? `<span class="tag">${section}</span>` : ''}
                                    ${group ? `<span class="tag">${group}</span>` : ''}
                                    ${category ? `<span class="tag">${category}</span>` : ''}
                                    ${type ? `<span class="tag">${type}</span>` : ''}
                                </div>
                                ${link ? `<a href="${escapeHtml(link)}" target="_blank" class="paper-link">View Paper <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                            </div>
                        </article>
                    `;
                }).join('');
            }

            updateStats();
        }
        // Initialize
        fetchCSV().then(papers => {
            if(!papers || !papers.length) throw new Error('No data');
            allPapers = papers;

            // Build header map
            const headerSet = new Set();
            papers.forEach(p => Object.keys(p).forEach(k => headerSet.add(k)));
            allHeaders = Array.from(headerSet);
            fieldMap = {};
            allHeaders.forEach(h => { fieldMap[h.toLowerCase()] = h; });

            renderCatalogOverview(papers);

            // Setup clear all button
            const quickClearBtn = document.getElementById('quickClearBtn');
            if(quickClearBtn) {
                quickClearBtn.onclick = () => {
                    const bar = document.getElementById('filterBar');

                    // Clear filter buttons
                    bar.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));

                    // Clear custom selects
                    bar.querySelectorAll('.custom-select').forEach(select => {
                        const trigger = select.querySelector('.select-trigger');
                        const valueSpan = trigger.querySelector('.select-value');
                        const label = select.dataset.name;
                        const displayLabel = displayLabels[label] || label;
                        valueSpan.textContent = `All ${displayLabel}`;
                        select.dataset.value = '';

                        // Update selected state
                        const dropdown = select.querySelector('.select-dropdown');
                        dropdown.querySelectorAll('.select-option').forEach(opt => {
                            opt.classList.toggle('selected', opt.dataset.value === '');
                        });
                    });

                    // Clear search input
                    bar.querySelectorAll('input').forEach(inp => inp.value = '');

                    renderPapers();
                };
            }

            createFilters(papers, allHeaders);
            renderPapers();
        }).catch(err => {
            const list = document.getElementById('paperList');
            list.innerHTML = '<div class="empty-state"><p>Failed to load papers. Please check data files.</p></div>';
            console.error(err);
        });
