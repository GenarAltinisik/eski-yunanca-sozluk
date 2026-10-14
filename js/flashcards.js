/**
 * Ancient Greek Flashcards Learning Platform
 * Comprehensive multi-tiered spaced repetition and review system
 * 
 * Features:
 * - Card-Centric (Hero) Design: Flashcard is the primary focal element on screen.
 * - Compact Control Bar (52px) with collapsible Deck & Filter Drawer.
 * - Big Prominent Hero Answer: Main answer is displayed large & bold first; details scrollable below.
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

        // Drawer & Menu UI states
        this.isFilterDrawerOpen = false;
        this.isResetMenuOpen = false;

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

    buildActiveDeck() {
        const words = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        
        if (this.deckMode === 'known') {
            this.currentDeck = words.filter(w => this.isWordLearned(w.id));
        } else if (this.deckMode === 'unknown') {
            this.currentDeck = words.filter(w => !this.isWordLearned(w.id));
        } else if (this.deckMode === 'all_pool') {
            this.currentDeck = [...words];
        } else {
            const totalBatches = Math.max(1, Math.ceil(words.length / 10));
            if (this.batchIndex >= totalBatches) {
                this.batchIndex = 0;
            }
            const start = this.batchIndex * 10;
            const end = start + 10;
            this.currentDeck = words.slice(start, end);
        }

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

    getMainCategoryLabel() {
        if (this.mainCategory === 'athenaze') return '📚 Athenaze I';
        if (this.mainCategory === 'emel_hoca') return "🌸 Emel Hoca";
        return '🌟 Tüm Sözlük';
    }

    getSubCategoryLabel() {
        if (this.subCategory === 'İsim') return 'İsimler';
        if (this.subCategory === 'Fiil') return 'Fiiller';
        if (this.subCategory === 'Sıfat') return 'Sıfatlar';
        if (this.subCategory === 'Edat') return 'Edatlar';
        return 'Tüm Türler';
    }

    getDeckSummaryLabel() {
        const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const batchStats = this.getCurrentBatchStats();
        
        let modeLabel = '';
        if (this.deckMode === 'known') {
            const count = poolWords.filter(w => this.isWordLearned(w.id)).length;
            modeLabel = `🏆 Bildiklerim (${count})`;
        } else if (this.deckMode === 'unknown') {
            const count = poolWords.filter(w => !this.isWordLearned(w.id)).length;
            modeLabel = `⏳ Bilmediklerim (${count})`;
        } else if (this.deckMode === 'all_pool') {
            modeLabel = `📋 Tüm Havuz (${poolWords.length})`;
        } else {
            modeLabel = `📦 Grup ${this.batchIndex + 1} (${batchStats.learned}/${batchStats.total})`;
        }

        return `${this.getMainCategoryLabel()} • ${this.getSubCategoryLabel()} • ${modeLabel}`;
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
        const knownCount = poolWords.filter(w => this.isWordLearned(w.id)).length;
        const unknownCount = poolWords.length - knownCount;

        const currentPercent = this.deckMode === 'batch' ? batchStats.percent : subStats.percent;

        this.container.innerHTML = `
            <div class="flashcards-wrapper">
                
                <!-- COMPACT HERO CONTROL STRIP (Sleek 52px Bar) -->
                <div class="fc-hero-control-strip">
                    
                    <!-- Left: Active Deck Selector Button -->
                    <button type="button" class="fc-deck-trigger-btn" id="fc-deck-trigger-btn" title="Kategori, Gramer Türü ve Paket Seçimi İçin Tıklayın">
                        <span class="fc-deck-trigger-icon">🎯</span>
                        <span class="fc-deck-trigger-text">${this.getDeckSummaryLabel()}</span>
                        <span class="fc-deck-trigger-arrow">▾</span>
                    </button>

                    <!-- Center / Right Controls: Direction Toggle, Progress Badge, Reset, Shuffle -->
                    <div class="fc-strip-actions">
                        
                        <!-- Direction Toggle -->
                        <div class="fc-toggle-group" title="Çalışma Yönünü Değiştir">
                            <button type="button" class="btn-fc-toggle ${this.direction === 'greek_to_tr' ? 'active' : ''}" data-direction="greek_to_tr" title="Grekçe ➔ Türkçe">
                                🇬🇷 ➔ 🇹🇷
                            </button>
                            <button type="button" class="btn-fc-toggle ${this.direction === 'tr_to_greek' ? 'active' : ''}" data-direction="tr_to_greek" title="Türkçe ➔ Grekçe">
                                🇹🇷 ➔ 🇬🇷
                            </button>
                        </div>

                        <!-- Progress Percent Pill -->
                        <div class="fc-strip-percent-badge" title="Bu Paketteki Öğrenme Oranı">
                            <span id="fc-progress-percent">%${currentPercent}</span>
                        </div>

                        <!-- Reset Menu Dropdown -->
                        <div class="fc-reset-btn-wrapper">
                            <button type="button" class="btn-scholarly btn-sm btn-fc-reset" id="fc-reset-toggle-btn" title="İlerlemeyi Sıfırla">
                                🗑️ Sıfırla ▾
                            </button>
                            <div class="fc-reset-menu hidden" id="fc-reset-menu">
                                <button type="button" class="fc-reset-item" data-action="reset-batch">
                                    📦 Bu Paketi Sıfırla (${this.deckMode === 'batch' ? (this.batchIndex + 1) + '. Grup' : 'Mevcut Paket'})
                                </button>
                                <button type="button" class="fc-reset-item" data-action="reset-sub">
                                    📑 Bu Alt Kategoriyi Sıfırla (${this.getSubCategoryLabel()})
                                </button>
                                <button type="button" class="fc-reset-item" data-action="reset-main">
                                    🏛️ Bu Ana Kütüphaneyi Sıfırla (${this.getMainCategoryLabel()})
                                </button>
                                <div class="fc-reset-divider"></div>
                                <button type="button" class="fc-reset-item danger" data-action="reset-all">
                                    ⚠️ Tüm Sözlük Kart İlerlemesini Sıfırla
                                </button>
                            </div>
                        </div>

                        <!-- Shuffle Button -->
                        <button type="button" class="btn-icon-action btn-sm" id="fc-shuffle-btn" title="Kartları Karıştır">🔀</button>

                    </div>

                    <!-- Mini Progress Line under the strip -->
                    <div class="fc-strip-progress-line">
                        <div class="fc-strip-progress-fill" id="fc-progress-bar-fill" style="width: ${currentPercent}%"></div>
                    </div>

                </div>

                <!-- COLLAPSIBLE FILTER & DECK DRAWER / SHEET -->
                <div class="fc-deck-drawer ${this.isFilterDrawerOpen ? 'open' : 'hidden'}" id="fc-deck-drawer">
                    <div class="fc-drawer-content">
                        
                        <div class="fc-drawer-header">
                            <h4>🎯 Çalışma Kütüphanesi, Gramer Türü ve Paket Seçimi</h4>
                            <button type="button" class="btn-icon-action" id="fc-drawer-close-btn" title="Kapat">✕</button>
                        </div>

                        <!-- 1. Layer: Main Scope -->
                        <div class="fc-drawer-section">
                            <span class="fc-drawer-section-title">1. Ana Kaynak Kütüphanesi:</span>
                            <div class="fc-pills-row" id="fc-main-pills">
                                <button type="button" class="fc-pill ${this.mainCategory === 'all' ? 'active' : ''}" data-main="all">
                                    🌟 Tüm Kelimeler (${this.fullDictionary.length})
                                </button>
                                <button type="button" class="fc-pill fc-pill-ath ${this.mainCategory === 'athenaze' ? 'active' : ''}" data-main="athenaze">
                                    📚 Athenaze: Book I (${this.getMainCategoryWords('athenaze').length})
                                </button>
                                <button type="button" class="fc-pill fc-pill-emel ${this.mainCategory === 'emel_hoca' ? 'active' : ''}" data-main="emel_hoca">
                                    🌸 Emel Hoca'nın Seçtikleri (${this.getMainCategoryWords('emel_hoca').length})
                                </button>
                            </div>
                        </div>

                        <!-- 2. Layer: Sub-categories -->
                        <div class="fc-drawer-section">
                            <span class="fc-drawer-section-title">2. Kelime Türü (Gramer):</span>
                            <div class="fc-pills-row" id="fc-sub-pills">
                                <button type="button" class="fc-sub-pill ${this.subCategory === 'all' ? 'active' : ''}" data-sub="all">
                                    Tüm Türler (${this.getMainCategoryWords(this.mainCategory).length})
                                </button>
                                <button type="button" class="fc-sub-pill ${this.subCategory === 'İsim' ? 'active' : ''}" data-sub="İsim">
                                    İsimler (${this.getSubCategoryWords(this.mainCategory, 'İsim').length})
                                </button>
                                <button type="button" class="fc-sub-pill ${this.subCategory === 'Fiil' ? 'active' : ''}" data-sub="Fiil">
                                    Fiiller (${this.getSubCategoryWords(this.mainCategory, 'Fiil').length})
                                </button>
                                <button type="button" class="fc-sub-pill ${this.subCategory === 'Sıfat' ? 'active' : ''}" data-sub="Sıfat">
                                    Sıfatlar (${this.getSubCategoryWords(this.mainCategory, 'Sıfat').length})
                                </button>
                                <button type="button" class="fc-sub-pill ${this.subCategory === 'Edat' ? 'active' : ''}" data-sub="Edat">
                                    Edatlar & Bağlaçlar (${this.getSubCategoryWords(this.mainCategory, 'Edat').length})
                                </button>
                            </div>
                        </div>

                        <!-- 3. Layer: 10-Word Batches Grid -->
                        <div class="fc-drawer-section">
                            <span class="fc-drawer-section-title">3. 10'arlık Çalışma Paketleri:</span>
                            <div class="fc-batches-grid" id="fc-batches-grid">
                                ${this.renderDrawerBatchCards(poolWords, totalBatches)}
                            </div>
                        </div>

                        <!-- 4. Layer: Smart Decks (Unrestricted size) -->
                        <div class="fc-drawer-section">
                            <span class="fc-drawer-section-title">4. Özel Akıllı Havuzlar (10 Sınırı Olmadan):</span>
                            <div class="fc-smart-decks-row">
                                <button type="button" class="fc-smart-deck-btn ${this.deckMode === 'known' ? 'active' : ''}" data-mode="known">
                                    🏆 Bildiğim Kelimeler (${knownCount})
                                </button>
                                <button type="button" class="fc-smart-deck-btn ${this.deckMode === 'unknown' ? 'active' : ''}" data-mode="unknown">
                                    ⏳ Bilmediğim / Tekrar (${unknownCount})
                                </button>
                                <button type="button" class="fc-smart-deck-btn ${this.deckMode === 'all_pool' ? 'active' : ''}" data-mode="all_pool">
                                    📋 Tüm Havuz (${poolWords.length})
                                </button>
                            </div>
                        </div>

                        <div class="fc-drawer-footer">
                            <button type="button" class="btn-scholarly btn-sm" id="fc-drawer-apply-btn">
                                ✓ Kartlara Dön ve Çalışmaya Başla
                            </button>
                        </div>

                    </div>
                </div>

                <!-- HERO FLASHCARD SCENE (Dominates the screen) -->
                <div class="fc-card-scene" id="fc-card-scene" title="Kartı çevirmek için tıkla (veya Boşluk tuşu)">
                    <div class="fc-card" id="fc-card">
                        <!-- Dynamic Card Faces rendered by renderCard() -->
                    </div>
                </div>

                <!-- BOTTOM ANSWER & NAVIGATION CONTROLS -->
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
                    <span class="fc-counter-hint" id="fc-counter-hint">
                        ${this.currentDeck.length > 0 ? (this.currentIndex + 1) + ' / ' + this.currentDeck.length : '0 / 0'}
                    </span>
                </div>

            </div>
        `;

        this.renderCard();
    }

    renderDrawerBatchCards(poolWords, totalBatches) {
        let html = '';
        for (let i = 0; i < totalBatches; i++) {
            const start = i * 10;
            const end = Math.min(start + 10, poolWords.length);
            const batchWords = poolWords.slice(start, end);
            const stats = this.getStatsForWords(batchWords);
            const isSelected = this.deckMode === 'batch' && this.batchIndex === i;

            html += `
                <button type="button" class="fc-batch-card-btn ${isSelected ? 'active' : ''}" data-batch="${i}">
                    <div class="batch-title">Grup ${i + 1} (${start + 1}–${end})</div>
                    <div class="batch-stats-line">
                        <span class="batch-learned-text">${stats.learned}/${stats.total} Öğrenildi</span>
                        <span class="batch-percent">%${stats.percent}</span>
                    </div>
                    <div class="batch-progress-bar">
                        <div class="batch-progress-fill" style="width: ${stats.percent}%"></div>
                    </div>
                </button>
            `;
        }
        return html;
    }

    /* ==========================================================================
       RENDER CURRENT CARD (BIDIRECTIONAL WITH HERO ANSWERS)
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

        // Update footer counter
        const counterEl = this.container.querySelector('#fc-counter-hint');
        if (counterEl) {
            counterEl.textContent = `${this.currentIndex + 1} / ${this.currentDeck.length}`;
        }

        // Reset flip state
        this.isFlipped = false;
        cardContainer.classList.remove('is-flipped');

        let frontHtml = '';
        let backHtml = '';

        if (this.direction === 'greek_to_tr') {
            /* ---------------------------------------------------------
               DIRECTION: GREEK ➔ TURKISH
               Front: Greek Word (Question)
               Back: BIG HERO TURKISH MEANING (Answer) + Scrollable Details
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

            const primaryMeaning = (item.meanings_tr || [])[0] || 'Anlam';
            const secondaryMeaning = (item.meanings_tr || []).slice(1).join(' • ');

            backHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-back-title-wrap">
                        <span class="fc-back-word">${item.word}</span>
                        <span class="fc-back-translit">(${item.transliteration || ''})</span>
                    </div>
                    <button type="button" class="btn-audio-round btn-sm btn-fc-audio" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                </div>

                <!-- BIG HERO ANSWER BLOCK (Prominent First View) -->
                <div class="fc-hero-answer-block">
                    <div class="fc-hero-answer-badge">🎯 Türkçe Karşılık</div>
                    <div class="fc-hero-answer-title">${primaryMeaning}</div>
                    ${secondaryMeaning ? `<div class="fc-hero-answer-sub">${secondaryMeaning}</div>` : ''}
                </div>

                <!-- SCROLLABLE EXTRA DETAILS BELOW -->
                <div class="fc-scrollable-details">
                    <div class="fc-details-divider">
                        <span>📜 Gramer, Alıntılar ve Detaylar (Aşağı Kaydırın ▾)</span>
                    </div>

                    <div class="fc-section">
                        <span class="fc-section-label">📖 Tüm Tanımlar:</span>
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

                    ${item.grammar && item.grammar.principal_parts ? `
                        <div class="fc-section">
                            <span class="fc-section-label">🏛️ Fiil Zaman Formları:</span>
                            <div class="fc-forms-grid">
                                ${item.grammar.principal_parts.map(p => `<div>👉 ${p}</div>`).join('')}
                            </div>
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
               DIRECTION: TURKISH ➔ GREEK
               Front: Turkish Meaning (Question)
               Back: BIG HERO GREEK WORD (Answer) + Pronunciation + Details
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
                    <span class="fc-hint">💡 Grekçe karşılığı zihninizde canlandırın (Boşluk)</span>
                </div>
            `;

            backHtml = `
                <div class="fc-card-top-bar">
                    <div class="fc-back-title-wrap">
                        <span class="fc-back-word">${(item.meanings_tr || [])[0] || ''}</span>
                    </div>
                    <button type="button" class="btn-audio-round btn-sm btn-fc-audio" data-word="${item.word}" title="Telaffuz Dinle">🔊</button>
                </div>

                <!-- BIG HERO GREEK ANSWER BLOCK -->
                <div class="fc-hero-answer-block greek-hero">
                    <div class="fc-hero-answer-badge">🎯 Grekçe Karşılık</div>
                    <div class="fc-hero-greek-word">${item.word}</div>
                    <div class="fc-hero-greek-translit">${item.transliteration || ''}</div>
                    <div class="fc-hero-greek-lemma">${item.lemma}</div>
                </div>

                <!-- SCROLLABLE EXTRA DETAILS BELOW -->
                <div class="fc-scrollable-details">
                    <div class="fc-details-divider">
                        <span>📜 Tüm Tanımlar ve Çekim Detayları (Aşağı Kaydırın ▾)</span>
                    </div>

                    <div class="fc-section">
                        <span class="fc-section-label">📖 Türkçe Tanımlar:</span>
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
        const subStats = this.getCurrentSubCategoryStats();
        const batchStats = this.getCurrentBatchStats();
        const currentPercent = this.deckMode === 'batch' ? batchStats.percent : subStats.percent;

        const percentEl = this.container.querySelector('#fc-progress-percent');
        const fillEl = this.container.querySelector('#fc-progress-bar-fill');
        const triggerText = this.container.querySelector('.fc-deck-trigger-text');

        if (percentEl) percentEl.textContent = `%${currentPercent}`;
        if (fillEl) fillEl.style.width = `${currentPercent}%`;
        if (triggerText) triggerText.textContent = this.getDeckSummaryLabel();
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
       DRAWER CONTROLS
       ========================================================================== */
    toggleDrawer(forceOpen = null) {
        const drawer = this.container.querySelector('#fc-deck-drawer');
        if (!drawer) return;

        if (forceOpen !== null) {
            this.isFilterDrawerOpen = forceOpen;
        } else {
            this.isFilterDrawerOpen = !this.isFilterDrawerOpen;
        }

        if (this.isFilterDrawerOpen) {
            drawer.classList.remove('hidden');
            drawer.classList.add('open');
        } else {
            drawer.classList.remove('open');
            drawer.classList.add('hidden');
        }
    }

    /* ==========================================================================
       EVENT LISTENERS & INTERACTION
       ========================================================================== */
    bindEvents() {
        this.container.addEventListener('click', (e) => {
            // Card scene click to flip (ignore buttons)
            const cardScene = e.target.closest('#fc-card-scene');
            if (cardScene && !e.target.closest('button')) {
                this.flip();
                return;
            }

            // Open / Close Drawer
            if (e.target.closest('#fc-deck-trigger-btn')) {
                this.toggleDrawer();
                return;
            }
            if (e.target.closest('#fc-drawer-close-btn') || e.target.closest('#fc-drawer-apply-btn')) {
                this.toggleDrawer(false);
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

            // Main scope pills (inside Drawer)
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
                    this.toggleDrawer(true); // keep drawer open to pick subcategory / batch
                }
                return;
            }

            // Sub-category pills (inside Drawer)
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
                    this.toggleDrawer(true); // keep drawer open to pick batch
                }
                return;
            }

            // 10-Word batch card button (inside Drawer)
            const batchCardBtn = e.target.closest('.fc-batch-card-btn');
            if (batchCardBtn) {
                const batchIdx = parseInt(batchCardBtn.dataset.batch, 10) || 0;
                this.deckMode = 'batch';
                this.batchIndex = batchIdx;
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                this.toggleDrawer(false); // smoothly close drawer and focus on cards
                return;
            }

            // Smart deck button (inside Drawer)
            const smartBtn = e.target.closest('.fc-smart-deck-btn');
            if (smartBtn) {
                const mode = smartBtn.dataset.mode;
                if (mode) {
                    this.deckMode = mode;
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                    this.toggleDrawer(false); // smoothly close drawer
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
                this.isResetMenuOpen = !this.isResetMenuOpen;
                resetMenu.classList.toggle('hidden', !this.isResetMenuOpen);
                return;
            }

            // Reset menu items
            const resetItem = e.target.closest('.fc-reset-item');
            if (resetItem) {
                const action = resetItem.dataset.action;
                this.isResetMenuOpen = false;
                if (resetMenu) resetMenu.classList.add('hidden');

                if (action === 'reset-batch') {
                    if (confirm(`Seçili 10'luk paketin (${this.batchIndex + 1}. Grup) ilerlemesini sıfırlamak istiyor musunuz?`)) {
                        this.resetCurrentBatch();
                    }
                } else if (action === 'reset-sub') {
                    const subName = this.getSubCategoryLabel();
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
        });

        // Close reset menu when clicking outside anywhere on document
        document.addEventListener('click', (e) => {
            const resetMenu = this.container?.querySelector('#fc-reset-menu');
            if (resetMenu && !resetMenu.classList.contains('hidden') && !e.target.closest('.fc-reset-btn-wrapper')) {
                this.isResetMenuOpen = false;
                resetMenu.classList.add('hidden');
            }
        });

        // Global Keyboard navigation
        window.addEventListener('keydown', (e) => {
            const isTabActive = document.querySelector('#view-flashcards')?.classList.contains('active-tab-content');
            if (!isTabActive) return;

            // If drawer is open, escape closes it
            if (this.isFilterDrawerOpen && e.code === 'Escape') {
                e.preventDefault();
                this.toggleDrawer(false);
                return;
            }

            // Avoid shortcuts if user is typing in an input
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
