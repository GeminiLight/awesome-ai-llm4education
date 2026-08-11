        // Utility: debounce
        const debounce = (fn, delay = 200) => {
            let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
        };
        // Field mapping: resolve headers case-insensitively
        let fieldMap = {};
        const F = (name) => fieldMap[name?.toLowerCase?.()] || name;
        const displayLabels = {
            'section': 'Catalog section',
            'category': 'Topic',
            'is_llm_related': 'LLM relationship',
            'type': 'Publication type',
            'group': 'Lifecycle group',
            'publisher': 'Publisher',
            'year': 'Publication year',
            'title': 'Title',
            'authors': 'Authors'
        };
        let selectIdCounter = 0;
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
            const updateThemeToggle = () => {
                const isDark = document.body.classList.contains('dark');
                toggleBtn.innerHTML = isDark
                    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
                    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
                toggleBtn.setAttribute(
                    'aria-label',
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                );
                toggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
            };
            toggleBtn.onclick = () => {
                document.body.classList.toggle('dark');
                updateThemeToggle();
                localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
            };
            if(localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark');
            }
            updateThemeToggle();
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

            const filterHeader = document.createElement('div');
            filterHeader.className = 'filter-bar-header';
            filterHeader.innerHTML = `
                <div>
                    <p class="panel-kicker">Find a paper</p>
                    <h2 class="filter-bar-title">Refine the catalog</h2>
                </div>
                <p class="filter-bar-summary">Combine filters or search across titles, authors, venues, and topics.</p>
            `;
            bar.appendChild(filterHeader);

            // Add search box first
            const searchSection = document.createElement('div');
            searchSection.className = 'search-box';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.name = 'title';
            searchInput.autocomplete = 'off';
            searchInput.setAttribute('aria-label', 'Search the paper catalog');
            searchInput.placeholder = 'Search title, author, venue, or topic';
            searchInput.oninput = debounce(renderPapers, 250);
            const searchIcon = document.createElement('i');
            searchIcon.className = 'fa-solid fa-search';
            searchSection.appendChild(searchInput);
            searchSection.appendChild(searchIcon);
            bar.appendChild(searchSection);

            const selectGrid = document.createElement('div');
            selectGrid.className = 'filter-select-grid';

            const yearKey = F('year');
            if(yearKey && headers.includes(yearKey)) {
                const years = Array.from(
                    new Set(papers.map(p => p[yearKey]).filter(Boolean))
                ).sort((a, b) => parseInt(b) - parseInt(a));
                if(years.length > 0) {
                    const section = createSelectFilterGroup(
                        displayLabels.year,
                        'Jump to a publication year'
                    );
                    section.appendChild(createCustomSelect(
                        yearKey,
                        years,
                        'All years'
                    ));
                    selectGrid.appendChild(section);
                }
            }

            const publisherKey = F('publisher');
            if(publisherKey && headers.includes(publisherKey)) {
                const section = createSelectFilterGroup(
                    displayLabels.publisher,
                    'Browse sources by research field'
                );
                section.classList.add('publisher-filter-group');
                section.appendChild(createPublisherSelect(publisherKey, papers));
                selectGrid.appendChild(section);
            }

            bar.appendChild(selectGrid);

            const taxonomyFilters = document.createElement('div');
            taxonomyFilters.className = 'taxonomy-filters';

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
                            const displayValues = rawValues.map(value => (
                                value === 'true' ? 'Yes' : 'No'
                            ));
                            createChipFilterSection(
                                taxonomyFilters,
                                key,
                                values,
                                displayLabels[fieldName] || key,
                                displayValues
                            );
                            return;
                        }
                    }
                    const values = Array.from(new Set(rawValues)).sort();
                    if(values.length > 0) {
                        createChipFilterSection(
                            taxonomyFilters,
                            key,
                            values,
                            displayLabels[fieldName] || key,
                            rawValues
                        );
                    }
                }
            });
            bar.appendChild(taxonomyFilters);
        }

        function createSelectFilterGroup(labelText, helperText) {
            const section = document.createElement('div');
            section.className = 'filter-group filter-group-select';

            const heading = document.createElement('div');
            heading.className = 'filter-label-row';
            const label = document.createElement('span');
            label.className = 'filter-label';
            label.textContent = labelText;
            const helper = document.createElement('span');
            helper.className = 'filter-helper';
            helper.textContent = helperText;
            heading.appendChild(label);
            heading.appendChild(helper);
            section.appendChild(heading);
            return section;
        }

        // Create custom select dropdown
        function createCustomSelect(name, options, allLabel) {
            const container = document.createElement('div');
            container.className = 'custom-select';
            container.dataset.name = name;
            container.dataset.allLabel = allLabel;
            container.dataset.allMeta = `${options.length} options`;

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'select-trigger';
            const dropdownId = `select-dropdown-${++selectIdCounter}`;
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', dropdownId);
            trigger.innerHTML = `
                <span class="select-trigger-copy">
                    <span class="select-value">${escapeHtml(allLabel)}</span>
                    <span class="select-meta">${options.length} options</span>
                </span>
                <i class="fa-solid fa-chevron-down"></i>
            `;

            const dropdown = document.createElement('div');
            dropdown.className = 'select-dropdown';
            dropdown.id = dropdownId;
            dropdown.setAttribute('role', 'listbox');
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.inert = true;
            dropdown.onclick = event => event.stopPropagation();

            // Add "All" option
            const allOption = document.createElement('button');
            allOption.type = 'button';
            allOption.className = 'select-option selected';
            allOption.dataset.value = '';
            allOption.dataset.meta = `${options.length} options`;
            allOption.setAttribute('role', 'option');
            allOption.setAttribute('aria-selected', 'true');
            allOption.textContent = allLabel;
            allOption.onclick = () => selectOption(
                container,
                '',
                allLabel,
                `${options.length} options`
            );
            dropdown.appendChild(allOption);

            // Add other options
            options.forEach(opt => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'select-option';
                option.dataset.value = opt;
                option.setAttribute('role', 'option');
                option.setAttribute('aria-selected', 'false');
                option.textContent = opt;
                option.onclick = () => selectOption(container, opt, opt, '1 selected year');
                dropdown.appendChild(option);
            });

            bindSelectBehavior(container, trigger, dropdown);

            container.appendChild(trigger);
            container.appendChild(dropdown);

            return container;
        }

        function createPublisherSelect(name, papers) {
            const publisherCounts = new Map();
            papers.forEach(paper => {
                const publisher = paper[name];
                if(publisher) {
                    publisherCounts.set(
                        publisher,
                        (publisherCounts.get(publisher) || 0) + 1
                    );
                }
            });
            const groups = PublisherCatalog.groupPublishers(
                Array.from(publisherCounts, ([publisherName, count]) => ({
                    name: publisherName,
                    count
                }))
            );
            const sourceCount = publisherCounts.size;
            const container = document.createElement('div');
            container.className = 'custom-select publisher-select';
            container.dataset.name = name;
            container.dataset.allLabel = 'All publishers';
            container.dataset.allMeta = `${sourceCount} sources · ${groups.length} fields`;

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'select-trigger publisher-select-trigger';
            const dropdownId = `select-dropdown-${++selectIdCounter}`;
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', dropdownId);
            trigger.innerHTML = `
                <span class="select-trigger-copy">
                    <span class="select-value">All publishers</span>
                    <span class="select-meta">${sourceCount} sources · ${groups.length} fields</span>
                </span>
                <i class="fa-solid fa-chevron-down"></i>
            `;

            const dropdown = document.createElement('div');
            dropdown.className = 'select-dropdown publisher-dropdown';
            dropdown.id = dropdownId;
            dropdown.setAttribute('role', 'listbox');
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.inert = true;
            dropdown.onclick = event => event.stopPropagation();

            const search = document.createElement('div');
            search.className = 'publisher-search';
            search.innerHTML = '<i class="fa-solid fa-search" aria-hidden="true"></i>';
            const searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.className = 'publisher-search-input';
            searchInput.placeholder = 'Search publishers or fields';
            searchInput.autocomplete = 'off';
            searchInput.setAttribute('aria-label', 'Search publishers');
            search.appendChild(searchInput);
            dropdown.appendChild(search);

            const optionList = document.createElement('div');
            optionList.className = 'publisher-option-list';
            const allOption = createPublisherOption({
                name: 'All publishers',
                count: papers.length,
                value: '',
                groupLabel: 'Entire catalog',
                selected: true
            });
            allOption.classList.add('publisher-all-option');
            allOption.onclick = () => selectOption(
                container,
                '',
                'All publishers',
                `${sourceCount} sources · ${groups.length} fields`
            );
            optionList.appendChild(allOption);

            groups.forEach(group => {
                const groupSection = document.createElement('section');
                groupSection.className = 'publisher-group';
                groupSection.dataset.search = `${group.label} ${group.description}`.toLowerCase();

                const heading = document.createElement('div');
                heading.className = 'publisher-group-heading';
                heading.innerHTML = `
                    <span>
                        <strong>${escapeHtml(group.label)}</strong>
                        <small>${escapeHtml(group.description)}</small>
                    </span>
                    <span class="publisher-group-count">${group.publishers.length} sources · ${group.paperCount} papers</span>
                `;
                groupSection.appendChild(heading);

                group.publishers.forEach(publisher => {
                    const option = createPublisherOption({
                        name: publisher.name,
                        count: publisher.count,
                        value: publisher.name,
                        groupLabel: group.label
                    });
                    option.onclick = () => selectOption(
                        container,
                        publisher.name,
                        publisher.name,
                        `${group.label} · ${publisher.count} ${publisher.count === 1 ? 'paper' : 'papers'}`
                    );
                    groupSection.appendChild(option);
                });
                optionList.appendChild(groupSection);
            });

            const empty = document.createElement('p');
            empty.className = 'publisher-search-empty hidden';
            empty.textContent = 'No publisher matches this search.';
            optionList.appendChild(empty);
            dropdown.appendChild(optionList);

            searchInput.oninput = () => filterPublisherOptions(dropdown, searchInput.value);
            searchInput.onkeydown = event => {
                if(event.key === 'Escape') {
                    closeSelect(container, true);
                }
            };
            bindSelectBehavior(container, trigger, dropdown, searchInput);

            container.appendChild(trigger);
            container.appendChild(dropdown);
            return container;
        }

        function createPublisherOption({ name, count, value, groupLabel, selected = false }) {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = `select-option publisher-option${selected ? ' selected' : ''}`;
            option.dataset.value = value;
            option.dataset.search = `${name} ${groupLabel}`.toLowerCase();
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', String(selected));

            const nameSpan = document.createElement('span');
            nameSpan.className = 'publisher-option-name';
            nameSpan.textContent = name;
            const countSpan = document.createElement('span');
            countSpan.className = 'publisher-option-count';
            countSpan.textContent = count.toLocaleString();
            countSpan.setAttribute('aria-label', `${count} papers`);
            option.appendChild(nameSpan);
            option.appendChild(countSpan);
            return option;
        }

        function filterPublisherOptions(dropdown, value) {
            const query = value.trim().toLowerCase();
            dropdown.querySelector('.publisher-all-option').hidden = Boolean(query);
            let visibleOptions = 0;
            dropdown.querySelectorAll('.publisher-group').forEach(group => {
                const groupMatches = group.dataset.search.includes(query);
                let visibleInGroup = 0;
                group.querySelectorAll('.publisher-option').forEach(option => {
                    const isVisible = !query || groupMatches || option.dataset.search.includes(query);
                    option.hidden = !isVisible;
                    if(isVisible) visibleInGroup += 1;
                });
                group.hidden = visibleInGroup === 0;
                visibleOptions += visibleInGroup;
            });
            dropdown.querySelector('.publisher-search-empty').classList.toggle(
                'hidden',
                visibleOptions > 0
            );
        }

        function bindSelectBehavior(container, trigger, dropdown, focusTarget = null) {
            trigger.onclick = event => {
                event.stopPropagation();
                const wasActive = trigger.classList.contains('active');
                closeAllSelects(container);
                if(!wasActive) {
                    trigger.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                    dropdown.setAttribute('aria-hidden', 'false');
                    dropdown.inert = false;
                    dropdown.classList.add('active');
                    if(focusTarget) window.setTimeout(() => focusTarget.focus(), 0);
                }
            };
            dropdown.onkeydown = event => {
                if(event.key === 'Escape') closeSelect(container, true);
            };
        }

        function closeSelect(container, returnFocus = false) {
            const trigger = container.querySelector('.select-trigger');
            const dropdown = container.querySelector('.select-dropdown');
            trigger.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-hidden', 'true');
            dropdown.inert = true;
            dropdown.classList.remove('active');
            if(returnFocus) trigger.focus();
        }

        function closeAllSelects(except = null) {
            document.querySelectorAll('.custom-select').forEach(select => {
                if(select !== except) closeSelect(select);
            });
        }

        function selectOption(container, value, text, metaText = '', shouldRender = true) {
            const trigger = container.querySelector('.select-trigger');
            const valueSpan = trigger.querySelector('.select-value');
            const metaSpan = trigger.querySelector('.select-meta');
            const dropdown = container.querySelector('.select-dropdown');

            valueSpan.textContent = text;
            if(metaSpan) metaSpan.textContent = metaText;
            container.dataset.value = value;

            // Update selected state
            dropdown.querySelectorAll('.select-option').forEach(opt => {
                const isSelected = opt.dataset.value === value;
                opt.classList.toggle('selected', isSelected);
                opt.setAttribute('aria-selected', String(isSelected));
            });

            // Close dropdown
            closeSelect(container);

            const publisherSearch = dropdown.querySelector('.publisher-search-input');
            if(publisherSearch) {
                publisherSearch.value = '';
                filterPublisherOptions(dropdown, '');
            }

            // Trigger filter update
            if(shouldRender) renderPapers();
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            closeAllSelects();
        });

        // Create chip-based multi-select filter section
        function createChipFilterSection(container, actualFieldName, values, labelText, rawValues) {
            const section = document.createElement('div');
            section.className = 'filter-group';

            const label = document.createElement('label');
            label.className = 'filter-label';
            label.textContent = labelText || actualFieldName;
            section.appendChild(label);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'filter-options';

            const valueCounts = rawValues.reduce((counts, value) => {
                const normalized = String(value);
                counts.set(normalized, (counts.get(normalized) || 0) + 1);
                return counts;
            }, new Map());

            values.forEach(value => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'filter-btn';
                btn.dataset.field = actualFieldName;
                btn.dataset.value = value;
                const valueLabel = document.createElement('span');
                valueLabel.textContent = value;
                const count = document.createElement('span');
                count.className = 'filter-btn-count';
                count.textContent = valueCounts.get(value) || 0;
                btn.appendChild(valueLabel);
                btn.appendChild(count);
                btn.onclick = () => {
                    btn.classList.toggle('active');
                    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
                    renderPapers();
                };
                btn.setAttribute('aria-pressed', 'false');
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
                        chips.push(`
                            <button type="button" class="filter-chip" data-clear-field="search">
                                <span>Search: “${escapeHtml(filters.search)}”</span>
                                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                                <span class="sr-only">Clear search</span>
                            </button>
                        `);
                    }

                    filterEntries.forEach(([field, values]) => {
                        const label = displayLabels[field.toLowerCase()] || field;
                        if(Array.isArray(values)) {
                            values.forEach(v => {
                                chips.push(`
                                    <button type="button" class="filter-chip" data-clear-field="${escapeHtml(field)}" data-clear-value="${escapeHtml(v)}">
                                        <span>${escapeHtml(label)}: ${escapeHtml(v)}</span>
                                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                                        <span class="sr-only">Remove ${escapeHtml(label)} filter</span>
                                    </button>
                                `);
                            });
                        } else {
                            chips.push(`
                                <button type="button" class="filter-chip" data-clear-field="${escapeHtml(field)}" data-clear-value="${escapeHtml(values)}">
                                    <span>${escapeHtml(label)}: ${escapeHtml(values)}</span>
                                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                                    <span class="sr-only">Remove ${escapeHtml(label)} filter</span>
                                </button>
                            `);
                        }
                    });

                    activeFiltersChips.innerHTML = chips.join('');
                    activeFiltersChips.querySelectorAll('[data-clear-field]').forEach(chip => {
                        chip.onclick = () => clearSingleFilter(
                            chip.dataset.clearField,
                            chip.dataset.clearValue || ''
                        );
                    });
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
                    const searchableFields = [
                        'title', 'authors', 'publisher', 'section', 'group', 'category'
                    ];
                    return searchableFields.some(field => (
                        (paper[F(field)] || '').toLowerCase().includes(searchTerm)
                    ));
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

                if(kLower === 'publisher' || kLower === 'year') {
                    return (paper[key] || '').toLowerCase() === v.toLowerCase();
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
                list.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-state-icon"><i class="fa-solid fa-filter-circle-xmark" aria-hidden="true"></i></span>
                        <h3 class="empty-title">No papers match these filters</h3>
                        <p class="empty-subtitle">Try a broader topic, another publisher, or clear the current filters.</p>
                        <button type="button" class="reset-button" id="emptyResetBtn">Clear filters</button>
                    </div>
                `;
                document.getElementById('emptyResetBtn').onclick = clearAllFilters;
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
                    const titleMarkup = link
                        ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${title}</a>`
                        : title;

                    return `
                        <article class="paper-card">
                            <div class="paper-header">
                                <span class="paper-venue">${escapeHtml(publisher)} <span>${escapeHtml(year)}</span></span>
                                ${isLLM ? '<span class="llm-badge">LLM-related</span>' : ''}
                            </div>
                            <h3 class="paper-title">${titleMarkup}</h3>
                            <p class="paper-authors">${authors}</p>
                            <div class="paper-footer">
                                <div class="paper-tags">
                                    ${section ? `<span class="tag">${section}</span>` : ''}
                                    ${group ? `<span class="tag">${group}</span>` : ''}
                                    ${category ? `<span class="tag">${category}</span>` : ''}
                                    ${type ? `<span class="tag">${type}</span>` : ''}
                                </div>
                                ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer" class="paper-link">View paper <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : ''}
                            </div>
                        </article>
                    `;
                }).join('');
            }

            updateStats();
        }

        function resetCustomSelect(select) {
            selectOption(
                select,
                '',
                select.dataset.allLabel,
                select.dataset.allMeta,
                false
            );
        }

        function clearSingleFilter(field, value) {
            const bar = document.getElementById('filterBar');
            if(field === 'search') {
                const searchInput = bar.querySelector('input[name="title"]');
                if(searchInput) searchInput.value = '';
            } else {
                const select = Array.from(bar.querySelectorAll('.custom-select')).find(
                    candidate => candidate.dataset.name === field
                );
                if(select) {
                    resetCustomSelect(select);
                } else {
                    bar.querySelectorAll('.filter-btn.active').forEach(button => {
                        if(button.dataset.field === field && button.dataset.value === value) {
                            button.classList.remove('active');
                            button.setAttribute('aria-pressed', 'false');
                        }
                    });
                }
            }
            renderPapers();
        }

        function clearAllFilters() {
            const bar = document.getElementById('filterBar');
            bar.querySelectorAll('.filter-btn.active').forEach(button => {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            });
            bar.querySelectorAll('.custom-select').forEach(resetCustomSelect);
            const searchInput = bar.querySelector('input[name="title"]');
            if(searchInput) searchInput.value = '';
            renderPapers();
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
                quickClearBtn.onclick = clearAllFilters;
            }

            createFilters(papers, allHeaders);
            renderPapers();
        }).catch(err => {
            const list = document.getElementById('paperList');
            list.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon"><i class="fa-solid fa-file-circle-exclamation" aria-hidden="true"></i></span>
                    <h3 class="empty-title">The catalog could not be loaded</h3>
                    <p class="empty-subtitle">Check the data file and reload this page.</p>
                </div>
            `;
            console.error(err);
        });
