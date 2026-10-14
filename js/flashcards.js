/**
 * Ancient Greek Flashcards Learning System
 * Interactive spaced learning with 3D flip card animations
 */

class FlashcardTrainer {
    constructor(deck, containerSelector) {
        this.fullDeck = [...deck];
        this.currentDeck = [...deck];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.learnedCount = 0;
        this.container = document.querySelector(containerSelector);
        this.init();
    }

    init() {
        if (!this.container) return;
        this.shuffle();
        this.render();
        this.bindEvents();
    }

    shuffle() {
        for (let i = this.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentDeck[i], this.currentDeck[j]] = [this.currentDeck[j], this.currentDeck[i]];
        }
        this.currentIndex = 0;
        this.isFlipped = false;
    }

    filterCategory(category) {
        if (!category || category === 'all') {
            this.currentDeck = [...this.fullDeck];
        } else if (category === 'athenaze') {
            this.currentDeck = this.fullDeck.filter(item => item.isAthenaze === true || (item.tags && item.tags.includes('athenaze')));
        } else if (category === 'emel_hoca') {
            this.currentDeck = this.fullDeck.filter(item => item.isEmelHoca === true || (item.tags && item.tags.includes('emel_hoca')));
        } else {
            this.currentDeck = this.fullDeck.filter(item => item.category === category);
        }
        this.shuffle();
        this.renderCard();
    }

    render() {
        this.container.innerHTML = `
            <div class="flashcards-wrapper">
                <div class="flashcards-toolbar">
                    <div class="fc-filter-group">
                        <label for="fc-category-select">Kategori:</label>
                        <select id="fc-category-select" class="scholarly-select">
                            <option value="all">Tüm Kelimeler (${this.fullDeck.length})</option>
                            <option value="athenaze">📚 Athenaze: Book I (1α – 3β)</option>
                            <option value="emel_hoca">🌸 Emel Hoca'nın Seçtikleri</option>
                            <option value="Felsefe">Felsefe & Düşünce</option>
                            <option value="Politika & Toplum">Politika & Toplum</option>
                            <option value="Tarım & Doğa">Tarım & Doğa</option>
                            <option value="Doğa & Bilim">Doğa & Bilim</option>
                            <option value="Mitoloji & İnanç">Mitoloji & İnanç</option>
                            <option value="Temel Fiiller">Temel Fiiller</option>
                            <option value="Günlük Yaşam">Günlük Yaşam</option>
                            <option value="Zarflar & Edatlar">Zarflar & Edatlar</option>
                        </select>
                    </div>

                    <div class="fc-counter">
                        <span id="fc-progress-text">1 / ${this.currentDeck.length}</span>
                        <span class="fc-learned-badge" id="fc-learned-badge">🏆 Öğrenilen: 0</span>
                    </div>

                    <div class="fc-actions">
                        <button type="button" class="btn-scholarly btn-sm" id="fc-shuffle-btn" title="Kartları Karıştır">🔀 Karıştır</button>
                    </div>
                </div>

                <div class="fc-card-scene" id="fc-card-scene">
                    <div class="fc-card" id="fc-card">
                        <!-- Front Face -->
                        <div class="fc-card-face fc-card-front">
                            <div class="fc-hint">Kelime Kartı (Çevirmek için tıkla)</div>
                            <div class="fc-greek-word" id="fc-greek-word">λόγος</div>
                            <div class="fc-translit" id="fc-translit">lógos</div>
                            <div class="fc-lemma" id="fc-lemma">λόγος, -ου, ὁ</div>
                            <div class="fc-meta" id="fc-meta">
                                <span class="badge" id="fc-pos">İsim (Eril)</span>
                                <span class="badge badge-accent" id="fc-category">Felsefe</span>
                            </div>
                            <button type="button" class="btn-audio-round" id="fc-audio-btn" title="Telaffuz Dinle">🔊</button>
                        </div>

                        <!-- Back Face -->
                        <div class="fc-card-face fc-card-back">
                            <div class="fc-back-title" id="fc-back-title">λόγος (lógos)</div>
                            <div class="fc-section">
                                <span class="fc-label">Türkçe Anlamlar:</span>
                                <ul class="fc-meanings-list" id="fc-meanings-tr"></ul>
                            </div>
                            <div class="fc-section">
                                <span class="fc-label">İngilizce (LSJ):</span>
                                <p class="fc-meanings-en" id="fc-meanings-en"></p>
                            </div>
                            <div class="fc-section etymology-section" id="fc-etymology-box">
                                <span class="fc-label">Etimoloji:</span>
                                <p class="fc-etymology" id="fc-etymology"></p>
                            </div>
                            <div class="fc-quote-box" id="fc-quote-box">
                                <span class="fc-quote-greek" id="fc-quote-greek"></span>
                                <span class="fc-quote-tr" id="fc-quote-tr"></span>
                                <span class="fc-quote-author" id="fc-quote-author"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="fc-navigation">
                    <button type="button" class="btn-scholarly" id="fc-prev-btn">◀ Önceki</button>
                    <button type="button" class="btn-scholarly btn-repeat" id="fc-repeat-btn">🔄 Tekrar Et</button>
                    <button type="button" class="btn-scholarly btn-success" id="fc-know-btn">✓ Biliyorum</button>
                    <button type="button" class="btn-scholarly" id="fc-next-btn">Sonraki ▶</button>
                </div>
            </div>
        `;
        this.renderCard();
    }

    renderCard() {
        if (!this.currentDeck || this.currentDeck.length === 0) {
            this.container.querySelector('#fc-greek-word').textContent = 'Kelime bulunamadı';
            return;
        }

        const item = this.currentDeck[this.currentIndex];
        const card = this.container.querySelector('#fc-card');
        
        // Reset flip
        this.isFlipped = false;
        card.classList.remove('is-flipped');

        // Front
        this.container.querySelector('#fc-greek-word').textContent = item.word;
        this.container.querySelector('#fc-translit').textContent = item.transliteration || item.word;
        this.container.querySelector('#fc-lemma').textContent = item.lemma || item.word;
        this.container.querySelector('#fc-pos').textContent = item.partOfSpeech || 'Kelime';
        this.container.querySelector('#fc-category').textContent = item.category || 'Genel';

        // Back
        this.container.querySelector('#fc-back-title').textContent = `${item.word} (${item.transliteration || ''})`;
        
        // TR meanings
        const trList = this.container.querySelector('#fc-meanings-tr');
        trList.innerHTML = (item.meanings_tr || []).map(m => `<li>${m}</li>`).join('');

        // EN meanings
        this.container.querySelector('#fc-meanings-en').textContent = (item.meanings_en || []).join('; ');

        // Etymology
        const etymBox = this.container.querySelector('#fc-etymology-box');
        if (item.etymology) {
            etymBox.style.display = 'block';
            this.container.querySelector('#fc-etymology').textContent = item.etymology;
        } else {
            etymBox.style.display = 'none';
        }

        // Quote
        const quoteBox = this.container.querySelector('#fc-quote-box');
        if (item.examples && item.examples.length > 0) {
            quoteBox.style.display = 'block';
            const ex = item.examples[0];
            this.container.querySelector('#fc-quote-greek').textContent = `"${ex.greek}"`;
            this.container.querySelector('#fc-quote-tr').textContent = ex.tr;
            this.container.querySelector('#fc-quote-author').textContent = `— ${ex.author || ''} ${ex.work ? '(' + ex.work + ')' : ''}`;
        } else {
            quoteBox.style.display = 'none';
        }

        // Progress text
        this.container.querySelector('#fc-progress-text').textContent = `${this.currentIndex + 1} / ${this.currentDeck.length}`;
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        this.container.querySelector('#fc-card').classList.toggle('is-flipped', this.isFlipped);
    }

    next() {
        if (this.currentIndex < this.currentDeck.length - 1) {
            this.currentIndex++;
            this.renderCard();
        } else {
            this.currentIndex = 0;
            this.renderCard();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
        } else {
            this.currentIndex = this.currentDeck.length - 1;
            this.renderCard();
        }
    }

    markLearned() {
        this.learnedCount++;
        this.container.querySelector('#fc-learned-badge').textContent = `🏆 Öğrenilen: ${this.learnedCount}`;
        // Remove current card from deck if desired or move forward
        this.next();
    }

    bindEvents() {
        const cardScene = this.container.querySelector('#fc-card-scene');
        cardScene.addEventListener('click', (e) => {
            if (e.target.closest('#fc-audio-btn')) return;
            this.flip();
        });

        this.container.querySelector('#fc-audio-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const word = this.currentDeck[this.currentIndex]?.word;
            if (word && window.GreekUtils) {
                window.GreekUtils.speak(word);
            }
        });

        this.container.querySelector('#fc-prev-btn').addEventListener('click', () => this.prev());
        this.container.querySelector('#fc-next-btn').addEventListener('click', () => this.next());
        this.container.querySelector('#fc-know-btn').addEventListener('click', () => this.markLearned());
        this.container.querySelector('#fc-repeat-btn').addEventListener('click', () => this.next());

        this.container.querySelector('#fc-shuffle-btn').addEventListener('click', () => {
            this.shuffle();
            this.renderCard();
        });

        this.container.querySelector('#fc-category-select').addEventListener('change', (e) => {
            this.filterCategory(e.target.value);
        });

        // Keyboard arrow navigation
        window.addEventListener('keydown', (e) => {
            if (document.querySelector('#view-flashcards')?.classList.contains('active-tab-content')) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.flip();
                } else if (e.code === 'ArrowRight') {
                    this.next();
                } else if (e.code === 'ArrowLeft') {
                    this.prev();
                }
            }
        });
    }
}

window.FlashcardTrainer = FlashcardTrainer;
