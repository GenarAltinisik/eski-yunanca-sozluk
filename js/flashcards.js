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
        if (mainCat === 'filiz_hoca') {
            return this.fullDictionary.filter(item => 
                item.isFilizHoca === true || (item.tags && item.tags.includes('filiz_hoca'))
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
        if (this.mainCategory === 'filiz_hoca') return "🌿 Filiz Hoca";
        return '🌟 Tüm Sözlük';
    }

    getSubCategoryLabel() {
        if (this.subCategory === 'İsim') return 'İsimler';
        if (this.subCategory === 'Fiil') return 'Fiiller';
        if (this.subCategory === 'Sıfat') return 'Sıfatlar';
        if (this.subCategory === 'Edat') return 'Edatlar';
        return 'Tüm Türler';
    }

    getDeckModeDetailLabel() {
        const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const batchStats = this.getCurrentBatchStats();
        if (this.deckMode === 'known') {
            const count = poolWords.filter(w => this.isWordLearned(w.id)).length;
            return `🏆 Bildiklerim (${count} kelime)`;
        } else if (this.deckMode === 'unknown') {
            const count = poolWords.filter(w => !this.isWordLearned(w.id)).length;
            return `⏳ Bilmediklerim (${count} kelime)`;
        } else if (this.deckMode === 'all_pool') {
            return `📋 Tüm Liste (${poolWords.length} kelime)`;
        } else {
            return `📦 Grup ${this.batchIndex + 1} (${batchStats.learned}/${batchStats.total} Öğrenildi • %${batchStats.percent})`;
        }
    }

    getDeckSummaryLabel() {
        return `${this.getMainCategoryLabel()} • ${this.getSubCategoryLabel()} • ${this.getDeckModeDetailLabel()}`;
    }

    renderBatchSelectOptions(poolWords, totalBatches) {
        let html = '';
        for (let i = 0; i < totalBatches; i++) {
            const start = i * 10;
            const end = Math.min(start + 10, poolWords.length);
            const batchWords = poolWords.slice(start, end);
            const stats = this.getStatsForWords(batchWords);
            const isSelected = this.deckMode === 'batch' && this.batchIndex === i;
            const statusIcon = stats.percent === 100 ? '✅' : (stats.learned > 0 ? '🔄' : '⏳');
            html += `<option value="${i}" ${isSelected ? 'selected' : ''}>
                Grup ${i + 1} (${start + 1}–${end}) • %${stats.percent} (${stats.learned}/${stats.total} Öğrenildi) ${statusIcon}
            </option>`;
        }
        return html;
    }

    renderBatchQuickChips(poolWords, totalBatches) {
        let html = '';
        for (let i = 0; i < totalBatches; i++) {
            const start = i * 10;
            const end = Math.min(start + 10, poolWords.length);
            const batchWords = poolWords.slice(start, end);
            const stats = this.getStatsForWords(batchWords);
            const isSelected = this.deckMode === 'batch' && this.batchIndex === i;
            const isCompleted = stats.percent === 100;
            html += `
                <button type="button" class="fc-quick-chip ${isSelected ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-batch="${i}" title="Grup ${i + 1}: ${stats.learned}/${stats.total} Öğrenildi (%${stats.percent})">
                    ${i + 1}${isCompleted ? '✓' : ''}
                </button>
            `;
        }
        return html;
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
                
                <!-- HERO FLASHCARD SCENE (Dominates the screen at the very top) -->
                <div class="fc-card-scene" id="fc-card-scene" title="Kartı çevirmek için tıkla (veya Boşluk tuşu)">
                    <div class="fc-card" id="fc-card">
                        <!-- Dynamic Card Faces rendered by renderCard() -->
                    </div>
                </div>

                <!-- INLINE COMPLETION & NEXT SET BANNER (Appears on the 10th card of a group) -->
                <div class="fc-batch-banner-container" id="fc-batch-banner-container"></div>

                <!-- BOTTOM ANSWER & NAVIGATION CONTROLS -->
                <div class="fc-navigation">
                    <button type="button" class="btn-scholarly btn-fc-nav btn-fc-prev" id="fc-prev-btn" title="Önceki Kelime (Sol Ok)">
                        ◀ Önceki
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-answer btn-fc-unlearned" id="fc-repeat-btn" title="Bilmiyorum / Tekrar Edilecek Olarak İşaretle (Kısayol: 1)">
                        ❌ Bilmiyorum <span class="btn-key-hint">[1]</span>
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-flip" id="fc-flip-btn" title="Kartı Çevir (Boşluk / Yukarı Ok)">
                        🔄 Çevir <span class="btn-key-hint">[Boşluk]</span>
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-answer btn-fc-learned" id="fc-know-btn" title="Biliyorum / Öğrenildi Olarak İşaretle (Kısayol: 2)">
                        ✅ Biliyorum <span class="btn-key-hint">[2]</span>
                    </button>
                    <button type="button" class="btn-scholarly btn-fc-nav btn-fc-next" id="fc-next-btn" title="Sonraki Kelime (Sağ Ok)">
                        Sonraki ▶
                    </button>
                </div>

                <!-- Keyboard shortcuts / Mobile hint bar -->
                <div class="fc-shortcuts-hint">
                    <span class="fc-shortcuts-desktop-hint">⌨️ Kısayollar: <strong>[Boşluk]</strong> Çevir • <strong>[Sol / Sağ Ok]</strong> Gezin • <strong>[1]</strong> Bilmiyorum • <strong>[2]</strong> Biliyorum</span>
                    <span class="fc-shortcuts-mobile-hint">👆 Kartı çevirmek için dokunun</span>
                    <span class="fc-counter-hint" id="fc-counter-hint">
                        ${this.currentDeck.length > 0 ? (this.currentIndex + 1) + ' / ' + this.currentDeck.length : '0 / 0'}
                    </span>
                </div>

                <!-- SETTINGS & CONTROLS SECTION (Positioned below card section) -->
                <div class="fc-controls-section">
                    
                    <!-- COMPACT HERO CONTROL STRIP (Sleek 52px Bar) -->
                    <div class="fc-hero-control-strip">
                        
                        <!-- Left Controls: Quick Group Stepper & Deck Trigger -->
                        <div class="fc-strip-left-group">
                            ${this.deckMode === 'batch' ? `
                                <!-- Quick Group Stepper (Instant Set Switcher) -->
                                <div class="fc-quick-group-stepper" title="Gruplar arası doğrudan geçiş yapın">
                                    <button type="button" class="fc-quick-step-btn" id="fc-quick-prev-btn" ${this.batchIndex <= 0 ? 'disabled' : ''} title="Önceki 10'lu Grup">
                                        ◀
                                    </button>
                                    <button type="button" class="fc-quick-step-center" id="fc-quick-step-center" title="Tüm grupları ve ayarları açmak için tıklayın">
                                        <span class="fc-quick-step-label">Grup ${this.batchIndex + 1} / ${totalBatches}</span>
                                        <span class="fc-quick-step-sub">${(this.batchIndex * 10) + 1}–${Math.min((this.batchIndex * 10) + 10, poolWords.length)} (${batchStats.learned}/10)</span>
                                    </button>
                                    <button type="button" class="fc-quick-step-btn" id="fc-quick-next-btn" ${this.batchIndex >= totalBatches - 1 ? 'disabled' : ''} title="Sonraki 10'lu Grup">
                                        ▶
                                    </button>
                                </div>
                            ` : ''}

                            <!-- Active Deck Trigger Button -->
                            <button type="button" class="fc-deck-trigger-btn" id="fc-deck-trigger-btn" title="Kütüphane, Kelime Türü ve Grup Ayarlarını Açmak İçin Tıklayın">
                                <span class="fc-deck-trigger-icon">🎯</span>
                                <div class="fc-deck-trigger-texts">
                                    <div class="fc-deck-trigger-headline">
                                        <span class="fc-deck-main-name">${this.getMainCategoryLabel()}</span>
                                        <span class="fc-deck-sep">•</span>
                                        <span class="fc-deck-sub-name">${this.getSubCategoryLabel()}</span>
                                    </div>
                                    <div class="fc-deck-trigger-detail">${this.getDeckModeDetailLabel()}</div>
                                </div>
                                <span class="fc-deck-trigger-pill">⚙️ Ayarlar ▾</span>
                            </button>
                        </div>

                        <!-- Center / Right Controls: Direction Toggle, Progress Badge, Shuffle -->
                        <div class="fc-strip-actions">
                            
                            <!-- Direction Toggle -->
                            <div class="fc-toggle-group" title="Çalışma Yönünü Değiştir">
                                <button type="button" class="btn-fc-toggle ${this.direction === 'greek_to_tr' ? 'active' : ''}" data-direction="greek_to_tr" title="Grekçe Sorulur ➔ Türkçe Cevaplanır">
                                    🇬🇷 ➔ 🇹🇷
                                </button>
                                <button type="button" class="btn-fc-toggle ${this.direction === 'tr_to_greek' ? 'active' : ''}" data-direction="tr_to_greek" title="Türkçe Sorulur ➔ Grekçe Cevaplanır">
                                    🇹🇷 ➔ 🇬🇷
                                </button>
                            </div>

                            <!-- Shuffle Button -->
                            <button type="button" class="btn-scholarly btn-sm btn-outline btn-fc-strip-btn" id="fc-shuffle-btn" title="Bu destedeki kartların sırasını karıştır">
                                🔀 Karıştır
                            </button>

                            <!-- Progress Percent Pill -->
                            <div class="fc-strip-percent-badge" title="Bu Paketteki Öğrenme Oranı">
                                <span id="fc-progress-percent">%${currentPercent}</span>
                            </div>

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
                                <div class="fc-drawer-header-title">
                                    <h3>⚙️ Kelime Kartı Ayarları & Deste Seçimi</h3>
                                    <p class="fc-drawer-header-subtitle">Çalışmak istediğiniz kütüphaneyi, kelime türünü ve çalışma yöntemini belirleyin.</p>
                                </div>
                                <button type="button" class="btn-icon-action" id="fc-drawer-close-btn" title="Kapat">✕</button>
                            </div>

                            <!-- ADIM 1: Kelime Kaynağı -->
                            <div class="fc-setting-block">
                                <div class="fc-setting-label-row">
                                    <span class="fc-step-num">1</span>
                                    <div>
                                        <span class="fc-setting-title">Kelime Kaynağı (Kütüphane)</span>
                                        <span class="fc-setting-desc">Hangi kelime listesinden çalışmak istiyorsunuz?</span>
                                    </div>
                                </div>
                                <div class="fc-sources-grid" id="fc-main-pills">
                                    <button type="button" class="fc-source-card ${this.mainCategory === 'all' ? 'active' : ''}" data-main="all">
                                        <div class="fc-source-header">
                                            <span class="fc-source-icon">🌟</span>
                                            <span class="fc-source-name">Tüm Sözlük</span>
                                        </div>
                                        <div class="fc-source-meta">${this.fullDictionary.length} kelime</div>
                                    </button>
                                    <button type="button" class="fc-source-card fc-source-ath ${this.mainCategory === 'athenaze' ? 'active' : ''}" data-main="athenaze">
                                        <div class="fc-source-header">
                                            <span class="fc-source-icon">📚</span>
                                            <span class="fc-source-name">Athenaze I</span>
                                        </div>
                                        <div class="fc-source-meta">${this.getMainCategoryWords('athenaze').length} kelime</div>
                                    </button>
                                    <button type="button" class="fc-source-card fc-source-emel ${this.mainCategory === 'emel_hoca' ? 'active' : ''}" data-main="emel_hoca">
                                        <div class="fc-source-header">
                                            <span class="fc-source-icon">🌸</span>
                                            <span class="fc-source-name">Emel Hoca</span>
                                        </div>
                                        <div class="fc-source-meta">${this.getMainCategoryWords('emel_hoca').length} kelime</div>
                                    </button>
                                    <button type="button" class="fc-source-card fc-source-filiz ${this.mainCategory === 'filiz_hoca' ? 'active' : ''}" data-main="filiz_hoca">
                                        <div class="fc-source-header">
                                            <span class="fc-source-icon">🌿</span>
                                            <span class="fc-source-name">Filiz Hoca</span>
                                        </div>
                                        <div class="fc-source-meta">${this.getMainCategoryWords('filiz_hoca').length} kelime</div>
                                    </button>
                                </div>
                            </div>

                            <!-- ADIM 2: Kelime Türü -->
                            <div class="fc-setting-block">
                                <div class="fc-setting-label-row">
                                    <span class="fc-step-num">2</span>
                                    <div>
                                        <span class="fc-setting-title">Kelime Türü (Gramer Filtresi)</span>
                                        <span class="fc-setting-desc">Yalnızca belirli bir türe odaklanın:</span>
                                    </div>
                                </div>
                                <div class="fc-sub-pills-row" id="fc-sub-pills">
                                    <button type="button" class="fc-sub-pill ${this.subCategory === 'all' ? 'active' : ''}" data-sub="all">
                                        Tüm Türler (${this.getMainCategoryWords(this.mainCategory).length})
                                    </button>
                                    <button type="button" class="fc-sub-pill ${this.subCategory === 'İsim' ? 'active' : ''}" data-sub="İsim">
                                        🏛️ İsimler (${this.getSubCategoryWords(this.mainCategory, 'İsim').length})
                                    </button>
                                    <button type="button" class="fc-sub-pill ${this.subCategory === 'Fiil' ? 'active' : ''}" data-sub="Fiil">
                                        ⚡ Fiiller (${this.getSubCategoryWords(this.mainCategory, 'Fiil').length})
                                    </button>
                                    <button type="button" class="fc-sub-pill ${this.subCategory === 'Sıfat' ? 'active' : ''}" data-sub="Sıfat">
                                        🎨 Sıfatlar (${this.getSubCategoryWords(this.mainCategory, 'Sıfat').length})
                                    </button>
                                    <button type="button" class="fc-sub-pill ${this.subCategory === 'Edat' ? 'active' : ''}" data-sub="Edat">
                                        🔗 Edatlar & Bağlaçlar (${this.getSubCategoryWords(this.mainCategory, 'Edat').length})
                                    </button>
                                </div>
                            </div>

                            <!-- ADIM 3: Çalışma Yöntemi ve Deste -->
                            <div class="fc-setting-block">
                                <div class="fc-setting-label-row">
                                    <span class="fc-step-num">3</span>
                                    <div>
                                        <span class="fc-setting-title">Çalışma Yöntemi & Deste</span>
                                        <span class="fc-setting-desc">Nasıl bir çalışma planı izlemek istiyorsunuz?</span>
                                    </div>
                                </div>

                                <!-- Mode Selector Tabs -->
                                <div class="fc-mode-selection-tabs">
                                    <button type="button" class="fc-mode-tab ${this.deckMode === 'batch' ? 'active' : ''}" data-deck-category="batch">
                                        📦 10'arlı Gruplar (${totalBatches} Grup)
                                    </button>
                                    <button type="button" class="fc-mode-tab ${this.deckMode !== 'batch' ? 'active' : ''}" data-deck-category="smart">
                                        ⚡ Akıllı Havuzlar & Tüm Liste
                                    </button>
                                </div>

                                <!-- If batch mode is active: Clean Group Stepper & Selector -->
                                ${this.deckMode === 'batch' ? `
                                    <div class="fc-batch-selector-panel">
                                        <div class="fc-batch-stepper">
                                            <button type="button" class="btn-scholarly btn-sm btn-outline fc-batch-step-btn" id="fc-batch-prev-btn" ${this.batchIndex <= 0 ? 'disabled' : ''} title="Önceki Grup">
                                                ◀ Önceki Grup
                                            </button>
                                            <div class="fc-batch-stepper-info">
                                                <div class="fc-batch-stepper-title">Grup ${this.batchIndex + 1} / ${totalBatches}</div>
                                                <div class="fc-batch-stepper-range">${this.batchIndex * 10 + 1} – ${Math.min((this.batchIndex + 1) * 10, poolWords.length)}. kelimeler</div>
                                                <div class="fc-batch-stepper-stats">
                                                    <span class="fc-batch-stepper-badge">${batchStats.learned}/${batchStats.total} Öğrenildi</span>
                                                    <span class="fc-batch-stepper-pct">%${batchStats.percent}</span>
                                                </div>
                                                <div class="fc-batch-progress-mini">
                                                    <div class="fc-batch-progress-mini-fill" style="width: ${batchStats.percent}%"></div>
                                                </div>
                                            </div>
                                            <button type="button" class="btn-scholarly btn-sm btn-outline fc-batch-step-btn" id="fc-batch-next-btn" ${this.batchIndex >= totalBatches - 1 ? 'disabled' : ''} title="Sonraki Grup">
                                                Sonraki Grup ▶
                                            </button>
                                        </div>

                                        <!-- Dropdown for direct selection -->
                                        <div class="fc-batch-dropdown-row">
                                            <label for="fc-batch-select" class="fc-mini-label">🎯 Listeden Seçin:</label>
                                            <select id="fc-batch-select" class="scholarly-select fc-batch-select">
                                                ${this.renderBatchSelectOptions(poolWords, totalBatches)}
                                            </select>
                                        </div>

                                        <!-- Quick mini-chips -->
                                        ${totalBatches <= 40 ? `
                                            <div class="fc-batch-quick-section">
                                                <span class="fc-mini-label">Hızlı Grup Tuşları:</span>
                                                <div class="fc-batch-quick-chips">
                                                    ${this.renderBatchQuickChips(poolWords, totalBatches)}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : `
                                    <!-- If smart decks mode is active -->
                                    <div class="fc-smart-selector-panel">
                                        <div class="fc-smart-decks-grid">
                                            <button type="button" class="fc-smart-card ${this.deckMode === 'unknown' ? 'active' : ''}" data-mode="unknown">
                                                <div class="fc-smart-card-left">
                                                    <span class="fc-smart-card-icon">⏳</span>
                                                    <div class="fc-smart-card-info">
                                                        <div class="fc-smart-card-title">Bilmediklerim / Tekrar</div>
                                                        <div class="fc-smart-card-desc">Henüz "Bilmiyorum" dediğiniz veya çalışmadığınız kelimeler</div>
                                                    </div>
                                                </div>
                                                <div class="fc-smart-card-count">${unknownCount} kelime</div>
                                            </button>

                                            <button type="button" class="fc-smart-card ${this.deckMode === 'known' ? 'active' : ''}" data-mode="known">
                                                <div class="fc-smart-card-left">
                                                    <span class="fc-smart-card-icon">🏆</span>
                                                    <div class="fc-smart-card-info">
                                                        <div class="fc-smart-card-title">Bildiklerim (Pekiştirme)</div>
                                                        <div class="fc-smart-card-desc">"Biliyorum" olarak işaretlediğiniz kelimeleri gözden geçirin</div>
                                                    </div>
                                                </div>
                                                <div class="fc-smart-card-count">${knownCount} kelime</div>
                                            </button>

                                            <button type="button" class="fc-smart-card ${this.deckMode === 'all_pool' ? 'active' : ''}" data-mode="all_pool">
                                                <div class="fc-smart-card-left">
                                                    <span class="fc-smart-card-icon">📋</span>
                                                    <div class="fc-smart-card-info">
                                                        <div class="fc-smart-card-title">Tüm Liste (Serbest Çalışma)</div>
                                                        <div class="fc-smart-card-desc">10 kelime sınırı olmadan seçili havuzun tamamını sırayla çalışın</div>
                                                    </div>
                                                </div>
                                                <div class="fc-smart-card-count">${poolWords.length} kelime</div>
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>

                            <!-- Drawer Footer: Reset & Apply -->
                            <div class="fc-drawer-footer">
                                <div class="fc-drawer-reset-area">
                                    <button type="button" class="btn-scholarly btn-sm btn-outline btn-fc-reset" id="fc-reset-toggle-btn">
                                        🗑️ İlerlemeyi Sıfırla ▾
                                    </button>
                                    <div class="fc-reset-menu hidden" id="fc-reset-menu">
                                        <button type="button" class="fc-reset-item" data-action="reset-batch">
                                            📦 Seçili Paketi Sıfırla (Grup ${this.batchIndex + 1})
                                        </button>
                                        <button type="button" class="fc-reset-item" data-action="reset-sub">
                                            📑 "${this.getSubCategoryLabel()}" Türündeki İlerlemeyi Sıfırla
                                        </button>
                                        <button type="button" class="fc-reset-item" data-action="reset-main">
                                            🏛️ "${this.getMainCategoryLabel()}" Kütüphanesini Sıfırla
                                        </button>
                                        <div class="fc-reset-divider"></div>
                                        <button type="button" class="fc-reset-item danger" data-action="reset-all">
                                            ⚠️ Tüm Kelime Kartı İlerlemesini Tamamen Sıfırla
                                        </button>
                                    </div>
                                </div>

                                <button type="button" class="btn-scholarly btn-sm btn-success" id="fc-drawer-apply-btn">
                                    ✓ Seçimi Uygula ve Kartlara Dön
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        `;

        this.renderCard();
    }

    /* ==========================================================================
       RENDER CURRENT CARD (BIDIRECTIONAL WITH HERO ANSWERS)
       ========================================================================== */
    renderCard() {
        const cardContainer = this.container.querySelector('#fc-card');
        if (!cardContainer) return;

        // Empty state check
        if (!this.currentDeck || this.currentDeck.length === 0) {
            this.renderBanner();
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
        const nounInfo = window.GreekUtils ? window.GreekUtils.getNounInfo(item) : null;
        const cardStatusBadge = isLearned 
            ? `<span class="badge fc-badge-status learned">✅ Öğrenildi</span>`
            : `<span class="badge fc-badge-status unlearned">⏳ Henüz Öğrenilmedi</span>`;

        const originBadges = `
            ${item.isAthenaze ? `<span class="badge badge-athenaze" title="Athenaze Book I (1α-3β)">📚 Athenaze I</span>` : ''}
            ${item.isEmelHoca ? `<span class="badge badge-emel" title="Emel Hoca'nın Seçtikleri">🌸 Emel Hoca</span>` : ''}
            ${item.isFilizHoca ? `<span class="badge badge-filiz" title="Filiz Hoca'nın Notlarından">🌿 Filiz Hoca</span>` : ''}
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
                    <div class="fc-greek-word">
                        ${nounInfo?.article ? `<span class="word-article fc-article">${nounInfo.article}</span>` : ''}
                        <span>${item.word}</span>
                        ${nounInfo?.gender ? `<span class="badge-gender fc-gender-badge badge-gender-${nounInfo.genderClass}" title="${nounInfo.genderTitle}">${nounInfo.gender}</span>` : ''}
                    </div>
                    <div class="fc-translit">${item.transliteration || ''}</div>
                    <div class="fc-lemma">${item.lemma}</div>
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
                        <span class="fc-back-word">
                            ${nounInfo?.article ? `<span class="word-article fc-article-sm">${nounInfo.article}</span>` : ''}
                            ${item.word}
                            ${nounInfo?.gender ? `<span class="badge-gender fc-gender-badge-sm badge-gender-${nounInfo.genderClass}" title="${nounInfo.genderTitle}">${nounInfo.gender}</span>` : ''}
                        </span>
                        <span class="fc-back-translit">(${item.transliteration || ''})</span>
                    </div>
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
                </div>

                <!-- BIG HERO GREEK ANSWER BLOCK -->
                <div class="fc-hero-answer-block greek-hero">
                    <div class="fc-hero-answer-badge">🎯 Grekçe Karşılık</div>
                    <div class="fc-hero-greek-word">
                        ${nounInfo?.article ? `<span class="word-article fc-article">${nounInfo.article}</span> ` : ''}
                        <span>${item.word}</span>
                        ${nounInfo?.gender ? `<span class="badge-gender fc-gender-badge badge-gender-${nounInfo.genderClass}" title="${nounInfo.genderTitle}">${nounInfo.gender}</span>` : ''}
                    </div>
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
        this.renderBanner();
    }

    renderBanner() {
        const bannerContainer = this.container.querySelector('#fc-batch-banner-container');
        if (!bannerContainer) return;

        if (this.deckMode !== 'batch' || !this.currentDeck || this.currentDeck.length === 0) {
            bannerContainer.innerHTML = '';
            return;
        }

        const isLastCard = (this.currentIndex === this.currentDeck.length - 1);
        if (!isLastCard) {
            bannerContainer.innerHTML = '';
            return;
        }

        const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
        const totalBatches = Math.max(1, Math.ceil(poolWords.length / 10));
        const batchStats = this.getCurrentBatchStats();
        const isLastBatch = (this.batchIndex >= totalBatches - 1);

        if (!isLastBatch) {
            bannerContainer.innerHTML = `
                <div class="fc-batch-complete-toast">
                    <div class="fc-toast-content">
                        <span class="fc-toast-icon">🎉</span>
                        <div class="fc-toast-texts">
                            <strong class="fc-toast-title">Grup ${this.batchIndex + 1} sonundasınız!</strong>
                            <span class="fc-toast-desc">${batchStats.learned}/${batchStats.total} kelime öğrenildi (%${batchStats.percent})</span>
                        </div>
                    </div>
                    <button type="button" class="btn-scholarly btn-sm btn-primary fc-toast-next-btn" id="fc-banner-next-batch" title="Grup ${this.batchIndex + 2}'ye geç">
                        Sonraki Gruba Geç (Grup ${this.batchIndex + 2}) ▶
                    </button>
                </div>
            `;
        } else {
            const subStats = this.getCurrentSubCategoryStats();
            bannerContainer.innerHTML = `
                <div class="fc-batch-complete-toast fc-toast-finished">
                    <div class="fc-toast-content">
                        <span class="fc-toast-icon">🏆</span>
                        <div class="fc-toast-texts">
                            <strong class="fc-toast-title">Tebrikler! Bu bölümdeki tüm grupları tamamladınız!</strong>
                            <span class="fc-toast-desc">Bu grup: ${batchStats.learned}/${batchStats.total} • Genel durum: %${subStats.percent} (${subStats.learned}/${subStats.total} kelime)</span>
                        </div>
                    </div>
                    <div class="fc-toast-actions">
                        <button type="button" class="btn-scholarly btn-sm btn-outline fc-toast-review-btn" id="fc-banner-review-batch" title="Öğrenilmeyen kelimeleri tekrar et">
                            ⏳ Bilmediklerimi Tekrar Et ▶
                        </button>
                        <button type="button" class="btn-scholarly btn-sm btn-primary fc-toast-first-btn" id="fc-banner-first-batch" title="1. Gruba geri dön">
                            🔄 Grup 1'e Dön
                        </button>
                    </div>
                </div>
            `;
        }
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

    changeCard(newIndex) {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        if (this.isTransitioning) return;

        const card = this.container.querySelector('#fc-card');

        if (this.isFlipped) {
            // Card is currently flipped showing the previous answer!
            this.isTransitioning = true;
            this.isFlipped = false;
            
            // 1. Immediately initiate turning back to the front face
            if (card) {
                card.classList.remove('is-flipped');
            }

            // 2. Wait 210ms until the card is perpendicular/edge-on (90 deg)
            // Neither front nor back is visible at this exact moment.
            // Swap content now so the user never sees the next card's answer!
            setTimeout(() => {
                this.currentIndex = newIndex;
                this.renderCard();
                this.isTransitioning = false;
            }, 210);
        } else {
            // Card is already showing front face: smooth tactile switch
            this.isTransitioning = true;
            if (card) {
                card.classList.add('fc-card-switching');
            }
            setTimeout(() => {
                this.currentIndex = newIndex;
                this.renderCard();
                if (card) {
                    card.classList.remove('fc-card-switching');
                }
                this.isTransitioning = false;
            }, 80);
        }
    }

    next() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        const newIndex = (this.currentIndex < this.currentDeck.length - 1) ? this.currentIndex + 1 : 0;
        this.changeCard(newIndex);
    }

    prev() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        const newIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.currentDeck.length - 1;
        this.changeCard(newIndex);
    }

    markCurrentLearned() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        if (this.isTransitioning) return;
        const item = this.currentDeck[this.currentIndex];
        this.setWordStatus(item.id, 'learned');
        this.updateProgressUI();
        this.next();
    }

    markCurrentUnlearned() {
        if (!this.currentDeck || this.currentDeck.length === 0) return;
        if (this.isTransitioning) return;
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
        const mainNameEl = this.container.querySelector('.fc-deck-main-name');
        const subNameEl = this.container.querySelector('.fc-deck-sub-name');
        const detailEl = this.container.querySelector('.fc-deck-trigger-detail');

        if (percentEl) percentEl.textContent = `%${currentPercent}`;
        if (fillEl) fillEl.style.width = `${currentPercent}%`;
        if (mainNameEl) mainNameEl.textContent = this.getMainCategoryLabel();
        if (subNameEl) subNameEl.textContent = this.getSubCategoryLabel();
        if (detailEl) detailEl.textContent = this.getDeckModeDetailLabel();

        const quickSubEl = this.container.querySelector('.fc-quick-step-sub');
        if (quickSubEl && this.deckMode === 'batch') {
            const start = this.batchIndex * 10;
            const end = Math.min(start + 10, poolWords.length);
            quickSubEl.textContent = `${start + 1}–${end} (${batchStats.learned}/10)`;
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
            setTimeout(() => {
                drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 60);
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

            // Main scope source cards (inside Drawer)
            const sourceCard = e.target.closest('#fc-main-pills .fc-source-card, #fc-main-pills .fc-pill');
            if (sourceCard) {
                const mainCat = sourceCard.dataset.main;
                if (mainCat && mainCat !== this.mainCategory) {
                    this.mainCategory = mainCat;
                    this.subCategory = 'all';
                    this.deckMode = 'batch';
                    this.batchIndex = 0;
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                    this.toggleDrawer(true);
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
                    this.toggleDrawer(true);
                }
                return;
            }

            // Mode selection tabs (10'arlı Gruplar VS Akıllı Havuzlar)
            const modeTab = e.target.closest('.fc-mode-tab');
            if (modeTab) {
                const tabCat = modeTab.dataset.deckCategory;
                if (tabCat === 'batch') {
                    this.deckMode = 'batch';
                } else if (tabCat === 'smart') {
                    if (this.deckMode === 'batch') {
                        this.deckMode = 'unknown'; // default to unknown
                    }
                }
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                this.toggleDrawer(true);
                return;
            }

            // Quick Group Stepper: Prev Group (on control strip)
            if (e.target.closest('#fc-quick-prev-btn')) {
                if (this.batchIndex > 0) {
                    this.batchIndex--;
                    this.deckMode = 'batch';
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                }
                return;
            }

            // Quick Group Stepper & Banner: Next Group
            if (e.target.closest('#fc-quick-next-btn') || e.target.closest('#fc-banner-next-batch')) {
                const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
                const totalBatches = Math.max(1, Math.ceil(poolWords.length / 10));
                if (this.batchIndex < totalBatches - 1) {
                    this.batchIndex++;
                    this.deckMode = 'batch';
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                }
                return;
            }

            // Quick Group Stepper: Center label clicks open drawer
            if (e.target.closest('#fc-quick-step-center')) {
                this.toggleDrawer();
                return;
            }

            // Completion Banner: Review unlearned
            if (e.target.closest('#fc-banner-review-batch')) {
                this.deckMode = 'unknown';
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                return;
            }

            // Completion Banner: Return to group 1
            if (e.target.closest('#fc-banner-first-batch')) {
                this.batchIndex = 0;
                this.deckMode = 'batch';
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                return;
            }

            // Batch Stepper: Prev Batch (inside drawer)
            if (e.target.closest('#fc-batch-prev-btn')) {
                if (this.batchIndex > 0) {
                    this.batchIndex--;
                    this.deckMode = 'batch';
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                    this.toggleDrawer(true);
                }
                return;
            }

            // Batch Stepper: Next Batch
            if (e.target.closest('#fc-batch-next-btn')) {
                const poolWords = this.getSubCategoryWords(this.mainCategory, this.subCategory);
                const totalBatches = Math.max(1, Math.ceil(poolWords.length / 10));
                if (this.batchIndex < totalBatches - 1) {
                    this.batchIndex++;
                    this.deckMode = 'batch';
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                    this.toggleDrawer(true);
                }
                return;
            }

            // Quick Batch Chip click
            const quickChip = e.target.closest('.fc-quick-chip');
            if (quickChip) {
                const batchIdx = parseInt(quickChip.dataset.batch, 10) || 0;
                this.deckMode = 'batch';
                this.batchIndex = batchIdx;
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                this.toggleDrawer(true);
                return;
            }

            // Smart deck card click
            const smartCard = e.target.closest('.fc-smart-card, .fc-smart-deck-btn');
            if (smartCard) {
                const mode = smartCard.dataset.mode;
                if (mode) {
                    this.deckMode = mode;
                    this.currentIndex = 0;
                    this.savePreferences();
                    this.buildActiveDeck();
                    this.render();
                    this.toggleDrawer(false); // smoothly apply and return to cards
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

        // Batch select change listener
        this.container.addEventListener('change', (e) => {
            if (e.target && e.target.id === 'fc-batch-select') {
                const batchIdx = parseInt(e.target.value, 10) || 0;
                this.deckMode = 'batch';
                this.batchIndex = batchIdx;
                this.currentIndex = 0;
                this.savePreferences();
                this.buildActiveDeck();
                this.render();
                this.toggleDrawer(true);
            }
        });

        // Close reset menu when clicking outside anywhere on document
        document.addEventListener('click', (e) => {
            const resetMenu = this.container?.querySelector('#fc-reset-menu');
            if (resetMenu && !resetMenu.classList.contains('hidden') && !e.target.closest('.fc-drawer-reset-area') && !e.target.closest('.fc-reset-btn-wrapper')) {
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
