/**
 * Ancient Greek Flashcards Learning Platform
 * Comprehensive multi-tiered spaced repetition and review system
 * 
 * Features:
 * - 3 Main Categories: Tüm Kelimeler, Athenaze Book I, Emel Hoca'nın Seçtikleri
 * - Sub-categories / Parts of Speech: Tümü, İsimler, Fiiller, Sıfatlar, Edatlar & Bağlaçlar
 * - Batches of 10 words with individual progress tracking
 * - Smart Decks: Bildiğim Kelimeler, Bilmediğim / Tekrar Edilecekler (unrestricted size)
 * - Bidirectional Study Switch: Grekçe ➔ Türkçe and Türkçe ➔ Grekçe
 * - Hierarchical Reset System: Batch level, Subcategory level, Main category level, Full reset
 * - Keyboard shortcuts: Space (flip), Arrows (prev/next), 1 (bilmiyorum), 2 (biliyorum)
 * - Persistent state via localStorage
 */

class FlashcardTrainer {
    constructor(deck, containerSelector) {
        this.fullDictionary = Array.isArray(deck) ? deck : [];
        this.container = document.querySelector(containerSelector);

        // State keys
        this.STORAGE_KEY = 'genar_greek_fc_progress_v2';
        this.PREFS_KEY = 'genar_greek_fc_prefs_v2';

        // Load persistent data
        this.progress = this.loadProgress();
        this.prefs = this.loadPreferences();

        // Active filter state
        this.mainCategory = this.prefs.mainCategory || 'all';      // 'all' | 'athenaze' | 'emel_hoca'
        this.subCategory = this.prefs.subCategory || 'all';        // 'all' | 'İsim' | 'Fiil' | 'Sıfat' | 'Edat'
        this.deckMode = this.prefs.deckMode || 'batch';            // 'batch' | 'known' | 'unknown' | 'all_pool'
        this.batchIndex = this.prefs.batchIndex || 0;              // 0, 1, 2...
        this.direction = this.prefs.direction || 'greek_to_tr';    // 'greek_to_tr' | 'tr_to_greek'

        // Card navigation state
        this.currentDeck = [];
        this.currentIndex = 0;
        this.isFlipped = false;

        this.init();
    }

    /* ==========================================================================
       STORAGE & PERSISTENCE
       ========================================================================== */
    loadProgress() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Failed to load flashcard progress:', e);
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Failed to save flashcard progress:', e);
        }
    }

    loadPreferences() {
        try {
            const raw = localStorage.getItem(this.PREFS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    savePreferences() {
        try {
            const prefs = {
                mainCategory: this.mainCategory,
                subCategory: this.subCategory,
                deckMode: this.deckMode,
                batchIndex: this.batchIndex,
                direction: this.direction
            };
            localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
        } catch (e) {
            console.error('Failed to save preferences:', e);
        }
    }

    isWordLearned(wordId) {
        return this.progress[wordId] === 'learned';
    }

    setWordStatus(wordId, status) {
        if (!wordId) return;
        if (status === 'learned') {
            this.progress[wordId] = 'learned';
        } else {
            this.progress[wordId] = 'unlearned';
        }
        this.saveProgress();
    }

    /* ==========================================================================
       DATA FILTERING & HIERARCHY
       ========================================================================== */
    // Returns words matching current Main Category
    getMainCategoryWords(mainCat = this.mainCategory) {
        if (mainCat === 'athenaze') {
            return this.fullDictionary.filter(item => 
                item.isAthenaze === true || (item.tags && item.tags.includes('athenaze'))
            );
        }
        if (mainCat === 'emel_hoca') {
            return this.fullDictionary.filter(item => 
                item.isEmelHoca === true || (item.tags && item.tags.includes('emel_hoca'))
            );
        }
        return this.fullDictionary;
    }

    // Returns words matching current Main Category AND Sub-category (POS)
    getSubCategoryWords(mainCat = this.mainCategory, subCat = this.subCategory) {
        const pool = this.getMainCategoryWords(mainCat);
        if (!subCat || subCat === 'all') {
            return pool;
        }
        if (subCat === 'İsim') {
            return pool.filter(x => (x.partOfSpeech || '').includes('İsim'));
        }
        if (subCat === 'Fiil') {
            return pool.filter(x => (x.partOfSpeech || '').includes('Fiil'));
        }
        if (subCat === 'Sıfat') {
            return pool.filter(x => (x.partOfSpeech || '').includes('Sıfat'));
        }
        if (subCat === 'Edat') {
            return pool.filter(x => 
                (x.partOfSpeech || '').includes('Edat') || 
                (x.partOfSpeech || '').includes('Bağlaç') ||
                x.category === 'Zarflar & Edatlar'
            );
        }
        return pool.filter(x => (x.partOfSpeech || '').includes(subCat) || x.category === subCat);
    }

    // Build the active working deck based on deckMode and batchIndex
    buildActiveDeck() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        
        if (this.deckMode === 'known') {
            // All words marked as learned in this scope (no 10-limit)
            this.currentDeck = words.filter(w => this.isWordLearned(w.id));
        } else if (this.deckMode === 'unknown') {
            // All words unlearned or never marked in this scope (no 10-limit)
            this.currentDeck = words.filter(w => !this.isWordLearned(w.id));
        } else if (this.deckMode === 'all_pool') {
            // Entire pool in this scope
            this.currentDeck = [...words];
        } else {
            // 'batch' mode (groups of 10)
            const totalBatches = Math.max(1, Math.ceil(words.length / 10));
            if (this.batchIndex >= totalBatches) {
                this.batchIndex = 0;
            }
            const start = this.batchIndex * 10;
            const end = start + 10;
            this.currentDeck = words.slice(start, end);
        }

        // Keep currentIndex in bounds
        if (this.currentIndex >= this.currentDeck.length) {
            this.currentIndex = 0;
        }
        this.isFlipped = false;
    }

    /* ==========================================================================
       PROGRESS STATISTICS
       ========================================================================== */
    getStatsForWords(words) {
        if (!words || words.length === 0) return { total: 0, learned: 0, percent: 0 };
        const learned = words.filter(w => this.isWordLearned(w.id)).length;
        const total = words.length;
        const percent = Math.round((learned / total) * 100);
        return { total, learned, percent };
    }

    getCurrentSubCategoryStats() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        return this.getStatsForWords(words);
    }

    getCurrentBatchStats() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const start = this.batchIndex * 10;
        const batchWords = words.slice(start, start + 10);
        return this.getStatsForWords(batchWords);
    }

    /* ==========================================================================
       INITIALIZATION & RENDERING
       ========================================================================== */
    init() {
        if (!this.container) return;
        this.buildActiveDeck();
        this.render();
        this.bindEvents();
    }

    render() {
        const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const totalBatches = Math.max(1, Math.ceil(poolWords.length / 10));
        const subStats = this.getCurrentSubCategoryStats();
        const batchStats = this.getCurrentBatchStats();

        const mainWords = this.getMainCategoryWords(this.mainCategory);
        const mainStats = this.getStatsForWords(mainWords);

        // Calculate counts for smart decks
        const knownCount = poolWords.filter(w => this.isWordLearned(w.id)).length;
        const unknownCount = poolWords.length - knownCount;

        this.container.innerHTML = `
            <div class="flashcards-wrapper">
                
                <!-- Main Header & Scope Selector -->
                <div class="fc-header-card">
                    <div class="fc-header-top">
                        <div class="fc-header-title">
                            <h3>🏛️ Antik Yunanca İnteraktif Kelime Kartları</h3>
                            <p class="fc-header-subtitle">Modüler 10'luk paketler, başarı takibi ve çift yönlü aktif hatırlama sistemi.</p>
                        </div>
                        <div class="fc-direction-box">
                            <span class="fc-direction-label">Çalışma Yönü:</span>
                            <div class="fc-toggle-group">
                                <button type="button" class="btn-fc-toggle ${this.direction === 'greek_to_tr' ? 'active' : ''}" data-direction="greek_to_tr" title="Grekçe kelimeyi görüp Türkçesini tahmin edin">
                                    🇬🇷 Grekçe ➔ 🇹🇷 TR
                                </button>
                                <button type="button" class="btn-fc-toggle ${this.direction === 'tr_to_greek' ? 'active' : ''}" data-direction="tr_to_greek" title="Türkçe anlamı görüp Grekçe karşılığı zihninizde canlandırın">
                                    🇹🇷 TR ➔ 🇬🇷 Grekçe
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 1. Layer: Main Scope Pills -->
                    <div class="fc-scope-section">
                        <span class="fc-scope-label">Ana Kütüphane / Kaynak:</span>
                        <div class="fc-pills-row" id="fc-main-pills">
                            <button type="button" class="fc-pill ${this.mainCategory === 'all' ? 'active' : ''}" data-main="all">
                                🌟 Tüm Kelimeler <span class="pill-count">(${this.fullDictionary.length})</span>
                            </button>
                            <button type="button" class="fc-pill fc-pill-ath ${this.mainCategory === 'athenaze' ? 'active' : ''}" data-main="athenaze">
                                📚 Athenaze: Book I <span class="pill-count">(${this.getMainCategoryWords('athenaze').length})</span>
                            </button>
                            <button type="button" class="fc-pill fc-pill-emel ${this.mainCategory === 'emel_hoca' ? 'active' : ''}" data-main="emel_hoca">
                                🌸 Emel Hoca'nın Seçtikleri <span class="pill-count">(${this.getMainCategoryWords('emel_hoca').length})</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. Layer: Sub-category / Part of Speech Pills -->
                    <div class="fc-scope-section">
                        <span class="fc-scope-label">Kelime Türü (Gramer):</span>
                        <div class="fc-pills-row" id="fc-sub-pills">
                            <button type="button" class="fc-sub-pill ${this.subCategory === 'all' ? 'active' : ''}" data-sub="all">
                                Tüm Türler <span class="pill-count">(${mainWords.length})</span>
                            </button>
                            <button type="button" class="fc-sub-pill ${this.subCategory === 'İsim' ? 'active' : ''}" data-sub="İsim">
                                İsimler <span class="pill-count">(${this.getSubCategoryWords(this.mainCategory, 'İsim').length})</span>
                            </button>
                            <button type="button" class="fc-sub-pill ${this.subCategory === 'Fiil' ? 'active' : ''}" data-sub="Fiil">
                                Fiiller <span class="pill-count">(${this.getSubCategoryWords(this.mainCategory, 'Fiil').length})</span>
                            </button>
                            <button type="button" class="fc-sub-pill ${this.subCategory === 'Sıfat' ? 'active' : ''}" data-sub="Sıfat">
                                Sıfatlar <span class="pill-count">(${this.getSubCategoryWords(this.mainCategory, 'Sıfat').length})</span>
                            </button>
                            <button type="button" class="fc-sub-pill ${this.subCategory === 'Edat' ? 'active' : ''}" data-sub="Edat">
                                Edatlar & Bağlaçlar <span class="pill-count">(${this.getSubCategoryWords(this.mainCategory, 'Edat').length})</span>
                            </button>
                        </div>
                    </div>

                    <!-- 3. Layer: Deck Mode & 10-Word Batches Bar -->
                    <div class="fc-deck-controls-bar">
                        <div class="fc-deck-selector-wrap">
                            <label for="fc-deck-select" class="fc-label-sm">📦 Çalışma Paketi / Modu:</label>
                            <select id="fc-deck-select" class="scholarly-select fc-select-deck">
                                <optgroup label="── 10'arlık Çalışma Paketleri ──">
                                    ${this.renderBatchOptions(poolWords, totalBatches)}
                                </optgroup>
                                <optgroup label="── Akıllı Filtreli Desteler (Tüm Liste) ──">
                                    <option value="mode:known" ${this.deckMode === 'known' ? 'selected' : ''}>
                                        🏆 Bildiğim Kelimeler (${knownCount} Kelime)
                                    </option>
                                    <option value="mode:unknown" ${this.deckMode === 'unknown' ? 'selected' : ''}>
                                        ⏳ Bilmediklerim / Tekrar (${unknownCount} Kelime)
                                    </option>
                                    <option value="mode:all_pool" ${this.deckMode === 'all_pool' ? 'selected' : ''}>
                                        📋 Tüm Havuz (${poolWords.length} Kelime)
                                    </option>
                                </optgroup>
                            </select>
                        </div>

                        <!-- Progress Bar & Reset Action -->
                        <div class="fc-progress-and-reset">
                            <div class="fc-progress-overview">
                                <div class="fc-progress-labels">
                                    <span class="fc-progress-text" id="fc-progress-label">
                                        ${this.getDeckProgressLabel(batchStats, subStats, knownCount, poolWords.length)}
                                    </span>
                                    <span class="fc-progress-percent" id="fc-progress-percent">
                                        %${this.deckMode === 'batch' ? batchStats.percent : subStats.percent}
                                    </span>
                                </div>
                                <div class="fc-progress-bar-bg">
                                    <div class="fc-progress-bar-fill" id="fc-progress-bar-fill" style="width: ${this.deckMode === 'batch' ? batchStats.percent : subStats.percent}%"></div>
                                </div>
                            </div>

                            <div class="fc-reset-btn-wrapper">
                                <button type="button" class="btn-scholarly btn-sm btn-fc-reset" id="fc-reset-toggle-btn" title="İlerlemeyi Sıfırla">
                                    🗑️ Sıfırla ▾
                                </button>
                                <div class="fc-reset-menu hidden" id="fc-reset-menu">
                                    <button type="button" class="fc-reset-item" data-action="reset-batch">
                                        📦 Bu Paketin İlerlemesini Sıfırla (10 Kelime)
                                    </button>
                                    <button type="button" class="fc-reset-item" data-action="reset-sub">
                                        📑 Bu Alt Kategoriyi Sıfırla (${this.subCategory === 'all' ? 'Tüm Türler' : this.subCategory})
                                    </button>
                                    <button type="button" class="fc-reset-item" data-action="reset-main">
                                        🏛️ Tüm Bu Ana Kütüphaneyi Sıfırla (${this.getMainCategoryLabel()})
                                    </button>
                                    <div class="fc-reset-divider"></div>
                                    <button type="button" class="fc-reset-item danger" data-action="reset-all">
                                        ⚠️ Tüm Sözlük Kart İlerlemesini Sıfırla
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Card Scene (3D Flip Scene) -->
                <div class="fc-card-scene" id="fc-card-scene" title="Kartı çevirmek için tıkla (veya Boşluk tuşu)">
                    <div class="fc-card" id="fc-card">
                        <!-- Dynamic Card Faces rendered by renderCard() -->
                    </div>
                </div>

                <!-- Navigation & Answer Controls -->
                <div class="fc-navigation">
                    <button type="button" class="btn-scholarly btn-fc-nav" id="fc-prev-btn" title="Önceki Kelime (Sol Ok)">
                        ◀ Önceki
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-answer btn-fc-unlearned" id="fc-repeat-btn" title="Bilmiyorum / Tekrar Edilecek Olarak İşaretle (Kısayol: 1)">
                        ❌ Bilmiyorum [1]
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-flip" id="fc-flip-btn" title="Kartı Çevir (Boşluk / Yukarı Ok)">
                        🔄 Çevir [Boşluk]
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-answer btn-fc-learned" id="fc-know-btn" title="Biliyorum / Öğrenildi Olarak İşaretle (Kısayol: 2)">
                        ✅ Biliyorum [2]
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-nav" id="fc-next-btn" title="Sonraki Kelime (Sağ Ok)">
                        Sonraki ▶
                    </button>
                </div>

                <!-- Keyboard shortcuts bar -->
                <div class="fc-shortcuts-hint">
                    <span>⌨️ Kısayollar: <strong>[Boşluk]</strong> Çevir • <strong>[Sol / Sağ Ok]</strong> Gezin • <strong>[1]</strong> Bilmiyorum • <strong>[2]</strong> Biliyorum</span>
                    <button type="button" class="btn-icon-action btn-sm" id="fc-shuffle-btn" title="Kartları Karıştır">🔀 Karıştır</button>
                </div>

            </div>
        `;

        this.renderCard();
    }

    renderBatchOptions(poolWords, totalBatches) {
        let html = '';
        for (let i = 0; i < totalBatches; i++) {
            const start = i * 10;
            const end = Math.min(start + 10, poolWords.length);
            const batchWords = poolWords.slice(start, end);
            const stats = this.getStatsForWords(batchWords);
            const isSelected = this.deckMode === 'batch' && this.batchIndex === i;
            
            html += `
                <option value="batch:${i}" ${isSelected ? 'selected' : ''}>
                    Grup ${i + 1} (${start + 1}–${end}) • ${stats.learned}/${stats.total} Öğrenildi (%${stats.percent})
                </option>
            `;
        }
        return html;
    }

    getDeckProgressLabel(batchStats, subStats, knownCount, totalPool) {
        if (this.deckMode === 'known') {
            return `🏆 Bildiklerim: ${knownCount} Kelime`;
        }
        if (this.deckMode === 'unknown') {
            return `⏳ Bilmediklerim: ${totalPool - knownCount} Kelime`;
        }
        if (this.deckMode === 'all_pool') {
            return `📋 Tüm Havuz: ${subStats.learned} / ${subStats.total} Öğrenildi`;
        }
        return `📦 Paket İlerlemesi: ${batchStats.learned} / ${batchStats.total} Kelime`;
    }

    getMainCategoryLabel() {
        if (this.mainCategory === 'athenaze') return 'Athenaze I';
        if (this.mainCategory === 'emel_hoca') return "Emel Hoca'nın Seçtikleri";
        return 'Tüm Sözlük';
    }

    /* ==========================================================================
       RENDER CURRENT CARD (BIDIRECTIONAL)
       ========================================================================== */
    renderCard() {
        const cardContainer = this.container.querySelector('#fc-card');
        if (!cardContainer) return;

        // Empty state check
        if (!this.currentDeck || this.currentDeck.length === 0) {
            cardContainer.innerHTML = `
                <div class="fc-card-face fc-card-front fc-card-empty">
                    <div class="empty-icon">📜</div>
                    <h3>Bu grupta kelime bulunamadı</h3>
                    <p>${this.deckMode === 'known' ? 'Henüz "Biliyorum" olarak işaretlenmiş kelime yok.' : 'Kriterlerinize uygun kelime kartı bulunmuyor.'}</p>
                    <button type="button" class="btn-scholarly btn-sm btn-fc-empty-reset" id="fc-empty-back-btn">
                        📦 Tüm Paketlere Dön
                    </button>
                </div>
                <div class="fc-card-face fc-card-back fc-card-empty"></div>
            `;
            const emptyBtn = this.container.querySelector('#fc-empty-back-btn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', () => {
                    this.deckMode = 'batch';
                    this.batchIndex = 0;
                    this.buildActiveDeck();
                    this.render();
                });
            }
            return;
        }

        const item = this.currentDeck[this.currentIndex];
        const isLearned = this.isWordLearned(item.id);
        const cardStatusBadge = isLearned 
            ? `<span class="badge fc-badge-status learned">✅ Öğrenildi</span>`
            : `<span class="badge fc-badge-status unlearned">⏳ Henüz Öğrenilmedi</span>`;

        const originBadges = `
            ${item.isAthenaze ? `<span class="badge badge-athenaze" title="Athenaze Book I (1α-3β)">📚 Athenaze I</span>` : ''}
            ${item.isEmelHoca ? `<span class="badge badge-emel" title="Emel Hoca'nın Seçtikleri">🌸 Emel Hoca</span>` : ''}
            <span class="badge badge-pos">${item.partOfSpeech || 'Kelime'}</span>
        `;

        // Reset flip state
        this.isFlipped = false;
        cardContainer.classList.remove('is-flipped');

        let frontHtml = '';
        let backHtml = '';

        if (this.direction === 'greek_to_tr') {
            /* ---------------------------------------------------------
               DIRECTION: GREEK ➔ TURKISH (Classic Reading Mode)
               --------------------------------------------------------- */
            frontHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-badges-wrap">${originBadges}</div>
                    <div class="fc-status-wrap">${cardStatusBadge}</div>
                </div>

                <div class="fc-front-main">
                    <div class="fc-greek-word">${item.word}</div>
                    <div class="fc-translit">${item.transliteration || ''}</div>
                    <div class="fc-lemma">${item.lemma}</div>
                    <button type="button" class="btn-audio-round btn-fc-audio" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                </div>

                <div class="fc-card-bottom-bar">
                    <span class="fc-card-counter">${this.currentIndex + 1} / ${this.currentDeck.length}</span>
                    <span class="fc-hint">💡 Çevirmek için tıkla (Boşluk)</span>
                </div>
            `;

            backHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-back-title-wrap">
                        <span class="fc-back-word">${item.word}</span>
                        <span class="fc-back-translit">(${item.transliteration || ''})</span>
                    </div>
                    <button type="button" class="btn-audio-round btn-sm btn-fc-audio" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                </div>

                <div class="fc-back-content">
                    <div class="fc-section">
                        <span class="fc-section-label">📖 Türkçe Tanımlar:</span>
                        <ul class="fc-meanings-list">
                            ${(item.meanings_tr || []).map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>

                    ${item.meanings_en && item.meanings_en.length > 0 ? `
                        <div class="fc-section">
                            <span class="fc-section-label">🏛️ İngilizce (LSJ):</span>
                            <p class="fc-meanings-en">${item.meanings_en.join('; ')}</p>
                        </div>
                    ` : ''}

                    ${item.athenaze_forms ? `
                        <div class="fc-section fc-athenaze-note">
                            <span class="fc-section-label">📚 Athenaze Formları:</span>
                            <p class="fc-note-text">${item.athenaze_forms}</p>
                        </div>
                    ` : ''}

                    ${item.emel_notes ? `
                        <div class="fc-section fc-emel-note">
                            <span class="fc-section-label">🌸 Emel Hoca Notu:</span>
                            <p class="fc-note-text">${item.emel_notes}</p>
                        </div>
                    ` : ''}

                    ${item.examples && item.examples.length > 0 ? `
                        <div class="fc-quote-box">
                            <span class="fc-quote-greek">"${item.examples[0].greek}"</span>
                            <span class="fc-quote-tr">${item.examples[0].tr}</span>
                            <span class="fc-quote-author">— ${item.examples[0].author || ''} ${item.examples[0].work ? '(' + item.examples[0].work + ')' : ''}</span>
                        </div>
                    ` : ''}
                </div>

                <div class="fc-card-bottom-bar">
                    <span class="fc-card-counter">${this.currentIndex + 1} / ${this.currentDeck.length}</span>
                    <span class="fc-hint">💡 Çevirmek için tıkla (Boşluk)</span>
                </div>
            `;
        } else {
            /* ---------------------------------------------------------
               DIRECTION: TURKISH ➔ GREEK (Active Recall Mode)
               --------------------------------------------------------- */
            frontHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-badges-wrap">${originBadges}</div>
                    <div class="fc-status-wrap">${cardStatusBadge}</div>
                </div>

                <div class="fc-front-main tr-front">
                    <div class="fc-tr-front-hint">Türkçe Anlam:</div>
                    <div class="fc-tr-front-title">${(item.meanings_tr || [])[0] || 'Anlam'}</div>
                    ${item.meanings_tr && item.meanings_tr.length > 1 ? `
                        <div class="fc-tr-sub-meaning">${item.meanings_tr.slice(1, 3).join(' • ')}</div>
                    ` : ''}
                    <div class="fc-tr-meta-hint">İpucu: ${item.partOfSpeech || ''}</div>
                </div>

                <div class="fc-card-bottom-bar">
                    <span class="fc-card-counter">${this.currentIndex + 1} / ${this.currentDeck.length}</span>
                    <span class="fc-hint">💡 Grekçe karşılığı düşünüp çevirin (Boşluk)</span>
                </div>
            `;

            backHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-back-title-wrap">
                        <span class="fc-back-greek-answer">${item.word}</span>
                        <span class="fc-back-translit">(${item.transliteration || ''})</span>
                    </div>
                    <button type="button" class="btn-audio-round btn-fc-audio" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                </div>

                <div class="fc-back-content">
                    <div class="fc-lemma-highlight">${item.lemma}</div>

                    <div class="fc-section">
                        <span class="fc-section-label">📖 Tüm Türkçe Anlamlar:</span>
                        <ul class="fc-meanings-list">
                            ${(item.meanings_tr || []).map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>

                    ${item.etymology ? `
                        <div class="fc-section">
                            <span class="fc-section-label">🌱 Etimoloji:</span>
                            <p class="fc-etymology">${item.etymology}</p>
                        </div>
                    ` : ''}

                    ${item.derivatives && item.derivatives.length > 0 ? `
                        <div class="fc-section">
                            <span class="fc-section-label">🌍 Türevler:</span>
                            <p class="fc-derivatives">${item.derivatives.slice(0, 3).join(', ')}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="fc-card-bottom-bar">
                    <span class="fc-card-counter">${this.currentIndex + 1} / ${this.currentDeck.length}</span>
                    <span class="fc-hint">💡 Çevirmek için tıkla (Boşluk)</span>
                </div>
            `;
        }

        cardContainer.innerHTML = `
            <div class="fc-card-face fc-card-front">${frontHtml}</div>
            <div class="fc-card-face fc-card-back">${backHtml}</div>
        `;

        // Re-attach audio buttons
        cardContainer.querySelectorAll('.btn-fc-audio').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const word = btn.dataset.word;
                if (word && window.GreekUtils) {
                    window.GreekUtils.speak(word);
                }
            });
        });
    }

    /* ==========================================================================
       CARD ACTIONS & ANSWERING
       ========================================================================== */
    flip() {
        this.isFlipped = !this.isFlipped;
        const card = this.container.querySelector('#fc-card');
        if (card) {
            card.classList.toggle('is-flipped', this.isFlipped);
        }
    }

    next() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        if (this.currentIndex < this.currentDeck.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.renderCard();
    }

    prev() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.currentDeck.length - 1;
        }
        this.renderCard();
    }

    markCurrentLearned() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        const item = this.currentDeck[this.currentIndex];
        this.setWordStatus(item.id, 'learned');
        this.updateProgressUI();
        this.next();
    }

    markCurrentUnlearned() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        const item = this.currentDeck[this.currentIndex];
        this.setWordStatus(item.id, 'unlearned');
        this.updateProgressUI();
        this.next();
    }

    shuffle() {
        if (!this.currentDeck || this.currentDeck.length <= 1) return;
        for (let i = this.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentDeck[i], this.currentDeck[j]] = [this.currentDeck[j], this.currentDeck[i]];
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.renderCard();
    }

    updateProgressUI() {
        const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const totalBatches = Math.max(1, Math.ceil(poolWords.length / 10));
        const subStats = this.getCurrentSubCategoryStats();
        const batchStats = this.getCurrentBatchStats();
        const knownCount = poolWords.filter(w => this.isWordLearned(w.id)).length;

        // Update percent and fill bar
        const percent = this.deckMode === 'batch' ? batchStats.percent : subStats.percent;
        const percentEl = this.container.querySelector('#fc-progress-percent');
        const fillEl = this.container.querySelector('#fc-progress-bar-fill');
        const labelEl = this.container.querySelector('#fc-progress-label');

        if (percentEl) percentEl.textContent = `%${percent}`;
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (labelEl) {
            labelEl.textContent = this.getDeckProgressLabel(batchStats, subStats, knownCount, poolWords.length);
        }

        // Re-render batch options in dropdown to reflect new numbers
        const selectEl = this.container.querySelector('#fc-deck-select');
        if (selectEl) {
            const val = selectEl.value;
            selectEl.innerHTML = `
                <optgroup label="── 10'arlık Çalışma Paketleri ──">
                    ${this.renderBatchOptions(poolWords, totalBatches)}
                </optgroup>
                <optgroup label="── Akıllı Filtreli Desteler (Tüm Liste) ──">
                    <option value="mode:known" ${this.deckMode === 'known' ? 'selected' : ''}>
                        🏆 Bildiğim Kelimeler (${knownCount} Kelime)
                    </option>
                    <option value="mode:unknown" ${this.deckMode === 'unknown' ? 'selected' : ''}>
                        ⏳ Bilmediklerim / Tekrar (${poolWords.length - knownCount} Kelime)
                    </option>
                    <option value="mode:all_pool" ${this.deckMode === 'all_pool' ? 'selected' : ''}>
                        📋 Tüm Havuz (${poolWords.length} Kelime)
                    </option>
                </optgroup>
            `;
            selectEl.value = val;
        }
    }

    /* ==========================================================================
       HIERARCHICAL RESET ACTIONS
       ========================================================================== */
    resetCurrentBatch() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const start = this.batchIndex * 10;
        const batchWords = words.slice(start, start + 10);
        
        batchWords.forEach(w => {
            delete this.progress[w.id];
        });
        this.saveProgress();
        this.buildActiveDeck();
        this.render();
    }

    resetCurrentSubCategory() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        words.forEach(w => {
            delete this.progress[w.id];
        });
        this.saveProgress();
        this.buildActiveDeck();
        this.render();
    }

    resetCurrentMainCategory() {
        const words = this.getMainCategoryWords(this.mainCategory);
        words.forEach(w => {
            delete this.progress[w.id];
        });
        this.saveProgress();
        this.buildActiveDeck();
        this.render();
    }

    resetAllProgress() {
        this.progress = {};
        this.saveProgress();
        this.buildActiveDeck();
        this.render();
    }

    /* ==========================================================================
       EVENT LISTENERS & INTERACTION
       ========================================================================== */
    bindEvents() {
        // Card scene click to flip (ignore buttons)
        this.container.addEventListener('click', (e) => {
            const cardScene = e.target.closest('#fc-card-scene');
            if (cardScene && !e.target.closest('button')) {
                this.flip();
                return;
            }

            // Direction toggle
            const dirBtn = e.target.closest('.btn-fc-toggle');
            if (dirBtn) {
                const dir = dirBtn.dataset.direction;
                if (dir && dir !== this.direction) {
                    this.direction = dir;
                    this.savePreferences();
                    this.render();
                }
                return;
            }

            // Main scope pills
            const mainPill = e.target.closest('#fc-main-pills .fc-pill');
            if (mainPill) {
                const mainCat = mainPill.dataset.main;
                if (mainCat && mainCat !== this.mainCategory) {
                    this.mainCategory = mainCat;
                    this.subCategory = 'all';
                    this.deckMode = 'batch';
                    this.batchIndex = 0;
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                }
                return;
            }

            // Sub-category pills
            const subPill = e.target.closest('#fc-sub-pills .fc-sub-pill');
            if (subPill) {
                const subCat = subPill.dataset.sub;
                if (subCat && subCat !== this.subCategory) {
                    this.subCategory = subCat;
                    this.deckMode = 'batch';
                    this.batchIndex = 0;
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                }
                return;
            }

            // Answer buttons
            if (e.target.closest('#fc-know-btn')) {
                this.markCurrentLearned();
                return;
            }
            if (e.target.closest('#fc-repeat-btn')) {
                this.markCurrentUnlearned();
                return;
            }
            if (e.target.closest('#fc-flip-btn')) {
                this.flip();
                return;
            }
            if (e.target.closest('#fc-next-btn')) {
                this.next();
                return;
            }
            if (e.target.closest('#fc-prev-btn')) {
                this.prev();
                return;
            }
            if (e.target.closest('#fc-shuffle-btn')) {
                this.shuffle();
                return;
            }

            // Reset menu dropdown toggle
            const resetToggleBtn = e.target.closest('#fc-reset-toggle-btn');
            const resetMenu = this.container.querySelector('#fc-reset-menu');
            if (resetToggleBtn && resetMenu) {
                resetMenu.classList.toggle('hidden');
                return;
            }

            // Reset menu items
            const resetItem = e.target.closest('.fc-reset-item');
            if (resetItem) {
                const action = resetItem.dataset.action;
                if (resetMenu) resetMenu.classList.add('hidden');

                if (action === 'reset-batch') {
                    if (confirm(`Seçili 10'luk paketin (${this.batchIndex + 1}. Grup) ilerlemesini sıfırlamak istiyor musunuz?`)) {
                        this.resetCurrentBatch();
                    }
                } else if (action === 'reset-sub') {
                    const subName = this.subCategory === 'all' ? 'Tüm Türler' : this.subCategory;
                    if (confirm(`"${subName}" alt kategorisindeki tüm kelimelerin ilerlemesini sıfırlamak istiyor musunuz?`)) {
                        this.resetCurrentSubCategory();
                    }
                } else if (action === 'reset-main') {
                    if (confirm(`"${this.getMainCategoryLabel()}" kütüphanesindeki TÜM kelimelerin ilerlemesini sıfırlamak istiyor musunuz?`)) {
                        this.resetCurrentMainCategory();
                    }
                } else if (action === 'reset-all') {
                    if (confirm(`DİKKAT: Tüm sözlükteki bütün kelime kartı ilerlemeniz tamamen silinecektir. Emin misiniz?`)) {
                        this.resetAllProgress();
                    }
                }
                return;
            }

            // Close reset menu if clicked outside
            if (resetMenu && !resetMenu.classList.contains('hidden') && !e.target.closest('.fc-reset-btn-wrapper')) {
                resetMenu.classList.add('hidden');
            }
        });

        // Deck / Batch select change
        this.container.addEventListener('change', (e) => {
            if (e.target.id === 'fc-deck-select') {
                const val = e.target.value;
                if (val.startsWith('batch:')) {
                    this.deckMode = 'batch';
                    this.batchIndex = parseInt(val.replace('batch:', ''), 10) || 0;
                } else if (val === 'mode:known') {
                    this.deckMode = 'known';
                } else if (val === 'mode:unknown') {
                    this.deckMode = 'unknown';
                } else if (val === 'mode:all_pool') {
                    this.deckMode = 'all_pool';
                }
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
            }
        });

        // Global Keyboard navigation
        window.addEventListener('keydown', (e) => {
            const isTabActive = document.querySelector('#view-flashcards')?.classList.contains('active-tab-content');
            if (!isTabActive) return;

            // Avoid shortcuts if user is typing in an input or select
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.flip();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.next();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === '1') {
                e.preventDefault();
                this.markCurrentUnlearned();
            } else if (e.key === '2') {
                e.preventDefault();
                this.markCurrentLearned();
            }
        });
    }
}

window.FlashcardTrainer = FlashcardTrainer;
