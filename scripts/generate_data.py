# -*- coding: utf-8 -*-
"""
Generate comprehensive Ancient Greek dictionary dataset and grammar references.
"""
import json

alphabet_data = [
    {"upper": "Α", "lower": "α", "name_gr": "ἄλφα", "name_tr": "Alfa", "ipa": "/a/, /aː/", "sound_desc": "Kısa veya uzun 'a' sesi", "erasmian": "a (baba gibi)", "classical": "kısa [a] veya uzun [aː]", "value": 1, "example": "ἀνήρ (anēr - adam)"},
    {"upper": "Β", "lower": "β", "name_gr": "βῆτα", "name_tr": "Beta", "ipa": "/b/ (Klasik), /v/ (Modern)", "sound_desc": "Klasik dönemde sert 'b' sesi", "erasmian": "b (balık gibi)", "classical": "[b]", "value": 2, "example": "βίος (bios - yaşam)"},
    {"upper": "Γ", "lower": "γ", "name_gr": "γάμμα", "name_tr": "Gamma", "ipa": "/ɡ/, [ŋ] (nazal)", "sound_desc": "Sert 'g' sesi; γ, κ, ξ, χ öncesinde 'n' sesi (nazal gamma)", "erasmian": "g veya ng", "classical": "[ɡ] (angelos: ἄγγελος)", "value": 3, "example": "γῆ (gē - toprak/yer)"},
    {"upper": "Δ", "lower": "δ", "name_gr": "δέλτα", "name_tr": "Delta", "ipa": "/d/", "sound_desc": "Sert 'd' sesi", "erasmian": "d (dağ gibi)", "classical": "[d]", "value": 4, "example": "δίκη (dikē - adalet)"},
    {"upper": "Ε", "lower": "ε", "name_gr": "ἒ ψιλόν", "name_tr": "Epsilon", "ipa": "/e/", "sound_desc": "Daima kısa, kapalı 'e' sesi (yalın e)", "erasmian": "kısa e", "classical": "[e] (kısa)", "value": 5, "example": "ἔργον (ergon - iş/eser)"},
    {"upper": "Ζ", "lower": "ζ", "name_gr": "ζῆτα", "name_tr": "Zeta", "ipa": "/zd/ veya /dz/", "sound_desc": "'zd' veya çift 'z' birleşik sesi", "erasmian": "z (veya dz/zd)", "classical": "[zd] (Attika), [dz]", "value": 7, "example": "ζωή (zōē - can/hayat)"},
    {"upper": "Η", "lower": "η", "name_gr": "ἦτα", "name_tr": "Eta", "ipa": "/ɛː/", "sound_desc": "Daima uzun, açık 'e' sesi (uzun ê)", "erasmian": "uzun açık e (Fr. fête)", "classical": "[ɛː] (uzun e)", "value": 8, "example": "ἥλιος (hēlios - güneş)"},
    {"upper": "Θ", "lower": "θ", "name_gr": "θῆτα", "name_tr": "Theta", "ipa": "/tʰ/", "sound_desc": "Soluklu 't' sesi (t + h hava üflemesi)", "erasmian": "İngilizce 'th' (think)", "classical": "soluklu [tʰ] (aspirated t)", "value": 9, "example": "θεός (theos - tanrı)"},
    {"upper": "Ι", "lower": "ι", "name_gr": "ἰῶτα", "name_tr": "Iota", "ipa": "/i/, /iː/", "sound_desc": "Kısa veya uzun 'i' sesi; diftonglarda ve harf altında (subscript) yer alır", "erasmian": "i (iplik gibi)", "classical": "kısa [i] veya uzun [iː]", "value": 10, "example": "ἰδέα (idea - fikir/form)"},
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
        "desc": "Eski Yunancada perdenin (pitch) yükseldiğini gösterirdi. Son üç hecenin herhangi birinde bulunabilir.",
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

print("Alphabet and diacritics prepared.")
