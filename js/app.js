/**
 * Genar's Master Ancient Greek Dictionary - Main Application
 */

class GreekApp {
    constructor() {
        this.dictionary = window.ANCIENT_GREEK_DICTIONARY || [];
        this.alphabet = window.GREEK_ALPHABET || [];
        this.diacritics = window.GREEK_DIACRITICS || [];
        this.diphthongs = window.GREEK_DIPHTHONGS || [];
        this.grammar = window.GREEK_GRAMMAR || {};

        this.favorites = this.loadFavorites();
        this.activeCategory = 'all';
        this.activePOS = 'all';
        this.searchQuery = '';
        this.activeTab = 'dictionary';
        this.currentSort = 'frequency';

        this.indexedData = [];
        this.virtualKeyboard = null;
        this.flashcardTrainer = null;

        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.initTheme();
        this.renderStats();
        this.renderWordOfTheDay();
        this.renderDictionary();
        this.renderAlphabetView();
        this.renderGrammarView();

        // Initialize Virtual Keyboard
        this.virtualKeyboard = new window.GreekKeyboard('#search-input');

        // Initialize Flashcards
        this.flashcardTrainer = new window.FlashcardTrainer(this.dictionary, '#flashcards-container');

        this.bindEvents();
    }

    buildSearchIndex() {
        this.indexedData = this.dictionary.map(item => {
            const normWord = window.GreekUtils.normalizeGreek(item.word);
            const normLemma = window.GreekUtils.normalizeGreek(item.lemma);
            const latinWord = window.GreekUtils.toLatinSearchKey(item.word);
            const translit = (item.transliteration || '').toLowerCase();
            const athenazeForms = (item.athenaze_forms || '').toLowerCase();
            const trText = (item.meanings_tr || []).join(' ').toLowerCase();
            const enText = (item.meanings_en || []).join(' ').toLowerCase();
            const etymText = (item.etymology || '').toLowerCase();
            const derivText = (item.derivatives || []).join(' ').toLowerCase();

            return {
                raw: item,
                normWord,
                normLemma,
                latinWord,
                translit,
                athenazeForms,
                isAthenaze: !!item.isAthenaze,
                isEmelHoca: !!item.isEmelHoca,
                emelNotes: (item.emel_notes || '').toLowerCase(),
                trText,
                enText,
                etymText,
                derivText
            };
        });
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('genar_greek_favs')) || [];
        } catch (e) {
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('genar_greek_favs', JSON.stringify(this.favorites));
        } catch (e) {
            console.error(e);
        }
        this.updateFavBadges();
    }

    isFavorite(id) {
        return this.favorites.includes(id);
    }

    toggleFavorite(id) {
        if (this.isFavorite(id)) {
            this.favorites = this.favorites.filter(x => x !== id);
        } else {
            this.favorites.push(id);
        }
        this.saveFavorites();
        this.renderFavoritesDrawer();
    }

    updateFavBadges() {
        document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
            const id = btn.dataset.id;
            const isFav = this.isFavorite(id);
            btn.classList.toggle('active', isFav);
            btn.textContent = isFav ? '★' : '☆';
            btn.title = isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle';
        });

        const favCountBadge = document.getElementById('fav-count-badge');
        if (favCountBadge) {
            favCountBadge.textContent = this.favorites.length;
        }
    }

    initTheme() {
        this.themeSetting = localStorage.getItem('genar_greek_theme') || 'auto';
        this.applyTheme();

        // Listen for OS system theme changes in real-time
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleSystemChange = () => {
                if (this.themeSetting === 'auto') {
                    this.applyTheme();
                }
            };
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleSystemChange);
            }
        }
    }

    applyTheme() {
        let isDark = false;
        if (this.themeSetting === 'theme-dark') {
            isDark = true;
        } else if (this.themeSetting === 'theme-parchment') {
            isDark = false;
        } else {
            // 'auto' / System theme detection
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        document.body.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-parchment', !isDark);
        document.documentElement.classList.toggle('theme-dark', isDark);
        document.documentElement.classList.toggle('theme-parchment', !isDark);

        this.updateThemeButton();
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (!themeBtn) return;

        const isCurrentlyDark = document.body.classList.contains('theme-dark');
        if (this.themeSetting === 'auto') {
            themeBtn.innerHTML = `🌓 Sistem (${isCurrentlyDark ? 'Koyu' : 'Açık'})`;
            themeBtn.title = 'Sistem teması aktif. Tıklayarak temayı manuel sabitleyebilirsiniz.';
        } else if (this.themeSetting === 'theme-dark') {
            themeBtn.innerHTML = `🌙 Gece (Koyu)`;
            themeBtn.title = 'Koyu tema sabit. Tıklayarak Açık temaya geçebilirsiniz.';
        } else {
            themeBtn.innerHTML = `☀️ Parşömen (Açık)`;
            themeBtn.title = 'Açık tema sabit. Tıklayarak Otomatik Sistem temasına dönebilirsiniz.';
        }
    }

    toggleTheme() {
        if (this.themeSetting === 'auto') {
            const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.themeSetting = isSystemDark ? 'theme-parchment' : 'theme-dark';
        } else if (this.themeSetting === 'theme-dark') {
            this.themeSetting = 'theme-parchment';
        } else if (this.themeSetting === 'theme-parchment') {
            this.themeSetting = 'auto'; // Return back to automatic system default
        }

        if (this.themeSetting === 'auto') {
            localStorage.removeItem('genar_greek_theme');
        } else {
            localStorage.setItem('genar_greek_theme', this.themeSetting);
        }

        this.applyTheme();
    }

    renderStats() {
        const countSpan = document.getElementById('total-word-count');
        if (countSpan) countSpan.textContent = this.dictionary.length;
    }

    renderWordOfTheDay() {
        const dayBox = document.getElementById('wotd-container');
        if (!dayBox || this.dictionary.length === 0) return;

        // Pick word based on day of year
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const index = dayOfYear % this.dictionary.length;
        const wotd = this.dictionary[index] || this.dictionary[0];

        dayBox.innerHTML = `
            <div class="wotd-banner">
                <div class="wotd-label">🏛️ Günün Antik Yunanca Kelimesi</div>
                <div class="wotd-content">
                    <div class="wotd-left">
                        <span class="wotd-greek">${wotd.word}</span>
                        <span class="wotd-translit">${wotd.transliteration}</span>
                        <span class="wotd-lemma">${wotd.lemma}</span>
                    </div>
                    <div class="wotd-right">
                        <div class="wotd-meaning">${wotd.meanings_tr[0]}</div>
                        <div class="wotd-sub">${wotd.etymology || ''}</div>
                    </div>
                    <div class="wotd-actions">
                        <button type="button" class="btn-scholarly btn-sm btn-wotd-detail" data-id="${wotd.id}">İncele</button>
                        <button type="button" class="btn-audio-round btn-sm btn-speak-word" data-word="${wotd.word}">🔊</button>
                    </div>
                </div>
            </div>
        `;
    }

    filterData() {
        const q = this.searchQuery.trim().toLowerCase();
        let filtered = this.indexedData;

        // Category filter
        if (this.activeCategory !== 'all') {
            if (this.activeCategory === 'athenaze') {
                filtered = filtered.filter(item => item.isAthenaze === true || (item.raw.tags && item.raw.tags.includes('athenaze')));
            } else if (this.activeCategory === 'emel_hoca') {
                filtered = filtered.filter(item => item.isEmelHoca === true || (item.raw.tags && item.raw.tags.includes('emel_hoca')));
            } else {
                filtered = filtered.filter(item => item.raw.category === this.activeCategory);
            }
        }

        // POS filter
        if (this.activePOS !== 'all') {
            filtered = filtered.filter(item => (item.raw.partOfSpeech || '').includes(this.activePOS));
        }

        // Query filter
        if (q) {
            const normQ = window.GreekUtils.normalizeGreek(q);
            const latinQ = window.GreekUtils.toLatinSearchKey(q);
            const betaConverted = window.GreekUtils.betaCodeToGreek(q);
            const normBeta = window.GreekUtils.normalizeGreek(betaConverted);

            filtered = filtered.filter(item => {
                // Exact or partial Greek
                if (item.normWord.includes(normQ) || item.normLemma.includes(normQ)) return true;
                if (normBeta && item.normWord.includes(normBeta)) return true;

                // Athenaze forms search (e.g. βοῦν, βόες, ἀγρόν)
                if (item.athenazeForms && (item.athenazeForms.includes(q) || item.athenazeForms.includes(normQ))) return true;

                // Latin transliteration
                if (item.latinWord.includes(latinQ) || item.translit.includes(latinQ)) return true;

                // Turkish definition
                if (item.trText.includes(q)) return true;

                // English definition
                if (item.enText.includes(q)) return true;

                // Derivative (modern words like felsefe, biyoloji)
                if (item.derivText.includes(q)) return true;

                // Etymology
                if (item.etymText.includes(q)) return true;

                return false;
            });
        }

        // Sort
        filtered.sort((a, b) => {
            if (this.currentSort === 'frequency') {
                return (b.raw.frequency || 3) - (a.raw.frequency || 3);
            } else if (this.currentSort === 'alpha-greek') {
                return a.raw.word.localeCompare(b.raw.word, 'el');
            } else if (this.currentSort === 'alpha-tr') {
                const trA = (a.raw.meanings_tr[0] || '');
                const trB = (b.raw.meanings_tr[0] || '');
                return trA.localeCompare(trB, 'tr');
            }
            return 0;
        });

        return filtered.map(x => x.raw);
    }

    renderDictionary() {
        const container = document.getElementById('dictionary-grid');
        const countSpan = document.getElementById('search-result-count');
        if (!container) return;

        const results = this.filterData();
        if (countSpan) {
            countSpan.textContent = `${results.length} kelime listeleniyor`;
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📜</div>
                    <h3>Hiçbir kelime bulunamadı</h3>
                    <p>Arama kriterlerinizi değiştirin veya Beta Code / Türkçe / Latince aramayı deneyin.</p>
                    <button type="button" class="btn-scholarly" id="btn-reset-search">Tüm Kelimeleri Göster</button>
                </div>
            `;
            const resetBtn = document.getElementById('btn-reset-search');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.searchQuery = '';
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                    this.activeCategory = 'all';
                    this.activePOS = 'all';
                    this.renderCategoryPills();
                    this.renderDictionary();
                });
            }
            return;
        }

        let html = '';
        results.forEach(item => {
            const isFav = this.isFavorite(item.id);
            const stars = '★'.repeat(item.frequency || 3) + '☆'.repeat(5 - (item.frequency || 3));
            const trMeanings = (item.meanings_tr || []).slice(0, 2).join(' • ');

            html += `
                <div class="word-card" data-id="${item.id}">
                    <div class="word-card-header">
                        <div class="greek-title-group">
                            <span class="greek-word">${item.word}</span>
                            <span class="greek-translit">${item.transliteration || ''}</span>
                        </div>
                        <div class="card-top-actions">
                            <button type="button" class="btn-audio-round btn-sm btn-speak-word" data-word="${item.word}" title="Sesli Telaffuz">🔊</button>
                            <button type="button" class="btn-fav-toggle ${isFav ? 'active' : ''}" data-id="${item.id}" title="${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">${isFav ? '★' : '☆'}</button>
                        </div>
                    </div>

                    <div class="word-lemma">${item.lemma}</div>

                    <div class="word-badges">
                        ${item.isAthenaze ? `<span class="badge badge-athenaze" title="Athenaze Book I (1α-3β) Kelimesi">📚 Athenaze I</span>` : ''}
                        ${item.isEmelHoca ? `<span class="badge badge-emel" title="Emel Hoca'nın Seçtikleri">🌸 Emel Hoca</span>` : ''}
                        <span class="badge badge-pos">${item.partOfSpeech || 'Kelime'}</span>
                        <span class="badge badge-cat">${item.category || 'Genel'}</span>
                        <span class="badge badge-stars" title="Kullanım Sıklığı">${stars}</span>
                    </div>

                    <div class="word-tr-meaning">
                        ${trMeanings}
                    </div>

                    ${item.athenaze_forms ? `
                        <div class="word-athenaze-preview">
                            <span class="ath-label">Metin Formları:</span> ${item.athenaze_forms}
                        </div>
                    ` : ''}

                    ${item.emel_notes ? `
                        <div class="word-emel-preview">
                            <span class="emel-label">🌸 Emel Hoca:</span> ${item.emel_notes}
                        </div>
                    ` : ''}

                    ${item.derivatives && item.derivatives.length > 0 ? `
                        <div class="word-derivatives-preview">
                            <span class="deriv-label">Türevler:</span> ${item.derivatives.slice(0, 3).join(', ')}
                        </div>
                    ` : ''}

                    <div class="word-card-footer">
                        <button type="button" class="btn-text-link btn-view-detail" data-id="${item.id}">
                            Detaylı İncele & Gramer ➔
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.updateFavBadges();
    }

    renderCategoryPills() {
        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.category === this.activeCategory);
        });
    }

    showWordModal(id) {
        const item = this.dictionary.find(x => x.id === id);
        if (!item) return;

        const modal = document.getElementById('word-detail-modal');
        const content = document.getElementById('modal-body-content');
        if (!modal || !content) return;

        const isFav = this.isFavorite(item.id);
        const stars = '★'.repeat(item.frequency || 3) + '☆'.repeat(5 - (item.frequency || 3));

        let trMeaningsHtml = (item.meanings_tr || []).map((m, i) => `
            <li class="modal-meaning-item">
                <span class="meaning-num">${i + 1}.</span>
                <span class="meaning-text">${m}</span>
            </li>
        `).join('');

        let enMeaningsHtml = (item.meanings_en || []).map(m => `
            <span class="badge badge-en-lsj">${m}</span>
        `).join('');

        let derivativesHtml = (item.derivatives || []).map(d => `
            <span class="badge badge-deriv">✦ ${d}</span>
        `).join('');

        // Grammar section
        let grammarHtml = '';
        if (item.grammar) {
            if (item.grammar.principal_parts) {
                grammarHtml = `
                    <div class="detail-section">
                        <h4>🏛️ Temel Zaman Formları (Principal Parts)</h4>
                        <div class="principal-parts-box">
                            ${item.grammar.principal_parts.map(p => `<div class="part-row">👉 ${p}</div>`).join('')}
                        </div>
                    </div>
                `;
            } else if (item.grammar.nominative && item.grammar.genitive) {
                grammarHtml = `
                    <div class="detail-section">
                        <h4>🏛️ Çekim Bilgisi (Declension Paradigm)</h4>
                        <table class="declension-mini-table">
                            <thead>
                                <tr><th>Durum (Case)</th><th>Tekil (Singular)</th><th>Çoğul (Plural)</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Nominativ (Yalın)</td><td><strong>${item.grammar.nominative || '-'}</strong></td><td>${item.grammar.nom_pl || '-'}</td></tr>
                                <tr><td>Genitiv (-in)</td><td>${item.grammar.genitive || '-'}</td><td>${item.grammar.gen_pl || '-'}</td></tr>
                                <tr><td>Dativ (-e/-de)</td><td>${item.grammar.dative || '-'}</td><td>${item.grammar.dat_pl || '-'}</td></tr>
                                <tr><td>Accusativ (-i)</td><td>${item.grammar.accusative || '-'}</td><td>${item.grammar.acc_pl || '-'}</td></tr>
                                ${item.grammar.vocative ? `<tr><td>Vocativ (Hitap)</td><td>${item.grammar.vocative}</td><td>${item.grammar.nom_pl || '-'}</td></tr>` : ''}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }

        // Examples section
        let examplesHtml = '';
        if (item.examples && item.examples.length > 0) {
            examplesHtml = `
                <div class="detail-section">
                    <h4>📜 Klasik Metinlerden Alıntılar & Örnekler</h4>
                    <div class="modal-examples-list">
                        ${item.examples.map(ex => `
                            <div class="example-quote-card">
                                <div class="quote-greek">"${ex.greek}"</div>
                                <div class="quote-tr">${ex.tr}</div>
                                <div class="quote-author">— ${ex.author || 'Antik Yazar'} ${ex.work ? '<em>(' + ex.work + ')</em>' : ''}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        content.innerHTML = `
            <div class="modal-word-header">
                <div class="modal-greek-block">
                    <h2 class="modal-greek-word">${item.word}</h2>
                    <span class="modal-translit">${item.transliteration}</span>
                    <div class="modal-lemma-text">${item.lemma}</div>
                </div>
                <div class="modal-actions-right">
                    <button type="button" class="btn-audio-round btn-speak-word" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                    <button type="button" class="btn-fav-toggle ${isFav ? 'active' : ''}" data-id="${item.id}" title="${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">${isFav ? '★' : '☆'}</button>
                </div>
            </div>

            <div class="modal-badges-bar">
                ${item.isAthenaze ? `<span class="badge badge-athenaze">📚 Athenaze: Book I (1α – 3β)</span>` : ''}
                ${item.isEmelHoca ? `<span class="badge badge-emel">🌸 Emel Hoca'nın Seçtikleri</span>` : ''}
                <span class="badge badge-pos">${item.partOfSpeech || ''}</span>
                <span class="badge badge-cat">${item.category || ''}</span>
                <span class="badge badge-stars" title="Sıklık">${stars}</span>
            </div>

            ${item.athenaze_forms ? `
                <div class="detail-section athenaze-modal-section">
                    <h4>📚 Athenaze (1α – 3β) Metin ve Çekim Formları</h4>
                    <div class="athenaze-forms-box">
                        <strong>Metinde Geçen Biçimler:</strong> ${item.athenaze_forms}
                    </div>
                </div>
            ` : ''}

            ${item.emel_notes ? `
                <div class="detail-section emel-modal-section">
                    <h4>🌸 Emel Hoca'nın Seçtikleri & Ders Açıklaması</h4>
                    <div class="emel-notes-box">
                        ${item.emel_notes}
                    </div>
                </div>
            ` : ''}

            <div class="detail-section">
                <h4>📖 Türkçe Tanımlar & Anlam Nüansları</h4>
                <ul class="modal-meanings-list">
                    ${trMeaningsHtml}
                </ul>
            </div>

            <div class="detail-section">
                <h4>🏛️ İngilizce Sözlük Karşılıkları (LSJ - Liddell Scott Jones)</h4>
                <div class="lsj-tags-wrapper">
                    ${enMeaningsHtml}
                </div>
            </div>

            ${item.etymology ? `
                <div class="detail-section">
                    <h4>🌱 Etimoloji & Köken</h4>
                    <p class="etymology-paragraph">${item.etymology}</p>
                </div>
            ` : ''}

            ${derivativesHtml ? `
                <div class="detail-section">
                    <h4>🌍 Modern Diller ve Türkçedeki Türevleri</h4>
                    <div class="derivatives-tags-wrapper">
                        ${derivativesHtml}
                    </div>
                </div>
            ` : ''}

            ${grammarHtml}
            ${examplesHtml}
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('word-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    renderAlphabetView() {
        const container = document.getElementById('alphabet-table-body');
        if (!container || !this.alphabet) return;

        let html = '';
        this.alphabet.forEach(item => {
            html += `
                <tr>
                    <td class="col-letter"><strong class="upper">${item.upper}</strong> <span class="lower">${item.lower}</span></td>
                    <td><strong>${item.name_tr}</strong> <br><small class="greek-name">${item.name_gr}</small></td>
                    <td><code>${item.ipa}</code></td>
                    <td>${item.erasmian}</td>
                    <td>${item.classical}</td>
                    <td><span class="num-badge">${item.value}</span></td>
                    <td>
                        <span class="example-gr">${item.example}</span>
                        <button type="button" class="btn-audio-mini btn-speak-word" data-word="${item.example.split(' ')[0]}">🔊</button>
                    </td>
                </tr>
            `;
        });
        container.innerHTML = html;

        // Diacritics guide
        const diacriticsContainer = document.getElementById('diacritics-grid');
        if (diacriticsContainer && this.diacritics) {
            let dHtml = '';
            this.diacritics.forEach(d => {
                dHtml += `
                    <div class="diacritic-card">
                        <div class="diacritic-symbol">${d.symbol}</div>
                        <div class="diacritic-info">
                            <h4>${d.name_tr} (${d.name_gr})</h4>
                            <p>${d.desc}</p>
                            <div class="diacritic-examples"><strong>Örnekler:</strong> ${d.examples}</div>
                        </div>
                    </div>
                `;
            });
            diacriticsContainer.innerHTML = dHtml;
        }

        // Diphthongs
        const diphContainer = document.getElementById('diphthongs-grid');
        if (diphContainer && this.diphthongs) {
            let dpHtml = '';
            this.diphthongs.forEach(dp => {
                dpHtml += `
                    <div class="diphthong-card">
                        <div class="diph-greek">${dp.greek}</div>
                        <div class="diph-translit">${dp.translit}</div>
                        <div class="diph-sound">${dp.sound}</div>
                        <div class="diph-example">Örn: ${dp.example}</div>
                    </div>
                `;
            });
            diphContainer.innerHTML = dpHtml;
        }
    }

    renderGrammarView() {
        const articleBox = document.getElementById('grammar-article-box');
        if (articleBox && this.grammar.article) {
            const g = this.grammar.article;
            articleBox.innerHTML = `
                <div class="grammar-card">
                    <h3>${g.title}</h3>
                    <p class="grammar-desc">${g.description}</p>
                    <table class="scholarly-table">
                        <thead>
                            <tr>
                                <th>Durum (Hâl)</th>
                                <th>Eril (Tekil / Çoğul)</th>
                                <th>Dişil (Tekil / Çoğul)</th>
                                <th>Nötr (Tekil / Çoğul)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${g.cases.map((c, i) => `
                                <tr>
                                    <td><strong>${c}</strong></td>
                                    <td>${g.singular.masculine[i]} / <span class="pl">${g.plural.masculine[i]}</span></td>
                                    <td>${g.singular.feminine[i]} / <span class="pl">${g.plural.feminine[i]}</span></td>
                                    <td>${g.singular.neuter[i]} / <span class="pl">${g.plural.neuter[i]}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const decl2Box = document.getElementById('grammar-declension2-box');
        if (decl2Box && this.grammar.declension_2) {
            const d2 = this.grammar.declension_2;
            decl2Box.innerHTML = `
                <div class="grammar-card">
                    <h3>${d2.title}</h3>
                    <p class="grammar-desc">${d2.description}</p>
                    <table class="scholarly-table">
                        <thead>
                            <tr>
                                <th>Durum (Hâl)</th>
                                <th>${d2.logos_masc.name}</th>
                                <th>${d2.doron_neut.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${d2.cases.map((c, i) => `
                                <tr>
                                    <td><strong>${c}</strong></td>
                                    <td>${d2.logos_masc.singular[i]} / <span class="pl">${d2.logos_masc.plural[i]}</span></td>
                                    <td>${d2.doron_neut.singular[i]} / <span class="pl">${d2.doron_neut.plural[i]}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const verbBox = document.getElementById('grammar-verb-box');
        if (verbBox && this.grammar.verb_luo) {
            const v = this.grammar.verb_luo;
            verbBox.innerHTML = `
                <div class="grammar-card">
                    <h3>${v.title}</h3>
                    <p class="grammar-desc">${v.description}</p>
                    <h4>${v.present_indicative.title}</h4>
                    <table class="scholarly-table">
                        <thead>
                            <tr>
                                <th>Şahıs</th>
                                <th>Etken Çatı (Aktif)</th>
                                <th>Edilgen / Dönüşlü (Pasif / Medial)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${v.present_indicative.persons.map((p, i) => `
                                <tr>
                                    <td><strong>${p}</strong></td>
                                    <td><code>${v.present_indicative.active[i]}</code></td>
                                    <td><code>${v.present_indicative.middle_passive[i]}</code></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    renderFavoritesDrawer() {
        const container = document.getElementById('fav-drawer-list');
        if (!container) return;

        const favWords = this.dictionary.filter(item => this.isFavorite(item.id));
        if (favWords.length === 0) {
            container.innerHTML = `
                <div class="empty-favs">
                    <p>Henüz favori kelime eklemediniz.</p>
                    <small>Kelime kartlarındaki yıldız (★) simgesine tıklayarak kelimeleri buraya ekleyebilirsiniz.</small>
                </div>
            `;
            return;
        }

        let html = '';
        favWords.forEach(item => {
            html += `
                <div class="fav-item">
                    <div class="fav-item-main">
                        <strong class="fav-greek">${item.word}</strong>
                        <span class="fav-translit">(${item.transliteration})</span>
                        <div class="fav-meaning">${item.meanings_tr[0]}</div>
                    </div>
                    <div class="fav-actions">
                        <button type="button" class="btn-scholarly btn-xs btn-view-detail" data-id="${item.id}">İncele</button>
                        <button type="button" class="btn-del-fav" data-id="${item.id}" title="Kaldır">✕</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-view').forEach(view => {
            view.classList.toggle('active-tab-content', view.id === `view-${tabName}`);
        });

        if (tabName === 'flashcards' && this.flashcardTrainer) {
            this.flashcardTrainer.renderCard();
        }
    }

    bindEvents() {
        // Navigation Tabs
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Search Input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderDictionary();
            });
        }

        // Search Clear Button
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.searchQuery = '';
                    this.renderDictionary();
                    searchInput.focus();
                }
            });
        }

        // Toggle Virtual Keyboard
        const kbToggleBtn = document.getElementById('toggle-keyboard-btn');
        if (kbToggleBtn) {
            kbToggleBtn.addEventListener('click', () => {
                this.virtualKeyboard.toggle();
            });
        }

        // Category Pills
        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                this.activeCategory = pill.dataset.category;
                this.renderCategoryPills();
                this.renderDictionary();
            });
        });

        // POS Filter Select
        const posSelect = document.getElementById('pos-filter-select');
        if (posSelect) {
            posSelect.addEventListener('change', (e) => {
                this.activePOS = e.target.value;
                this.renderDictionary();
            });
        }

        // Sort Select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderDictionary();
            });
        }

        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Delegate clicks for dynamic items (view detail, favorite, audio)
        document.addEventListener('click', (e) => {
            // View Detail
            const detailBtn = e.target.closest('.btn-view-detail') || e.target.closest('.btn-wotd-detail');
            if (detailBtn) {
                const id = detailBtn.dataset.id;
                this.showWordModal(id);
                return;
            }

            // Word card click (excluding action buttons)
            const card = e.target.closest('.word-card');
            if (card && !e.target.closest('button')) {
                const id = card.dataset.id;
                this.showWordModal(id);
                return;
            }

            // Favorite toggle
            const favBtn = e.target.closest('.btn-fav-toggle');
            if (favBtn) {
                const id = favBtn.dataset.id;
                this.toggleFavorite(id);
                return;
            }

            // Delete from favorite drawer
            const delFavBtn = e.target.closest('.btn-del-fav');
            if (delFavBtn) {
                const id = delFavBtn.dataset.id;
                this.toggleFavorite(id);
                return;
            }

            // Speak audio
            const speakBtn = e.target.closest('.btn-speak-word');
            if (speakBtn) {
                const word = speakBtn.dataset.word;
                if (word && window.GreekUtils) {
                    window.GreekUtils.speak(word);
                }
                return;
            }

            // Close modal
            if (e.target.matches('#modal-close-btn') || e.target.matches('#word-detail-modal')) {
                this.closeModal();
            }

            // Open / Close Favorites Drawer
            if (e.target.closest('#favorites-toggle-btn')) {
                const drawer = document.getElementById('favorites-drawer');
                if (drawer) {
                    drawer.classList.toggle('open');
                    this.renderFavoritesDrawer();
                }
            }

            if (e.target.matches('#close-fav-drawer-btn')) {
                const drawer = document.getElementById('favorites-drawer');
                if (drawer) drawer.classList.remove('open');
            }
        });

        // Escape key closes modal & drawer
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                const drawer = document.getElementById('favorites-drawer');
                if (drawer) drawer.classList.remove('open');
                if (this.virtualKeyboard && this.virtualKeyboard.isOpen) {
                    this.virtualKeyboard.toggle(false);
                }
            }
        });
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GreekApp();
});
