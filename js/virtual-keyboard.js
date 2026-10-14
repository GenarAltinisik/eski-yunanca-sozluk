/**
 * Ancient Greek Polytonic Virtual Keyboard
 * Supports standard Greek layout and diacritic modifiers
 */

class GreekKeyboard {
    constructor(targetInputSelector) {
        this.targetInput = document.querySelector(targetInputSelector);
        this.isOpen = false;
        this.isShift = false;
        this.activeDiacritic = null;
        this.container = null;
        this.init();
    }

    init() {
        this.createKeyboardDOM();
        this.bindEvents();
    }

    createKeyboardDOM() {
        const div = document.createElement('div');
        div.id = 'greek-virtual-keyboard';
        div.className = 'virtual-keyboard hidden';
        div.innerHTML = `
            <div class="keyboard-header">
                <div class="keyboard-title">
                    <span class="greek-font">Ἑλληνικὸν Πληκτρολόγιον</span>
                    <span class="sub-title">Eski Yunanca Sanal Klavye & Vurgular</span>
                </div>
                <div class="keyboard-actions">
                    <button type="button" class="kb-close-btn" id="kb-close-btn" title="Klavyeyi Kapat">✕</button>
                </div>
            </div>
            
            <div class="diacritics-bar">
                <span class="diacritics-label">Soluk & Vurgular:</span>
                <button type="button" class="kb-key diacritic-key" data-char="᾿" title="Yumuşak Soluk (Psili)">᾿</button>
                <button type="button" class="kb-key diacritic-key" data-char="῾" title="Sert Soluk (Dasia - h)">῾</button>
                <button type="button" class="kb-key diacritic-key" data-char="´" title="Tiz Vurgu (Akut / Oxeia)">´</button>
                <button type="button" class="kb-key diacritic-key" data-char="\`" title="Pes Vurgu (Gravis / Varia)">\`</button>
                <button type="button" class="kb-key diacritic-key" data-char="῀" title="Dalgalı Vurgu (Sirkümfleks)">῀</button>
                <button type="button" class="kb-key diacritic-key" data-char="ͅ" title="Alt Iota (Iota Subscript)">ͺ</button>
                <button type="button" class="kb-key diacritic-key" data-char="¨" title="Ayırma İşareti (Trema)">¨</button>
            </div>

            <div class="keyboard-keys" id="kb-keys-container">
                <!-- Rows will be rendered dynamically -->
            </div>

            <div class="keyboard-bottom-row">
                <button type="button" class="kb-key action-key" id="kb-shift" title="Büyük/Küçük Harf">⇧ Shift</button>
                <button type="button" class="kb-key space-key" data-char=" " title="Boşluk">Boşluk (Space)</button>
                <button type="button" class="kb-key action-key" id="kb-backspace" title="Sil">⌫ Geri Sil</button>
                <button type="button" class="kb-key action-key clear-key" id="kb-clear" title="Tümünü Temizle">Temizle</button>
            </div>
        `;
        document.body.appendChild(div);
        this.container = div;
        this.renderKeys();
    }

    renderKeys() {
        const rows = [
            [';', 'ς', 'ε', 'ρ', 'τ', 'υ', 'θ', 'ι', 'ο', 'π'],
            ['α', 'σ', 'δ', 'φ', 'γ', 'η', 'ξ', 'κ', 'λ'],
            ['ζ', 'χ', 'ψ', 'ω', 'β', 'ν', 'μ']
        ];

        const container = this.container.querySelector('#kb-keys-container');
        container.innerHTML = '';

        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(char => {
                const displayChar = this.isShift ? char.toUpperCase() : char;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'kb-key letter-key';
                btn.textContent = displayChar;
                btn.dataset.char = displayChar;
                rowDiv.appendChild(btn);
            });
            container.appendChild(rowDiv);
        });
    }

    bindEvents() {
        // Close button
        this.container.querySelector('#kb-close-btn').addEventListener('click', () => {
            this.toggle(false);
        });

        // Key click
        this.container.addEventListener('click', (e) => {
            const keyBtn = e.target.closest('.kb-key');
            if (!keyBtn) return;

            const char = keyBtn.dataset.char;
            if (char) {
                this.insertChar(char);
            }
        });

        // Shift toggle
        this.container.querySelector('#kb-shift').addEventListener('click', () => {
            this.isShift = !this.isShift;
            this.container.querySelector('#kb-shift').classList.toggle('active', this.isShift);
            this.renderKeys();
        });

        // Backspace
        this.container.querySelector('#kb-backspace').addEventListener('click', () => {
            this.handleBackspace();
        });

        // Clear
        this.container.querySelector('#kb-clear').addEventListener('click', () => {
            if (this.targetInput) {
                this.targetInput.value = '';
                this.targetInput.focus();
                this.targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    insertChar(char) {
        if (!this.targetInput) return;
        const input = this.targetInput;
        const start = input.selectionStart || input.value.length;
        const end = input.selectionEnd || input.value.length;
        const val = input.value;

        input.value = val.substring(0, start) + char + val.substring(end);
        input.selectionStart = input.selectionEnd = start + char.length;
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    handleBackspace() {
        if (!this.targetInput) return;
        const input = this.targetInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;

        if (start === 0 && end === 0) return;

        if (start === end) {
            input.value = val.substring(0, start - 1) + val.substring(end);
            input.selectionStart = input.selectionEnd = start - 1;
        } else {
            input.value = val.substring(0, start) + val.substring(end);
            input.selectionStart = input.selectionEnd = start;
        }
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    toggle(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        if (this.isOpen) {
            this.container.classList.remove('hidden');
            if (this.targetInput) this.targetInput.focus();
        } else {
            this.container.classList.add('hidden');
        }
    }
}

window.GreekKeyboard = GreekKeyboard;
