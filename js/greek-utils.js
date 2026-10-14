/**
 * Greek Language Utilities
 * Diacritics Normalization, Beta Code Conversion, Transliteration, Phonetics
 */

const GreekUtils = {
    // Mapping for Beta Code letters
    betaCodeMap: {
        'a': 'α', 'b': 'β', 'g': 'γ', 'd': 'δ', 'e': 'ε',
        'z': 'ζ', 'h': 'η', 'q': 'θ', 'i': 'ι', 'k': 'κ',
        'l': 'λ', 'm': 'μ', 'n': 'ν', 'c': 'ξ', 'o': 'ο',
        'p': 'π', 'r': 'ῥ', 's': 'σ', 't': 'τ', 'u': 'υ',
        'f': 'φ', 'x': 'χ', 'y': 'ψ', 'w': 'ω',
        'A': 'Α', 'B': 'Β', 'G': 'Γ', 'D': 'Δ', 'E': 'Ε',
        'Z': 'Ζ', 'H': 'Η', 'Q': 'Θ', 'I': 'Ι', 'K': 'Κ',
        'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'C': 'Ξ', 'O': 'Ο',
        'P': 'Π', 'R': 'Ῥ', 'S': 'Σ', 'T': 'Τ', 'U': 'Υ',
        'F': 'Φ', 'X': 'Χ', 'Y': 'Ψ', 'W': 'Ω'
    },

    /**
     * Remove all polytonic diacritics and normalize Greek characters
     * 'λόγος' -> 'λογος', 'ἄνθρωπος' -> 'ανθρωπος'
     * Also converts final sigma ς to σ
     */
    normalizeGreek(str) {
        if (!str) return '';
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '')
            .toLowerCase()
            .replace(/ς/g, 'σ')
            .trim();
    },

    /**
     * Convert Greek to simple search-friendly Latin (without accents)
     * e.g. 'λόγος' -> 'logos', 'ἄνθρωπος' -> 'anthropos', 'ψυχή' -> 'psyche'
     */
    toLatinSearchKey(str) {
        if (!str) return '';
        const norm = this.normalizeGreek(str);
        const latinMap = {
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e',
            'ζ': 'z', 'η': 'e', 'θ': 'th', 'ι': 'i', 'κ': 'k',
            'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o',
            'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'u',
            'φ': 'ph', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o'
        };

        let result = '';
        for (let i = 0; i < norm.length; i++) {
            const ch = norm[i];
            // Handle gamma combinations: γγ -> ng, γκ -> nk, γξ -> nx, γχ -> nch
            if (ch === 'γ' && i + 1 < norm.length) {
                const next = norm[i + 1];
                if (next === 'γ' || next === 'κ' || next === 'ξ' || next === 'χ') {
                    result += 'n';
                    continue;
                }
            }
            result += latinMap[ch] || ch;
        }
        return result.toLowerCase();
    },

    /**
     * Convert basic Beta Code input into Polytonic Greek Unicode
     * Example: 'lo/gos' -> 'λόγος', 'a)/nqrwpos' -> 'ἄνθρωπος'
     */
    betaCodeToGreek(input) {
        if (!input) return '';
        let s = input;

        // Common multi-char beta code combinations
        const precomposed = {
            "a)": "ἀ", "a(": "ἁ", "a/": "ά", "a\\": "ὰ", "a=": "ᾶ",
            "a)/": "ἄ", "a(\\ ": "ἃ", "a)/|": "ᾄ", "a)|": "ᾀ", "a(|": "ᾁ",
            "e)": "ἐ", "e(": "ἑ", "e/": "έ", "e\\": "ὲ", "e)/": "ἔ", "e(\\": "ἓ",
            "h)": "ἠ", "h(": "ἡ", "h/": "ή", "h\\": "ὴ", "h=": "ῆ", "h)/": "ἤ", "h)=/": "ἦ",
            "i)": "ἰ", "i(": "ἱ", "i/": "ί", "i\\": "ὶ", "i=": "ῖ", "i)/": "ἴ", "i(=/": "ἷ",
            "o)": "ὀ", "o(": "ὁ", "o/": "ό", "o\\": "ὸ", "o)/": "ὄ", "o(\\": "ὃ",
            "u)": "ὐ", "u(": "ὑ", "u/": "ύ", "u\\": "ὺ", "u=": "ῦ", "u)/": "ὔ", "u(=/": "ὗ",
            "w)": "ὠ", "w(": "ὡ", "w/": "ώ", "w\\": "ὼ", "w=": "ῶ", "w)/": "ὤ", "w(=/": "ὦ",
            "r(": "ῥ"
        };

        // Replace complex clusters first
        for (const [code, gr] of Object.entries(precomposed)) {
            s = s.split(code).join(gr);
        }

        // Single letters
        let out = '';
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (this.betaCodeMap[ch]) {
                // If it's a sigma, check if it's final
                if (ch === 's' || ch === 'S') {
                    const next = s[i + 1];
                    if (!next || !/[a-zA-Z\u0370-\u03ff\u1f00-\u1fff]/.test(next)) {
                        out += 'ς';
                    } else {
                        out += 'σ';
                    }
                } else {
                    out += this.betaCodeMap[ch];
                }
            } else {
                out += ch;
            }
        }
        return out;
    },

    /**
     * Accurate polytonic transliteration for display
     */
    transliterate(str) {
        if (!str) return '';
        // If already has transliteration property in entry, we use that;
        // otherwise a fallback translator:
        return this.toLatinSearchKey(str);
    },

    /**
     * Web Speech API Speech Synthesis for Ancient/Modern Greek
     */
    speak(text) {
        if (!('speechSynthesis' in window)) {
            alert('Tarayıcınız ses sentezini (Web Speech API) desteklemiyor.');
            return;
        }

        window.speechSynthesis.cancel(); // Stop any pending speech

        // Clean diacritics for smoother TTS reading
        const cleanText = text.replace(/[,;·.]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'el-GR'; // Greek language code
        utterance.rate = 0.85;    // Slower speed for educational pronunciation
        utterance.pitch = 1.0;

        // Try to pick a Greek voice if installed on system
        const voices = window.speechSynthesis.getVoices();
        const greekVoice = voices.find(v => v.lang.includes('el') || v.lang.includes('GR'));
        if (greekVoice) {
            utterance.voice = greekVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
};

// Expose globally
window.GreekUtils = GreekUtils;
