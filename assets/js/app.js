        // Utility: debounce
        const debounce = (fn, delay = 200) => {
            let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
        };
        // Field mapping: resolve headers case-insensitively
        let fieldMap = {};
        const F = (name) => fieldMap[name?.toLowerCase?.()] || name;
        const displayLabels = {
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

        // Fetch and parse CSV: prefer merging both files if available
        async function fetchCSV() {
            const loader = document.getElementById('loader');
            loader.classList.add('active');
            try {
                const files = ['data/papers.csv', 'data/processed_data.csv'];
                const results = await Promise.allSettled(files.map(f => fetch(f)));
                const okResponses = [];
                for (let i = 0; i < results.length; i++) {
                    const res = results[i];
                    if(res.status === 'fulfilled' && res.value && res.value.ok) {
                        okResponses.push(res.value);
                    }
                }
                if(okResponses.length === 0) throw new Error('Failed to load data files');
                const allText = await Promise.all(okResponses.map(r => r.text()));
                const arrays = allText.map(txt => parseCSV(txt));
                // Merge arrays (simple concat). We'll compute header union later.
                return arrays.flat();
            } finally {
                loader.classList.remove('active');
            }
        }
        function parseCSV(text) {
            const lines = text.split(/\r?\n/).filter(l => l.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            return lines.slice(1).map(line => {
                const values = line.match(/(?:"[^"]*"|[^,])+/g) || line.split(',');
                const obj = {};
                headers.forEach((h, i) => {
                    obj[h] = (values[i] || '').replace(/^"|"$/g, '').trim();
                });
                return obj;
            });
        }
        // Helper: detect which fields are categorical (for dropdown)
        function isCategorical(header, papers) {
            // Always treat these specific fields as categorical
            if(['category', 'group', 'year', 'type', 'publisher', 'is_llm_related'].includes(header.toLowerCase())) {
                return true;
            }
            // For other fields, use the original logic
            const values = Array.from(new Set(papers.map(p => p[header]).filter(Boolean)));
            return values.length > 1 && values.length <= 20 && values.every(v => v.length < 32);
        }
        // Group is now a chip-based multi-select; group button bar removed
        
        // Create filter controls
        function createFilters(papers, headers) {
            const bar = document.getElementById('filterBar');
            bar.innerHTML = '';
            // Filter out 'link' and 'code' fields from filters but keep them in data
            const filteredHeaders = headers.filter(h => !['link', 'code'].includes(h.toLowerCase()));
            // Prepare a dedicated inline row container for Publisher, Year, Title, Authors, and Reset
            const inlineRow = document.createElement('div');
            inlineRow.className = 'filter-row-inline';
            
            // Create filter sections for button-based filters
            const chipFilters = ['group', 'category', 'is_llm_related', 'type'];
            chipFilters.forEach(fieldName => {
                const key = F(fieldName);
                if(!allHeaders.map(h=>h.toLowerCase()).includes(fieldName)) {
                    // if header case differs, ensure key exists in dataset
                    if(!fieldMap[fieldName]) fieldMap[fieldName] = key;
                }
                if(key && headers.includes(key)) {
                    let rawValues = papers.map(p => p[key]).filter(v => v !== undefined && v !== null && String(v).trim() !== '');
                    if(fieldName === 'is_llm_related') {
                        rawValues = rawValues.map(v => normalizeBool(v));
                        // Force only 'true'/'false' options if present
                        const hasTrue = rawValues.includes('true');
                        const hasFalse = rawValues.includes('false');
                        const values = [];
                        if(hasTrue) values.push('true');
                        if(hasFalse) values.push('false');
                        if(values.length) {
                            createChipFilterSection(bar, key, values, displayLabels[fieldName] || key);
                            return;
                        }
                        // Fallback to unique values if data is irregular
                    }
                    const values = Array.from(new Set(rawValues));
                    if(isCategorical(fieldName, papers)) {
                        createChipFilterSection(bar, key, values, displayLabels[fieldName] || key);
                    }
                }
            });
            
            // Create filter sections for other categorical fields
            filteredHeaders.forEach(h => {
                // Skip fields already handled as button filters or group (handled separately)
                if(h.toLowerCase() === 'group' || chipFilters.includes(h.toLowerCase())) return;
                
                const values = Array.from(new Set(papers.map(p => p[h]).filter(Boolean)));
                if(isCategorical(h, papers)) {
                    const section = document.createElement('div');
                    section.className = 'filter-section';
                    section.dataset.field = h.toLowerCase();
                    if(['title', 'authors'].includes(h.toLowerCase())) {
                        section.classList.add('filter-section-wide');
                    }
                    
                    const label = document.createElement('div');
                    label.className = 'filter-label';
                    const lbl = displayLabels[h.toLowerCase()] || h;
                    label.textContent = lbl;
                    section.appendChild(label);
                    
                    const sel = document.createElement('select');
                    sel.name = h;
                    sel.innerHTML = `<option value="">All ${lbl}</option>` + values.map(o => `<option value="${o}">${o}</option>`).join('');
                    sel.onchange = () => { renderPapers(); updateFilterOptions(); };
                    section.appendChild(sel);

                    // If this is publisher or year, add to inline row; else append to bar
                    if(['publisher','year'].includes(h.toLowerCase())) {
                        inlineRow.appendChild(section);
                    } else {
                        bar.appendChild(section);
                    }
                } else {
                    const section = document.createElement('div');
                    section.className = 'filter-section';
                    section.dataset.field = h.toLowerCase();
                    if(['title', 'authors'].includes(h.toLowerCase())) {
                        section.classList.add('filter-section-wide');
                    }
                    
                    const label = document.createElement('div');
                    label.className = 'filter-label';
                    const lbl2 = displayLabels[h.toLowerCase()] || h;
                    label.textContent = lbl2;
                    section.appendChild(label);
                    
                    const inp = document.createElement('input');
                    inp.type = 'text';
                    inp.placeholder = `Search ${lbl2}`;
                    inp.name = h;
                    inp.oninput = debounce(() => { renderPapers(); updateFilterOptions(); }, 250);
                    section.appendChild(inp);

                    // If this is title or authors, add to inline row; else append to bar
                    if(['title','authors'].includes(h.toLowerCase())) {
                        inlineRow.appendChild(section);
                    } else {
                        bar.appendChild(section);
                    }
                }
            });
            
            // Add reset button in its own section
            const resetSection = document.createElement('div');
            resetSection.className = 'filter-section';
            resetSection.style.alignSelf = 'flex-end';
            
            const resetBtn = document.createElement('button');
            resetBtn.className = 'reset-button';
            resetBtn.innerHTML = '<i class="fa-solid fa-refresh"></i> Reset';
            resetBtn.onclick = () => {
                // Clear all filters except group buttons
                const selectElements = bar.querySelectorAll('select');
                selectElements.forEach(sel => {
                    sel.selectedIndex = 0;
                });
                
                const inputElements = bar.querySelectorAll('input');
                inputElements.forEach(inp => {
                    inp.value = '';
                });
                
                // Reset chip filters
                const chips = bar.querySelectorAll('.chip.active');
                chips.forEach(c => c.classList.remove('active'));
                
                renderPapers();
                updateFilterOptions();
            };
            resetSection.appendChild(resetBtn);
            // add reset to inline row
            inlineRow.appendChild(resetSection);

            // Finally, append inline row to the bar at the end so it appears as one row
            bar.appendChild(inlineRow);

            // Wire Clear All and empty reset
            const clearAllBtn = document.getElementById('clearAllBtn');
            if(clearAllBtn) clearAllBtn.onclick = resetBtn.onclick;
            const emptyResetBtn = document.getElementById('emptyResetBtn');
            if(emptyResetBtn) emptyResetBtn.onclick = resetBtn.onclick;
        }
        
        // Create chip-based multi-select filter section
        function createChipFilterSection(container, actualFieldName, values, labelText) {
            const section = document.createElement('div');
            section.className = 'filter-section';
            section.dataset.field = (actualFieldName || '').toLowerCase();
            if(['category'].includes(actualFieldName.toLowerCase())) {
                section.classList.add('filter-section-wide');
            }
            
            // Add label
            const label = document.createElement('div');
            label.className = 'filter-label';
            label.textContent = labelText || actualFieldName;
            section.appendChild(label);
            
            // Add buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'filter-section-row';
            
            // Add chips for each value
            values.forEach(value => {
                const chip = document.createElement('button');
                chip.className = 'chip';
                chip.setAttribute('role', 'button');
                chip.setAttribute('aria-pressed', 'false');
                chip.dataset.field = actualFieldName;
                chip.dataset.value = value;
                chip.innerHTML = `${value} <span class="count">0</span>`;
                chip.onclick = () => {
                    if(chip.getAttribute('aria-disabled') === 'true') return;
                    const active = chip.classList.toggle('active');
                    chip.setAttribute('aria-pressed', active ? 'true' : 'false');
                    renderPapers();
                    updateFilterOptions();
                };
                buttonsContainer.appendChild(chip);
            });
            
            section.appendChild(buttonsContainer);
            container.appendChild(section);
        }
        
        // Update filter options based on current filtered papers
        function updateFilterOptions() {
            const filters = getFilters();
            // Group-first scoping for options and counts (support multi-select OR)
            const gk = F('group');
            const gval = filters[gk];
            const groupScoped = Array.isArray(gval) && gval.length
                ? allPapers.filter(p => gval.some(val => (p[gk]||'').toLowerCase() === String(val).toLowerCase()))
                : (!gval || (Array.isArray(gval) && !gval.length) ? allPapers.slice() : allPapers.filter(p => (p[gk]||'').toLowerCase() === String(gval).toLowerCase()));
            
            // Current filtered used for rendering results
            const currentFiltered = allPapers.filter(paper => {
                return Object.entries(filters).every(([k, v]) => {
                    const key = F(k) || k;
                    const kLower = (k || '').toLowerCase();
                    if(v == null) return true;
                    if(Array.isArray(v) && v.length) {
                        return v.some(val => {
                            if(kLower === 'is_llm_related') {
                                return normalizeBool(paper[key]) === normalizeBool(String(val));
                            }
                            return (paper[key]||'').toLowerCase() === String(val).toLowerCase();
                        });
                    }
                    if(!v) return true;
                    if(kLower === 'is_llm_related') {
                        return normalizeBool(paper[key]) === normalizeBool(String(v));
                    }
                    return (paper[key]||'').toLowerCase().includes(String(v).toLowerCase());
                });
            });
            
            const bar = document.getElementById('filterBar');
            
            // No group button bar; group selection is via chips

            // Update Group chip counts: compute with all OTHER filters applied (exclude group)
            if (gk) {
                const filtersNoGroup = { ...filters };
                delete filtersNoGroup[gk];
                const baseForGroupCounts = allPapers.filter(paper => {
                    return Object.entries(filtersNoGroup).every(([k, v]) => {
                        const key = F(k) || k;
                        const kLower = (k || '').toLowerCase();
                        if(v == null) return true;
                        if(Array.isArray(v) && v.length) {
                            return v.some(val => {
                                if(kLower === 'is_llm_related') {
                                    return normalizeBool(paper[key]) === normalizeBool(String(val));
                                }
                                return (paper[key]||'').toLowerCase() === String(val).toLowerCase();
                            });
                        }
                        if(!v) return true;
                        if(kLower === 'is_llm_related') {
                            return normalizeBool(paper[key]) === normalizeBool(String(v));
                        }
                        return (paper[key]||'').toLowerCase().includes(String(v).toLowerCase());
                    });
                });
                const groupCounts = baseForGroupCounts.reduce((acc, p) => {
                    const v = p[gk];
                    if(v) acc[v] = (acc[v]||0)+1;
                    return acc;
                }, {});
                const gchips = bar.querySelectorAll(`.chip[data-field="${gk}"]`);
                gchips.forEach(chip => {
                    const v = chip.dataset.value;
                    const c = groupCounts[v] || 0;
                    const countEl = chip.querySelector('.count');
                    if(countEl) countEl.textContent = String(c);
                    if(c === 0) {
                        chip.setAttribute('aria-disabled', 'true');
                        if(chip.classList.contains('active')) {
                            chip.classList.remove('active');
                            chip.setAttribute('aria-pressed', 'false');
                        }
                    } else {
                        chip.removeAttribute('aria-disabled');
                    }
                });
            }
            
            // Update select elements
            const selects = bar.querySelectorAll('select');
            selects.forEach(ctrl => {
                const fieldName = ctrl.name;
                const currentValue = ctrl.value;
                const availableValues = Array.from(new Set(groupScoped.map(p => p[fieldName]).filter(Boolean)));
                ctrl.innerHTML = `<option value="">All ${fieldName}</option>` + 
                    availableValues.map(o => `<option value="${o}" ${o === currentValue ? 'selected' : ''}>${o}</option>`).join('');
            });
            
            // Update chip filters (counts and disabled state)
            const chipFieldKeys = ['category', 'type', 'is_llm_related'].map(F);
            chipFieldKeys.forEach(fieldKey => {
                const chips = bar.querySelectorAll(`.chip[data-field="${fieldKey}"]`);
                if(chips.length > 0) {
                    const availCounts = groupScoped.reduce((acc, p) => {
                        let v = p[fieldKey];
                        if((fieldKey || '').toLowerCase() === 'is_llm_related') v = normalizeBool(v);
                        if(v) acc[v] = (acc[v]||0)+1;
                        return acc;
                    }, {});
                    chips.forEach(chip => {
                        const v = chip.dataset.value;
                        const c = availCounts[v] || 0;
                        const countEl = chip.querySelector('.count');
                        if(countEl) countEl.textContent = String(c);
                        if(c === 0) {
                            chip.setAttribute('aria-disabled', 'true');
                        } else {
                            chip.removeAttribute('aria-disabled');
                        }
                        if(c === 0 && chip.classList.contains('active')) {
                            chip.classList.remove('active');
                            chip.setAttribute('aria-pressed', 'false');
                        }
                    });
                }
            });
        }
        let allPapers = [], allHeaders = [];
        function getFilters() {
            const bar = document.getElementById('filterBar');
            const filters = {};
            
            // Get other filters from inputs and selects
            const selects = bar.querySelectorAll('select');
            selects.forEach(ctrl => { if(ctrl.value) filters[ctrl.name] = ctrl.value; });
            const inputs = bar.querySelectorAll('input');
            inputs.forEach(ctrl => { if(ctrl.value) filters[ctrl.name] = ctrl.value; });
            
            // Get filters from active chips (multi-select)
            const activeChips = bar.querySelectorAll('.chip.active');
            activeChips.forEach(chip => {
                const field = chip.dataset.field;
                const value = chip.dataset.value;
                if(!filters[field]) filters[field] = [];
                filters[field].push(value);
            });
            
            return filters;
        }
        function renderPapers() {
            const filters = getFilters();
            let filtered = allPapers.filter(paper => {
                return Object.entries(filters).every(([k, v]) => {
                    const key = F(k) || k;
                    const kLower = (k || '').toLowerCase();
                    if(v == null) return true;
                    if(Array.isArray(v) && v.length) {
                        return v.some(val => {
                            if(kLower === 'is_llm_related') {
                                return normalizeBool(paper[key]) === normalizeBool(String(val));
                            }
                            return (paper[key]||'').toLowerCase() === String(val).toLowerCase();
                        });
                    }
                    if(!v) return true;
                    if(kLower === 'is_llm_related') {
                        return normalizeBool(paper[key]) === normalizeBool(String(v));
                    }
                    return (paper[key]||'').toLowerCase().includes(String(v).toLowerCase());
                });
            });

            // Sort: year desc (numeric), tiebreaker by title asc
            filtered.sort((a,b) => {
                const ya = parseInt(a[F('year')]) || 0;
                const yb = parseInt(b[F('year')]) || 0;
                if(yb !== ya) return yb - ya;
                const ta = (a[F('title')]||'').toLowerCase();
                const tb = (b[F('title')]||'').toLowerCase();
                return ta.localeCompare(tb);
            });
            
            const list = document.getElementById('paperList');
            list.innerHTML = filtered.map(paper => {
                const llmVal = (paper[F('is_llm_related')] || '').toString().trim().toLowerCase();
                const isLLMRelated = llmVal === 'yes' || llmVal === '1' || llmVal === 'true';
                return `
                <div class="paper-card ${isLLMRelated ? 'llm-paper' : ''}">
                    <div class="paper-top-row">
                        <div class="pub-info">
                            <span class="publisher">${escapeHtml(paper[F('publisher')]||'N/A')}</span>
                            <span class="year">${escapeHtml(paper[F('year')]||'N/A')}</span>
                        </div>
                        ${isLLMRelated ? '<div class="llm-indicator">🤖</div>' : ''}
                    </div>
                    <div class="paper-title">${escapeHtml(paper[F('title')]||'No Title')}</div>
                    <div class="paper-meta">
                        ${escapeHtml(paper[F('authors')]||'N/A')}
                    </div>
                    <div class="paper-bottom-row">
                        <div class="paper-tags">
                            ${paper[F('group')] ? `<span class="paper-tag group">${escapeHtml(paper[F('group')])}</span>` : ''}
                            ${paper[F('category')] ? `<span class="paper-tag category">${escapeHtml(paper[F('category')])}</span>` : ''}
                            ${paper[F('type')] ? `<span class="paper-tag type">${escapeHtml(paper[F('type')])}</span>` : ''}
                            ${isLLMRelated ? `<span class="paper-tag llm">🤖 LLM</span>` : ''}
                        </div>
                        ${paper[F('link')] ? `<a class="paper-link" href="${escapeHtml(paper[F('link')])}" target="_blank"><i class="fa-solid fa-external-link-alt"></i> View Paper</a>` : '<div></div>'}
                    </div>
                </div>
            `;
            }).join('');

            // Results info and empty state
            const info = document.getElementById('resultsInfo');
            const countEl = document.getElementById('resultsCount');
            const empty = document.getElementById('emptyState');
            countEl.textContent = String(filtered.length);
            info.classList.remove('hidden');
            if(filtered.length === 0) empty.classList.remove('hidden'); else empty.classList.add('hidden');
        }
        // Init: show all by default
        fetchCSV().then(papers => {
            if(!papers || !papers.length) throw new Error('No data');
            allPapers = papers;
            // compute union of headers across all records to capture fields like 'group'
            const headerSet = new Set();
            papers.forEach(p => Object.keys(p).forEach(k => headerSet.add(k)));
            allHeaders = Array.from(headerSet);
            // build field map
            fieldMap = {};
            allHeaders.forEach(h => { fieldMap[h.toLowerCase()] = h; });
            createFilters(papers, allHeaders);
            renderPapers();
            updateFilterOptions();
        }).catch(err => {
            const list = document.getElementById('paperList');
            list.innerHTML = '<div class="empty-state">Failed to load papers. Please check data files.</div>';
            console.error(err);
        });
