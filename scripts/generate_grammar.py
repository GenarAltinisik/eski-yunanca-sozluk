# -*- coding: utf-8 -*-
"""
Full dataset generator for Genar's Ancient Greek Dictionary.
Generates:
1. data/alphabet.js
2. data/grammar_tables.js
3. data/dictionary.js
"""
import json

# --- 1. ALPHABET & PHONETICS DATA ---
alphabet_data = [
    {"upper": "Α", "lower": "α", "name_gr": "ἄλφα", "name_tr": "Alfa", "ipa": "/a/, /aː/", "sound_desc": "Kısa veya uzun 'a' sesi", "erasmian": "a (baba gibi)", "classical": "kısa [a] veya uzun [aː]", "value": 1, "example": "ἀνήρ (anēr - adam)"},
    {"upper": "Β", "lower": "β", "name_gr": "βῆτα", "name_tr": "Beta", "ipa": "/b/ (Klasik), /v/ (Modern)", "sound_desc": "Klasik dönemde sert 'b' sesi", "erasmian": "b (balık gibi)", "classical": "[b]", "value": 2, "example": "βίος (bios - yaşam)"},
    {"upper": "Γ", "lower": "γ", "name_gr": "γάμμα", "name_tr": "Gamma", "ipa": "/ɡ/, [ŋ] (nazal)", "sound_desc": "Sert 'g' sesi; γ, κ, ξ, χ öncesinde 'n' sesi (nazal gamma)", "erasmian": "g veya ng", "classical": "[ɡ] (angelos: ἄγγελος)", "value": 3, "example": "γῆ (gē - toprak/yer)"},
    {"upper": "Δ", "lower": "δ", "name_gr": "δέλτα", "name_tr": "Delta", "ipa": "/d/", "sound_desc": "Sert 'd' sesi", "erasmian": "d (dağ gibi)", "classical": "[d]", "value": 4, "example": "δίκη (dikē - adalet)"},
    {"upper": "Ε", "lower": "ε", "name_gr": "ἒ ψιλόν", "name_tr": "Epsilon", "ipa": "/e/", "sound_desc": "Daima kısa, kapalı 'e' sesi (yalın e)", "erasmian": "kısa e", "classical": "[e] (kısa)", "value": 5, "example": "ἔργον (ergon - iş/eser)"},
    {"upper": "Ζ", "lower": "ζ", "name_gr": "ζῆτα", "name_tr": "Zeta", "ipa": "/zd/ veya /dz/", "sound_desc": "'zd' veya çift 'z' birleşik sesi", "erasmian": "z (veya dz/zd)", "classical": "[zd] (Attika), [dz]", "value": 7, "example": "ζωή (zōē - can/hayat)"},
    {"upper": "Η", "lower": "η", "name_gr": "ἦτα", "name_tr": "Eta", "ipa": "/ɛː/", "sound_desc": "Daima uzun, açık 'e' sesi (uzun ê)", "erasmian": "uzun açık e (Fr. fête)", "classical": "[ɛː] (uzun e)", "value": 8, "example": "ἥλιος (hēlios - güneş)"},
    {"upper": "Θ", "lower": "θ", "name_gr": "θῆτα", "name_tr": "Theta", "ipa": "/tʰ/", "sound_desc": "Soluklu 't' sesi (t + h hava üflemesi)", "erasmian": "İngilizce 'th' (think)", "classical": "soluklu [tʰ] (aspirated t)", "value": 9, "example": "θεός (theos - tanrı)"},
    {"upper": "Ι", "lower": "ι", "name_gr": "ἰῶτα", "name_tr": "Iota", "ipa": "/i/, /iː/", "sound_desc": "Kısa veya uzun 'i' sesi; diftonglarda ve harf altında yer alır", "erasmian": "i (iplik gibi)", "classical": "kısa [i] veya uzun [iː]", "value": 10, "example": "ἰδέα (idea - fikir/form)"},
    {"upper": "Κ", "lower": "κ", "name_gr": "κάππα", "name_tr": "Kappa", "ipa": "/k/", "sound_desc": "Soluksuz sert 'k' sesi", "erasmian": "k (kale gibi)", "classical": "[k] (soluksuz)", "value": 20, "example": "καλός (kalos - güzel/iyi)"},
    {"upper": "Λ", "lower": "λ", "name_gr": "λάμβδα", "name_tr": "Lambda", "ipa": "/l/", "sound_desc": "'l' sesi", "erasmian": "l (lale gibi)", "classical": "[l]", "value": 30, "example": "λόγος (logos - akıl/söz)"},
    {"upper": "Μ", "lower": "μ", "name_gr": "μῦ", "name_tr": "Mü (Mu)", "ipa": "/m/", "sound_desc": "'m' sesi", "erasmian": "m (masa gibi)", "classical": "[m]", "value": 40, "example": "μῦθος (mythos - söylence/öykü)"},
    {"upper": "Ν", "lower": "ν", "name_gr": "νῦ", "name_tr": "Nü (Nu)", "ipa": "/n/", "sound_desc": "'n' sesi", "erasmian": "n (nar gibi)", "classical": "[n]", "value": 50, "example": "νόμος (nomos - yasa/töre)"},
    {"upper": "Ξ", "lower": "ξ", "name_gr": "ξῖ", "name_tr": "Ksi (Xi)", "ipa": "/ks/", "sound_desc": "'ks' birleşik sesi (Latin 'x')", "erasmian": "ks (taksi gibi)", "classical": "[ks]", "value": 60, "example": "ξένος (xenos - yabancı/misafir)"},
    {"upper": "Ο", "lower": "ο", "name_gr": "ὂ μικρόν", "name_tr": "Omikron", "ipa": "/o/", "sound_desc": "Daima kısa, kapalı 'o' sesi (küçük o)", "erasmian": "kısa o (okul gibi)", "classical": "[o] (kısa)", "value": 70, "example": "ὄνομα (onoma - isim/ad)"},
    {"upper": "Π", "lower": "π", "name_gr": "πῖ", "name_tr": "Pi", "ipa": "/p/", "sound_desc": "Soluksuz sert 'p' sesi", "erasmian": "p (para gibi)", "classical": "[p] (soluksuz)", "value": 80, "example": "πόλις (polis - şehir/kent)"},
    {"upper": "Ρ", "lower": "ρ", "name_gr": "ῥῶ", "name_tr": "Rho", "ipa": "/r/, /r̥/ (soluklu)", "sound_desc": "Dilli 'r' sesi; kelime başında daima solukludur (ῥ - rh)", "erasmian": "r (rulo gibi)", "classical": "titrek [r], başta soluklu [r̥]", "value": 100, "example": "ῥήτωρ (rhētōr - hatip)"},
    {"upper": "Σ", "lower": "σ / ς", "name_gr": "σῖγμα", "name_tr": "Sigma", "ipa": "/s/", "sound_desc": "'s' sesi; kelime sonunda 'ς' (final sigma), diğer yerlerde 'σ' yazılır", "erasmian": "s (su gibi)", "classical": "[s]", "value": 200, "example": "σοφία (sophia - bilgelik)"},
    {"upper": "Τ", "lower": "τ", "name_gr": "ταῦ", "name_tr": "Tau", "ipa": "/t/", "sound_desc": "Soluksuz sert 't' sesi", "erasmian": "t (top gibi)", "classical": "[t] (soluksuz)", "value": 300, "example": "τέχνη (technē - zanaat/sanat)"},
    {"upper": "Υ", "lower": "υ", "name_gr": "ὖ ψιλόν", "name_tr": "Üpsilon", "ipa": "/y/, /yː/", "sound_desc": "Fransızca 'u' veya Almanca 'ü' sesi (yalın u)", "erasmian": "ü (gül gibi)", "classical": "kısa [y] veya uzun [yː]", "value": 400, "example": "ὕδωρ (hydōr - su)"},
    {"upper": "Φ", "lower": "φ", "name_gr": "φῖ", "name_tr": "Fi (Phi)", "ipa": "/pʰ/", "sound_desc": "Soluklu 'p' sesi (p + h patlaması); Modern Yunancada 'f' olmuştur", "erasmian": "f sesi (veya ph)", "classical": "soluklu [pʰ] (aspirated p)", "value": 500, "example": "φύσις (physis - doğa)"},
    {"upper": "Χ", "lower": "χ", "name_gr": "χῖ", "name_tr": "Hi (Chi)", "ipa": "/kʰ/", "sound_desc": "Soluklu 'k' sesi (k + h); Almanca 'Bach' gibi boğazdan hırıltılı", "erasmian": "hırıltılı h (Alm. ach)", "classical": "soluklu [kʰ] (aspirated k)", "value": 600, "example": "χρόνος (chronos - zaman)"},
    {"upper": "Ψ", "lower": "ψ", "name_gr": "ψῖ", "name_tr": "Psi", "ipa": "/ps/", "sound_desc": "'ps' birleşik sesi", "erasmian": "ps (psikoloji gibi)", "classical": "[ps]", "value": 700, "example": "ψυχή (psychē - ruh/nefes)"},
    {"upper": "Ω", "lower": "ω", "name_gr": "ὦ μέγα", "name_tr": "Omega", "ipa": "/ɔː/", "sound_desc": "Daima uzun, açık 'o' sesi (büyük o)", "erasmian": "uzun açık o", "classical": "[ɔː] (uzun o)", "value": 800, "example": "ὥρα (hōra - saat/mevsim)"}
]

diacritics_data = [
    {
        "symbol": "῾",
        "name_gr": "δασὺ πνεῦμα (Spiritus Asper)",
        "name_tr": "Sert (Keskin) Soluk",
        "desc": "Kelime başındaki ünlülerin veya 'ρ' harfinin üzerine gelir. Harfin başına bir 'h' sesi ekler.",
        "examples": "ἵππος (hippos = at), ἥλιος (hēlios = güneş), ῥήτωρ (rhētōr = hatip)"
    },
    {
        "symbol": "᾿",
        "name_gr": "ψιλὸν πνεῦμα (Spiritus Lenis)",
        "name_tr": "Yumuşak Soluk",
        "desc": "Kelime başındaki ünlünün 'h' sesi olmadan, yalın ve pürüzsüz okunduğunu gösterir.",
        "examples": "ἀνήρ (anēr = adam), ἄνθρωπος (anthrōpos = insan)"
    },
    {
        "symbol": "´",
        "name_gr": "ὀξεῖα (Akut Vurgu)",
        "name_tr": "Tiz (Yükselen) Vurgu",
        "desc": "Eski Yunancada perdenin yükseldiğini gösterirdi. Son üç hecenin herhangi birinde bulunabilir.",
        "examples": "λόγος (lógos), θεός (theós), ἄνθρωπος (ánthrōpos)"
    },
    {
        "symbol": "`",
        "name_gr": "βαρεῖα (Gravis Vurgu)",
        "name_tr": "Pes (Düşen) Vurgu",
        "desc": "Cümle içinde ardışık kelimelerin son hecesindeki akut vurgunun yerini alır (perde düşüşü).",
        "examples": "τὸν ἀγαθὸν ἄνθρωπον (ton agathon anthrōpon)"
    },
    {
        "symbol": "῀ (͂)",
        "name_gr": "περισπωμένη (Sirkümfleks)",
        "name_tr": "Dalgalı Vurgu (Tiz-Pes)",
        "desc": "Sadece doğası gereği uzun ünlüler veya diftonglar üzerinde yer alır; yükselip alçalan melodik tonu belirtir.",
        "examples": "σῶμα (sôma = beden), ψυχῆς (psychês = ruhun)"
    },
    {
        "symbol": "ͺ (ᾳ, ῃ, ῳ)",
        "name_gr": "ὑπογεγραμμένη (Iota Subscript)",
        "name_tr": "Alt Iota",
        "desc": "Uzun ünlüler (α, η, ω) altına yazılan küçük iota'dır. Klasik dönemde zamanla telaffuzu kaybolmuş ama gramerde korunmuştur.",
        "examples": "τῇ σοφίᾳ (têi sophíāi = bilgeliğe, dativ hali)"
    },
    {
        "symbol": "¨",
        "name_gr": "διαλυτικά (Trema / Dialytika)",
        "name_tr": "Ayırma İşareti (Trema)",
        "desc": "İki ardışık ünlünün bir diftong oluşturmayıp ayrı ayrı hecelendiğini gösterir.",
        "examples": "Ἀχαΐα (A-cha-i-a), πρωΐ (prō-i = sabah)"
    }
]

diphthongs_data = [
    {"greek": "αι", "translit": "ai", "sound": "ay (ayna gibi)", "example": "καί (kai - ve)"},
    {"greek": "ει", "translit": "ei", "sound": "ey veya kapalı uzun e [eː]", "example": "εἰμί (eimi - olmak/benim)"},
    {"greek": "οι", "translit": "oi", "sound": "oy (oyun gibi)", "example": "οἶκος (oikos - ev)"},
    {"greek": "υι", "translit": "ui", "sound": "üy (üzerine i)", "example": "υἱός (huios - oğul)"},
    {"greek": "αυ", "translit": "au", "sound": "aw / av (havlu gibi)", "example": "αὐτός (autos - kendi/o)"},
    {"greek": "ευ", "translit": "eu", "sound": "ew / ev", "example": "εὖ (eu - iyi/güzel)"},
    {"greek": "ηυ", "translit": "ēu", "sound": "uzun e + u", "example": "ηὔξανον (ēuxanon)"},
    {"greek": "ου", "translit": "ou", "sound": "uzun u [uː] (kurt gibi)", "example": "οὐρανός (ouranos - gök)"}
]

# Write alphabet.js
alphabet_js = f"""// Ancient Greek Alphabet, Phonetics, and Diacritics
window.GREEK_ALPHABET = {json.dumps(alphabet_data, ensure_ascii=False, indent=2)};
window.GREEK_DIACRITICS = {json.dumps(diacritics_data, ensure_ascii=False, indent=2)};
window.GREEK_DIPHTHONGS = {json.dumps(diphthongs_data, ensure_ascii=False, indent=2)};
"""

with open("data/alphabet.js", "w", encoding="utf-8") as f:
    f.write(alphabet_js)
print("data/alphabet.js written.")

# --- 2. GRAMMAR TABLES ---
grammar_tables = {
    "article": {
        "title": "Belirteç Çekimi (ὁ, ἡ, τό - The Definite Article)",
        "description": "Eski Yunancada harf-i tarif (artikeller) isimlerin cinsiyetine (eril, dişil, nötr), büküm haline ve sayısına göre çekimlenir.",
        "cases": ["Nominativ (Yalın)", "Genitiv (-in / Tamlayan)", "Dativ (-e, -de, -ile)", "Accusativ (-i / Belirtme)"],
        "singular": {
            "masculine": ["ὁ", "τοῦ", "τῷ", "τόν"],
            "feminine": ["ἡ", "τῆς", "τῇ", "τήν"],
            "neuter": ["τό", "τοῦ", "τῷ", "τό"]
        },
        "plural": {
            "masculine": ["οἱ", "τῶν", "τοῖς", "τούς"],
            "feminine": ["αἱ", "τῶν", "ταῖς", "τάς"],
            "neuter": ["τά", "τῶν", "τοῖς", "τά"]
        },
        "dual": {
            "nom_acc": ["τώ", "τώ (veya τά)", "τώ"],
            "gen_dat": ["τοῖν", "τοῖν (veya ταῖν)", "τοῖν"]
        }
    },
    "declension_2": {
        "title": "İkinci Çekim: Eril ve Nötr İsimler (-ος, -ον)",
        "description": "Tematik isim çekimi (o-stem). Eski Yunancanın en yaygın isim grubudur. Örnek: λόγος (söz/akıl, eril) ve δῶρον (hediye, nötr).",
        "cases": ["Nominativ (Yalın)", "Genitiv (-in)", "Dativ (-e/ile)", "Accusativ (-i)", "Vocativ (Hitap)"],
        "logos_masc": {
            "name": "λόγος, -ου, ὁ (akıl/söz - Eril)",
            "singular": ["λόγος", "λόγου", "λόγῳ", "λόγον", "λόγε"],
            "plural": ["λόγοι", "λόγων", "λόγοις", "λόγους", "λόγοι"]
        },
        "doron_neut": {
            "name": "δῶρον, -ου, τό (hediye/armağan - Nötr)",
            "singular": ["δῶρον", "δῶρου", "δῶρῳ", "δῶρον", "δῶρον"],
            "plural": ["δῶρα", "δῶρων", "δῶροις", "δῶρα", "δῶρα"]
        }
    },
    "declension_1": {
        "title": "Birinci Çekim: Dişil İsimler (-ᾱ, -η, -ᾰ)",
        "description": "A-gövdesi (a-stem) çekimi. Genellikle dişil isimleri kapsar. Kök sonuna göre saf alfa (α), eta (η) veya karışık alfa alır.",
        "cases": ["Nominativ (Yalın)", "Genitiv (-in)", "Dativ (-e/ile)", "Accusativ (-i)", "Vocativ (Hitap)"],
        "khora_pure_alpha": {
            "name": "χώρα, -ας, ἡ (ülke/toprak - Saf Alfa)",
            "singular": ["χώρᾱ", "χώρᾱς", "χώρᾳ", "χώρᾱν", "χώρᾱ"],
            "plural": ["χῶραι", "χωρῶν", "χώραις", "χώρᾱς", "χῶραι"]
        },
        "tekhne_eta": {
            "name": "τέχνη, -ης, ἡ (sanat/zanaat - Eta)",
            "singular": ["τέχνη", "τέχνης", "τέχνῃ", "τέχνην", "τέχνη"],
            "plural": ["τέχναι", "τεχνῶν", "τέχναις", "τέχνᾱς", "τέχναι"]
        }
    },
    "declension_3": {
        "title": "Üçüncü Çekim: Ünsüz ve Kapalı Gövdeler",
        "description": "Atematik çekim (ünsüz, i, u gövdeleri). Kelimenin gerçek gövdesi genitiv halinde ortaya çıkar. Örnek: φύλαξ (muhafız, gövde: φυλακ-).",
        "cases": ["Nominativ (Yalın)", "Genitiv (-in)", "Dativ (-e/ile)", "Accusativ (-i)", "Vocativ (Hitap)"],
        "phylax_consonant": {
            "name": "φύλαξ, φύλακος, ὁ (muhafız/nöbetçi)",
            "singular": ["φύλαξ", "φύλακος", "φύλακι", "φύλακα", "φύλαξ"],
            "plural": ["φύλακες", "φυλάκων", "φύλαξι(ν)", "φύλακας", "φύλακες"]
        },
        "soma_neuter": {
            "name": "σῶμα, σώματος, τό (beden/gövde - Nötr)",
            "singular": ["σῶμα", "σώματος", "σώματι", "σῶμα", "σῶμα"],
            "plural": ["σώματα", "σωμάτων", "σώμασι(ν)", "σώματα", "σώματα"]
        }
    },
    "verb_luo": {
        "title": "Düzenli Fiil Çekimi: λύω (çözmek, serbest bırakmak)",
        "description": "Eski Yunancada fiiller Şahıs (1, 2, 3), Sayı (Tekil, Çoğul, İkil), Zaman (Present, Imperfect, Future, Aorist, Perfect, Pluperfect), Çatı (Aktif, Medial, Pasif) ve Kip (Bildirme/İndikativ, İstek/Konjunktiv, Dilek/Optativ, Emir/İmperativ) gösterir.",
        "present_indicative": {
            "title": "Şimdiki Zaman Bildirme Kipi (Praesens Indicativus)",
            "persons": ["1. Tekil (Ben)", "2. Tekil (Sen)", "3. Tekil (O)", "1. Çoğul (Biz)", "2. Çoğul (Siz)", "3. Çoğul (Onlar)"],
            "active": ["λύω (çözüyorum)", "λύεις (çözüyorsun)", "λύει (çözüyor)", "λύομεν (çözüyoruz)", "λύετε (çözüyorsunuz)", "λύουσι(ν) (çözüyorlar)"],
            "middle_passive": ["λύομαι (çözülüyorum / kendimi çözüyorum)", "λύῃ / λύει", "λύεται", "λυόμεθα", "λύεσθε", "λύονται"]
        },
        "future_indicative": {
            "title": "Gelecek Zaman (Futurum)",
            "active": ["λύσω (çözeceğim)", "λύσεις", "λύσει", "λύσομεν", "λύσετε", "λύσουσι(ν)"]
        },
        "aorist_indicative": {
            "title": "Aorist (Geçmiş Zaman / Noktasal)",
            "active": ["ἔλυσα (çözdüm)", "ἔλυσας", "ἔλυσε(ν)", "ἐλύσαμεν", "ἐλύσατε", "ἔλυσαν"]
        }
    },
    "verb_eimi": {
        "title": "Düzensiz Yardımcı Fiil: εἰμί (olmak - to be)",
        "description": "Eski Yunancada en sık kullanılan düzensiz fiildir. Enklitiktir (vurgusunu genelde önündeki kelimeye aktarır).",
        "present": [
            {"person": "1. Tekil (Ben)", "form": "εἰμί", "translit": "eimi", "meaning": "...-ım / varım"},
            {"person": "2. Tekil (Sen)", "form": "εἶ", "translit": "ei", "meaning": "...-sın"},
            {"person": "3. Tekil (O)", "form": "ἐστί(ν)", "translit": "esti(n)", "meaning": "...-dır / vardır"},
            {"person": "1. Çoğul (Biz)", "form": "ἐσμέν", "translit": "esmen", "meaning": "...-ız"},
            {"person": "2. Çoğul (Siz)", "form": "ἐστέ", "translit": "este", "meaning": "...-sınız"},
            {"person": "3. Çoğul (Onlar)", "form": "εἰσί(ν)", "translit": "eisi(n)", "meaning": "...-dırlar"}
        ],
        "imperfect": [
            {"person": "1. Tekil", "form": "ἦ / ἦν", "meaning": "idim"},
            {"person": "2. Tekil", "form": "ἦσθα", "meaning": "idin"},
            {"person": "3. Tekil", "form": "ἦν", "meaning": "idi"},
            {"person": "1. Çoğul", "form": "ἦμεν", "meaning": "idik"},
            {"person": "2. Çoğul", "form": "ἦτε / ἦστε", "meaning": "idiniz"},
            {"person": "3. Çoğul", "form": "ἦσαν", "meaning": "idiler"}
        ]
    },
    "pronouns": {
        "title": "Şahıs Zamirleri (Personal Pronouns)",
        "first_person": {
            "singular": {"nom": "ἐγώ (ben)", "gen": "ἐμοῦ / μου (benim)", "dat": "ἐμοί / μοι (bana)", "acc": "ἐμέ / με (beni)"},
            "plural": {"nom": "ἡμεῖς (biz)", "gen": "ἡμῶν (bizim)", "dat": "ἡμῖν (bize)", "acc": "ἡμᾶς (bizi)"}
        },
        "second_person": {
            "singular": {"nom": "σύ (sen)", "gen": "σοῦ / σου (senin)", "dat": "σοί / σοι (sana)", "acc": "σέ / σε (seni)"},
            "plural": {"nom": "ὑμεῖς (siz)", "gen": "ὑμῶν (sizin)", "dat": "ὑμῖν (size)", "acc": "ὑμᾶς (sizi)"}
        },
        "third_person_autos": {
            "title": "αὐτός, αὐτή, αὐτό (o / kendisi)",
            "desc": "3. şahıs zamiri ve 'kendi' (intensive) anlamında kullanılır."
        }
    }
}

grammar_js = f"""// Ancient Greek Grammar & Declension Tables
window.GREEK_GRAMMAR = {json.dumps(grammar_tables, ensure_ascii=False, indent=2)};
"""

with open("data/grammar_tables.js", "w", encoding="utf-8") as f:
    f.write(grammar_js)
print("data/grammar_tables.js written.")
