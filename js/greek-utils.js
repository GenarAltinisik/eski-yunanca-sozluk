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
    },

    /**
     * Get noun metadata: definite article and grammatical gender
     * Returns { isNoun, article, gender, genderClass, genderTitle } or null if not a noun
     */
    getNounInfo(item) {
        if (!item) return null;
        const pos = item.partOfSpeech || '';
        const cat = item.category || '';
        
        // Check if item represents a noun or substantivized noun
        const isNoun = pos.includes('İsim') || cat.includes('İsim') || pos.includes('Özel İsim');
        if (!isNoun) return null;

        const fullText = (pos + ' ' + (item.grammar?.declension || '') + ' ' + (item.lemma || '')).toLowerCase();

        // 1. Determine gender: 'M' (Masculinum), 'F' (Femininum), 'N' (Neutrum), 'M/F' (Common)
        let gender = null;
        let genderClass = '';
        let genderTitle = '';

        if (fullText.includes('ortak') || fullText.includes('eril / dişil') || fullText.includes('eril/dişil') || 
            (item.lemma && (item.lemma.includes('ὁ / ἡ') || item.lemma.includes('ὁ/ἡ')))) {
            gender = 'M/F';
            genderClass = 'mf';
            genderTitle = 'Ortak Cinsiyet (Masculinum & Femininum)';
        } else if (fullText.includes('nötr') || fullText.includes('notr') || fullText.includes('neuter') || 
                   (item.lemma && (item.lemma.includes(' τό') || item.lemma.includes(', τό') || item.lemma.includes('τὸ ')))) {
            gender = 'N';
            genderClass = 'n';
            genderTitle = 'Nötr (Neutrum)';
        } else if (fullText.includes('eril') || fullText.includes('masculine') || 
                   (item.lemma && (item.lemma.endsWith(' ὁ') || item.lemma.includes(', ὁ') || item.lemma.includes('ὁ ')))) {
            gender = 'M';
            genderClass = 'm';
            genderTitle = 'Eril (Masculinum)';
        } else if (fullText.includes('dişil') || fullText.includes('disil') || fullText.includes('feminine') || 
                   (item.lemma && (item.lemma.endsWith(' ἡ') || item.lemma.includes(', ἡ') || item.lemma.includes('ἡ ')))) {
            gender = 'F';
            genderClass = 'f';
            genderTitle = 'Dişil (Femininum)';
        }

        // Fallbacks for special entries
        if (!gender) {
            if (item.word === 'βάρβαρος') { gender = 'M/F'; genderClass = 'mf'; genderTitle = 'Ortak Cinsiyet (Masculinum & Femininum)'; }
            else if (item.word === 'Ἀθηναῖος') { gender = 'M'; genderClass = 'm'; genderTitle = 'Eril (Masculinum)'; }
            else if (item.word === 'αἰθήρ') { gender = 'M/F'; genderClass = 'mf'; genderTitle = 'Ortak Cinsiyet (Masculinum & Femininum)'; }
        }

        // 2. Determine definite article
        let article = null;
        const lemma = item.lemma || '';

        // Check if lemma starts with article
        const leadMatch = lemma.match(/^(ὁ\s*\/\s*ἡ|ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)\s+/);
        if (leadMatch) {
            article = leadMatch[1].replace('τὸ', 'τό').replace('τὰ', 'τά').trim();
        } else {
            // Check if lemma ends with comma article or slash article
            const endMatch = lemma.match(/,\s*(ὁ\s*\/\s*ἡ|ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)(\s*\(.*?\))?$/) ||
                             lemma.match(/\/\s*(ὁ\s*\/\s*ἡ|ὁ|ἡ|τό|τὸ|οἱ|αἱ|τά|τὰ)\s+[\wἀ-ῼ]+/);
            if (endMatch) {
                article = endMatch[1].replace('τὸ', 'τό').replace('τὰ', 'τά').trim();
            }
        }

        // Fallback article based on gender & plural
        if (!article) {
            const isPlural = fullText.includes('çoğul') || fullText.includes('plural');
            if (gender === 'M') article = isPlural ? 'οἱ' : 'ὁ';
            else if (gender === 'F') article = isPlural ? 'αἱ' : 'ἡ';
            else if (gender === 'N') article = isPlural ? 'τά' : 'τό';
            else if (gender === 'M/F') article = 'ὁ / ἡ';
        }

        return {
            isNoun: true,
            article,
            gender,
            genderClass,
            genderTitle
        };
    }
};

// Expose globally
window.GreekUtils = GreekUtils;
