# -*- coding: utf-8 -*-
"""
Complete and robust integration of all 86 Emel Hoca vocabulary items into data/dictionary.js
"""
import json
import re
import sys
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load clean dictionary.js
with open('data/dictionary.js', 'r', encoding='utf-8') as f:
    c = f.read()

prefix = 'window.ANCIENT_GREEK_DICTIONARY = '
start_idx = c.find(prefix) + len(prefix)
end_idx = c.rfind(';')
dict_list = json.loads(c[start_idx:end_idx].strip())

print(f"Loaded existing dictionary with {len(dict_list)} entries.")

def norm_greek(s):
    if not s:
        return ''
    n = unicodedata.normalize('NFD', s)
    n = ''.join(ch for ch in n if unicodedata.category(ch) != 'Mn')
    return n.lower().replace('ς', 'σ').replace('῾', '').replace('᾿', '').strip()

dict_by_norm = {}
for item in dict_list:
    key = norm_greek(item['word'])
    dict_by_norm[key] = item

# 2. Detailed new entries for Emel Hoca words
# Each entry is scholarly, enriched with LSJ English, Turkish nuances, etymology, modern derivatives, and classical examples.
new_entries_db = {
    "ἄμπελος": {
        "id": "emel_ampelos",
        "word": "ἄμπελος",
        "lemma": "ἡ ἄμπελος, -ου",
        "transliteration": "ámpelos",
        "partOfSpeech": "İsim (Dişil, 2. Çekim İstisna)",
        "category": "Tarım & Doğa",
        "frequency": 3,
        "meanings_tr": [
            "Bağ, asma, üzüm bağı (2. çekim istisnai dişil isim)",
            "Üzüm kütüğü"
        ],
        "meanings_en": ["vine, grapevine, vineyard"],
        "etymology": "Ön-Grekçe (Pre-Greek) Akdeniz alt katman kökenli kelime.",
        "derivatives": ["ampelografi (asma ve üzüm çeşitlerini inceleyen bilim dalı)"],
        "grammar": {
            "nominative": "ἡ ἄμπελος",
            "genitive": "τῆς ἀμπέλου",
            "dative": "τῇ ἀμπέλῳ",
            "accusative": "τὴν ἄμπελον",
            "vocative": "ὦ ἄμπελε",
            "nom_pl": "αἱ ἄμπελοι",
            "gen_pl": "τῶν ἀμπέλων",
            "dat_pl": "ταῖς ἀμπέλοις",
            "acc_pl": "τὰς ἀμπέλους"
        },
        "examples": [
            {"greek": "καλὴ ἡ ἄμπελος ἐν τῷ ἀγρῷ.", "tr": "Tarladaki üzüm bağı güzeldir.", "author": "Klasik Örnek"}
        ],
        "emel_notes": "2. çekim (-ος ile biten) istisnai DİŞİL isim örneğidir. Cinsiyetine dikkat edilmelidir."
    },
    "βίβλος": {
        "id": "emel_biblos",
        "word": "βίβλος",
        "lemma": "ἡ βίβλος, -ου",
        "transliteration": "bíblos",
        "partOfSpeech": "İsim (Dişil, 2. Çekim İstisna)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Kitap, papirüs rulosu, yazma eser (2. çekim dişil istisna)",
            "Papirüs bitkisinin iç kabuğu"
        ],
        "meanings_en": ["book, scroll, papyrus bark"],
        "etymology": "Fenike liman kenti Byblos'tan (papirüs ticaret merkezi).",
        "derivatives": ["Bible (Kutsal Kitap), bibliyografi, bibliyofil, kütüphanecilik"],
        "grammar": {
            "nominative": "ἡ βίβλος",
            "genitive": "τῆς βίβλου",
            "dative": "τῇ βίβλῳ",
            "accusative": "τὴν βίβλον",
            "vocative": "ὦ βίβλε",
            "nom_pl": "αἱ βίβλοι",
            "gen_pl": "τῶν βίβλων",
            "dat_pl": "ταῖς βίβλοις",
            "acc_pl": "τὰς βίβλους"
        },
        "examples": [
            {"greek": "ἡ τῶν σοφῶν βίβλος.", "tr": "Bilgelerin kitabı.", "author": "Klasik Metin"}
        ],
        "emel_notes": "2. çekim dişil istisnasıdır (-ος ile biter ama artikeli ἡ'dir). 'Kitap' anlamındadır."
    },
    "βουλή": {
        "id": "emel_boule",
        "word": "βουλή",
        "lemma": "ἡ βουλή, βουλῆς",
        "transliteration": "boulḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "İrade, kararlılık, azim, niyet",
            "Konsey, meclis, senato (Atina 500'ler Meclisi - Boule)",
            "Danışma, istişare, öğüt"
        ],
        "meanings_en": ["will, determination, counsel, council (Boule of Athens)"],
        "etymology": "βούλομαι (istemek, irade göstermek) fiilinden türetilmiştir.",
        "derivatives": ["abuli (irade felci/yitimi)"],
        "grammar": {
            "nominative": "ἡ βουλή",
            "genitive": "τῆς βουλῆς",
            "dative": "τῇ βουλῇ",
            "accusative": "τὴν βουλήν",
            "vocative": "ὦ βουλή",
            "nom_pl": "αἱ βουλαί",
            "gen_pl": "τῶν βουλῶν",
            "dat_pl": "ταῖς βουλαῖς",
            "acc_pl": "τὰς βουλάς"
        },
        "examples": [
            {"greek": "ἔδοξε τῇ βουλῇ καὶ τῷ δήμῳ.", "tr": "Meclis ve halk böyle uygun gördü (Atina resmi ferman formülü).", "author": "Atina Kitabeleri"}
        ],
        "emel_notes": "1. çekim dişil isimdir. Hem bireysel 'irade/karar' hem de siyasi 'Meclis/Konsey' anlamına gelir."
    },
    "γαῖα": {
        "id": "emel_gaia",
        "word": "γαῖα",
        "lemma": "ἡ γαῖα, -ας (-ης)",
        "transliteration": "gaîa",
        "partOfSpeech": "İsim (Dişil, Şiirsel/Epik)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": [
            "Ülke, yeryüzü, toprak (γῆ kelimesinin şiirsel ve epik Homeros formu)",
            "Gaia (Yeryüzü/Toprak Ana tanrıçası)"
        ],
        "meanings_en": ["earth, land, country (poetic epic form of gē)"],
        "etymology": "Ön-Grekçe Ege alt katman kökeni.",
        "derivatives": ["Gaia hipotezi (biyosferin kendi kendini düzenleyen bir organizma olduğu teorisi)"],
        "examples": [
            {"greek": "Γαῖα δέ τοι πρῶτον μὲν ἐγείνατο ἶσον ἑωυτῇ Οὐρανόν.", "tr": "Gaia ilk olarak kendisine denk Uranos'u doğurdu.", "author": "Hesiodos", "work": "Theogonia"}
        ],
        "emel_notes": "γῆ kelimesinin şiirsel ve mitolojik formudur; Toprak ve Yeryüzü anlamına gelir."
    },
    "γνώμη": {
        "id": "emel_gnome",
        "word": "γνώμη",
        "lemma": "ἡ γνώμη, γνώμης",
        "transliteration": "gnṓmē",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Felsefe",
        "frequency": 4,
        "meanings_tr": [
            "Düşünce, görüş, kanaat, fikir",
            "Akıl, sağduyu, basiret, muhakeme",
            "Özdeyiş, vecize, aforizma (gnomik söz)"
        ],
        "meanings_en": ["thought, opinion, judgment, maxim, mind"],
        "etymology": "γιγνώσκω (bilmek, tanımak) kökünden (Hint-Avrupa *ǵneh₃-).",
        "derivatives": ["gnomik şiir, agnozi (tıpta algı yitimi)"],
        "grammar": {
            "nominative": "ἡ γνώμη",
            "genitive": "τῆς γνώμης",
            "dative": "τῇ γνώμῃ",
            "accusative": "τὴν γνώμην",
            "vocative": "ὦ γνώμη",
            "nom_pl": "αἱ γνῶμαι",
            "gen_pl": "τῶν γνωμῶν",
            "dat_pl": "ταῖς γνώμαις",
            "acc_pl": "τὰς γνώμας"
        },
        "examples": [
            {"greek": "γνώμῃ κρατεῖν.", "tr": "Akıl ve sağduyu ile üstün gelmek.", "author": "Thukydides"}
        ],
        "emel_notes": "1. çekim dişil isim. Felsefi metinlerde 'görüş, kanaat, akıl' olarak sık geçer."
    },
    "ἐκκλησία": {
        "id": "emel_ekklesia",
        "word": "ἐκκλησία",
        "lemma": "ἡ ἐκκλησία, -ας",
        "transliteration": "ekklēsía",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Halk meclisi, yurttaşlar toplantısı (Antik Atina'da tüm vatandaşların meclisi - Ekklesia)",
            "Topluluk, cemaat",
            "Kilise (Geç Grekçe / Hristiyanlık dönemi)"
        ],
        "meanings_en": ["assembly of citizens (Ekklesia of Athens), gathering, church"],
        "etymology": "ἐκκαλέω (dışarı çağırmak, toplantıya çağırmak) fiilinden: ἐκ + καλέω.",
        "derivatives": ["eklesiyastik (kilise ve meclisle ilgili), Fransızca église, İspanyolca iglesia"],
        "grammar": {
            "nominative": "ἡ ἐκκλησία",
            "genitive": "τῆς ἐκκλησίας",
            "dative": "τῇ ἐκκλησίᾳ",
            "accusative": "τὴν ἐκκλησίαν",
            "vocative": "ὦ ἐκκλησία",
            "nom_pl": "αἱ ἐκκλησίαι",
            "gen_pl": "τῶν ἐκκλησιῶν",
            "dat_pl": "ταῖς ἐκκλησίαις",
            "acc_pl": "τὰς ἐκκλησίας"
        },
        "examples": [
            {"greek": "οἱ Ἀθηναῖοι εἰς τὴν ἐκκλησίαν συνέρχονται.", "tr": "Atinalılar halk meclisinde toplanırlar.", "author": "Klasik Atina"}
        ],
        "emel_notes": "Antik Atina'da doğrudan demokrasinin kalbi olan Yurttaşlar Halk Meclisi'dir."
    },
    "ἐπιστολή": {
        "id": "emel_epistole",
        "word": "ἐπιστολή",
        "lemma": "ἡ ἐπιστολή, -ῆς",
        "transliteration": "epistolḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Mektup, yazılı haber, tebligat, risale",
            "Haber, mesaj"
        ],
        "meanings_en": ["letter, message, epistle, dispatch"],
        "etymology": "ἐπιστέλλω (birine mesaj göndermek, emretmek) fiilinden: ἐπί + στέλλω.",
        "derivatives": ["epistolary (mektup tarzı roman/yazı), epistemoloji ile karıştırılmamalıdır"],
        "grammar": {
            "nominative": "ἡ ἐπιστολή",
            "genitive": "τῆς ἐπιστολῆς",
            "dative": "τῇ ἐπιστολῇ",
            "accusative": "τὴν ἐπιστολήν",
            "vocative": "ὦ ἐπιστολή",
            "nom_pl": "αἱ ἐπιστολαί",
            "gen_pl": "τῶν ἐπιστολῶν",
            "dat_pl": "ταῖς ἐπιστολαῖς",
            "acc_pl": "τὰς ἐπιστολάς"
        },
        "examples": [
            {"greek": "γράφω ἐπιστολὴν τῷ φίλῳ.", "tr": "Arkadaşıma mektup yazıyorum.", "author": "Ders Cümlesi"}
        ],
        "emel_notes": "1. çekim dişil (-ή ile biten) isim. 'Mektup, haber' demektir."
    },
    "ἡδονή": {
        "id": "emel_hedone",
        "word": "ἡδονή",
        "lemma": "ἡ ἡδονή, ἡδονῆς",
        "transliteration": "hēdonḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Felsefe",
        "frequency": 4,
        "meanings_tr": [
            "Haz, zevk, lezzet",
            "Tatmin, hoşnutluk, mutluluk hissi"
        ],
        "meanings_en": ["pleasure, delight, enjoyment"],
        "etymology": "ἡδύς (tatlı, hoş) sıfatından (Hint-Avrupa *swéh₂d-us; krş. İngilizce sweet, Latince suavis).",
        "derivatives": ["hedonizm (hazcılık felsefesi), hedonist, anhedoni (haz alamama hastalığı)"],
        "grammar": {
            "nominative": "ἡ ἡδονή",
            "genitive": "τῆς ἡδονῆς",
            "dative": "τῇ ἡδονῇ",
            "accusative": "τὴν ἡδονήν",
            "vocative": "ὦ ἡδονή",
            "nom_pl": "αἱ ἡδοναί",
            "gen_pl": "τῶν ἡδονῶν",
            "dat_pl": "ταῖς ἡδοναῖς",
            "acc_pl": "τὰς ἡδονάς"
        },
        "examples": [
            {"greek": "τὴν ἡδονὴν ἀρχὴν καὶ τέλος λέγομεν εἶναι τοῦ μακαρίως ζῆν.", "tr": "Hazzın mutlu bir yaşamın başlangıcı ve sonu (amacı) olduğunu söyleriz.", "author": "Epikouros", "work": "Menoikeus'a Mektup"}
        ],
        "emel_notes": "Epiküros ve Kyrene felsefesinde merkezi kavram: 'Haz, zevk'."
    },
    "κόρη": {
        "id": "emel_kore",
        "word": "κόρη",
        "lemma": "ἡ κόρη, κόρης",
        "transliteration": "kórē",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 4,
        "meanings_tr": [
            "Kız çocuk, genç kız, bakire kadın",
            "Gelin",
            "Kore heykeli (Arkaik dönem genç kadın heykelleri)",
            "Persephone'nin unvanı (Kore)"
        ],
        "meanings_en": ["girl, maiden, daughter, Kore statue"],
        "etymology": "Kökü belirsiz Arkaik Grekçe kelime (krş. Mycenaean ko-wa).",
        "derivatives": ["Kore heykelleri (antik sanat tarihi)"],
        "grammar": {
            "nominative": "ἡ κόρη",
            "genitive": "τῆς κόρης",
            "dative": "τῇ κόρῃ",
            "accusative": "τὴν κόρην",
            "vocative": "ὦ κόρη",
            "nom_pl": "αἱ κόραι",
            "gen_pl": "τῶν κορῶν",
            "dat_pl": "ταῖς κόραις",
            "acc_pl": "τὰς κόρας"
        },
        "examples": [
            {"greek": "καλὴ ἡ κόρη.", "tr": "Genç kız güzeldir.", "author": "Klasik Örnek"}
        ],
        "emel_notes": "1. çekim dişil isim. Hem 'genç kız' hem de mitolojide Persephone'ye verilen addır."
    },
    "κώμη": {
        "id": "emel_kome",
        "word": "κώμη",
        "lemma": "ἡ κώμη, κώμης",
        "transliteration": "kṓmē",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Tarım & Doğa",
        "frequency": 3,
        "meanings_tr": [
            "Köy, sursuz kır yerleşimi, kasaba",
            "Mahalle"
        ],
        "meanings_en": ["country town, village (unwalled)"],
        "etymology": "Hint-Avrupa *ḱwoy-mh₂ (yerleşim yeri; krş. Gotça haims, İngilizce home).",
        "derivatives": ["komedi (κωμῳδία: köy şarkısı / şenliği kökenli)"],
        "grammar": {
            "nominative": "ἡ κώμη",
            "genitive": "τῆς κώμης",
            "dative": "τῇ κώμῃ",
            "accusative": "τὴν κώμην",
            "vocative": "ὦ κώμη",
            "nom_pl": "αἱ κῶμαι",
            "gen_pl": "τῶν κωμῶν",
            "dat_pl": "ταῖς κώμαις",
            "acc_pl": "τὰς κώμας"
        },
        "examples": [
            {"greek": "οἱ γεωργοὶ ἐν τῇ κώμῃ οἰκοῦσιν.", "tr": "Çiftçiler köyde otururlar.", "author": "Klasik Örnek"}
        ],
        "emel_notes": "Polis (kent devleti) karşıtı kır yerleşimi; 'Köy'."
    },
    "μάχη": {
        "id": "emel_makhe",
        "word": "μάχη",
        "lemma": "ἡ μάχη, -ης",
        "transliteration": "mákhē",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Savaş, muharebe, çarpışma, vuruşma",
            "Savaş meydanı",
            "Mücadele, çekişme"
        ],
        "meanings_en": ["battle, combat, fight, duel"],
        "etymology": "μάχομαι (savaşmak, dövüşmek) fiilinden.",
        "derivatives": ["titanomakhia (Titanlar Savaşı), gigantomakhia (Devler Savaşı), teomakhia"],
        "grammar": {
            "nominative": "ἡ μάχη",
            "genitive": "τῆς μάχης",
            "dative": "τῇ μάχῃ",
            "accusative": "τὴν μάχην",
            "vocative": "ὦ μάχη",
            "nom_pl": "αἱ μάχαι",
            "gen_pl": "τῶν μαχῶν",
            "dat_pl": "ταῖς μάχαις",
            "acc_pl": "τὰς μάχας"
        },
        "examples": [
            {"greek": "ἡ ἐν Μαραθῶνι μάχη.", "tr": "Marathon'daki muharebe.", "author": "Herodotos"}
        ],
        "emel_notes": "1. çekim dişil isim. Savaş ve meydan muharebesi anlamında en temel kelimedir."
    },
    "μουσική": {
        "id": "emel_mousike",
        "word": "μουσική",
        "lemma": "ἡ μουσική, -ῆς",
        "transliteration": "mousikḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Müzik sanatı, ezgi",
            "İlham perilerine (Musalar/Mousa) ait her türlü sanat, edebiyat ve felsefe eğitimi",
            "Ruhsal eğitim, incelik"
        ],
        "meanings_en": ["music, any art over which the Muses presided, liberal arts"],
        "etymology": "Μοῦσα (Mousa, esin perisi) kelimesinden türeyen μουσικός sıfatının dişil formu (ἡ μουσικὴ τέχνη).",
        "derivatives": ["müzik, musiki, müzisyen, museum (müze)"],
        "grammar": {
            "nominative": "ἡ μουσική",
            "genitive": "τῆς μουσικῆς",
            "dative": "τῇ μουσικῇ",
            "accusative": "τὴν μουσικήν"
        },
        "examples": [
            {"greek": "ἡ μουσικὴ παιδεύει τὴν ψυχήν.", "tr": "Müzik sanatı ruhu eğitir.", "author": "Platon", "work": "Devlet"}
        ],
        "emel_notes": "Yunan eğitiminde bedensel eğitime (gymnastike) karşılık gelen zihinsel/sanatsal eğitim: Müzik."
    },
    "νῆσος": {
        "id": "emel_nesos",
        "word": "νῆσος",
        "lemma": "ἡ νῆσος, νήσου",
        "transliteration": "nē̃sos",
        "partOfSpeech": "İsim (Dişil, 2. Çekim İstisna)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": [
            "Ada (2. çekim dişil isim istisnası)"
        ],
        "meanings_en": ["island"],
        "etymology": "Ön-Grekçe Akdeniz kökenli coğrafi isim.",
        "derivatives": ["Peloponnesos (Pelops'un adası / Mora), Mikronezya, Polinezya, Melanezya"],
        "grammar": {
            "nominative": "ἡ νῆσος",
            "genitive": "τῆς νήσου",
            "dative": "τῇ νήσῳ",
            "accusative": "τὴν νῆσον",
            "vocative": "ὦ νῆσε",
            "nom_pl": "αἱ νῆσοι",
            "gen_pl": "τῶν νήσων",
            "dat_pl": "ταῖς νήσοις",
            "acc_pl": "τὰς νήσους"
        },
        "examples": [
            {"greek": "καλὴ ἡ νῆσος.", "tr": "Ada güzeldir.", "author": "Klasik Cümle"}
        ],
        "emel_notes": "2. çekim (-ος) dişil isim istisnalarındandır. Cinsiyeti dişildir (ἡ νῆσος)."
    },
    "γεωργός": {
        "id": "emel_georgos",
        "word": "γεωργός",
        "lemma": "ὁ γεωργός, -οῦ",
        "transliteration": "geōrgós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "frequency": 4,
        "meanings_tr": [
            "Çiftçi, toprağı işleyen kimse, tarımcı"
        ],
        "meanings_en": ["farmer, husbandman, earth-worker"],
        "etymology": "γῆ (toprak) + ἔργον (iş, çalışma) bileşiminden (Hint-Avrupa *werǵ-).",
        "derivatives": ["George, Yorgi, georgik (tarım şiirleri)"],
        "grammar": {
            "nominative": "ὁ γεωργός",
            "genitive": "τοῦ γεωργοῦ",
            "dative": "τῷ γεωργῷ",
            "accusative": "τὸν γεωργόν",
            "vocative": "ὦ γεωργέ",
            "nom_pl": "οἱ γεωργοί",
            "gen_pl": "τῶν γεωργῶν",
            "dat_pl": "τοῖς γεωργοῖς",
            "acc_pl": "τοὺς γεωργούς"
        },
        "examples": [
            {"greek": "ὁ γεωργὸς τὸν ἀγρὸν γεωργεῖ.", "tr": "Çiftçi tarlayı sürer/işler.", "author": "Klasik Metin"}
        ],
        "emel_notes": "γῆ + ἔργον kökünden türeyen temel eril isimdir: 'Çiftçi'."
    },
    "πλοῦτος": {
        "id": "emel_ploutos",
        "word": "πλοῦτος",
        "lemma": "ὁ πλοῦτος, πλούτου",
        "transliteration": "ploũtos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Zenginlik, servet, varlık, bolluk",
            "Plutos (Zenginlik tanrısı)"
        ],
        "meanings_en": ["wealth, riches, abundance"],
        "etymology": "Hint-Avrupa *plew- (akmak, taşmak; krş. πλέω).",
        "derivatives": ["plutokrasi (zenginler erki/yönetimi), Pluton (yeraltı zenginlikleri tanrısı)"],
        "grammar": {
            "nominative": "ὁ πλοῦτος",
            "genitive": "τοῦ πλούτου",
            "dative": "τῷ πλούτῳ",
            "accusative": "τὸν πλοῦτον",
            "vocative": "ὦ πλοῦτε"
        },
        "examples": [
            {"greek": "ὁ πλοῦτος τυφλόν ἐστιν.", "tr": "Zenginlik kördür.", "author": "Aristophanes", "work": "Ploutos"}
        ],
        "emel_notes": "2. çekim eril isim. 'Zenginlik, servet' anlamına gelir; plutokrasi kelimesinin kökenidir."
    },
    "ποιητής": {
        "id": "emel_poietes",
        "word": "ποιητής",
        "lemma": "ὁ ποιητής, ποιητοῦ",
        "transliteration": "poiētḗs",
        "partOfSpeech": "İsim (Eril, 1. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Şair, ozan",
            "Yaratıcı, yapıcı, üreten kimse"
        ],
        "meanings_en": ["maker, creator, poet"],
        "etymology": "ποιέω (yapmak, yaratmak, üretmek) fiilinden türetilmiştir.",
        "derivatives": ["şair (poet), poetika (şiir sanatı/kuramı), şiirsel (poetic)"],
        "grammar": {
            "nominative": "ὁ ποιητής",
            "genitive": "τοῦ ποιητοῦ",
            "dative": "τῷ ποιητῇ",
            "accusative": "τὸν ποιητήν",
            "vocative": "ὦ ποιητά",
            "nom_pl": "οἱ ποιηταί",
            "gen_pl": "τῶν ποιητῶν",
            "dat_pl": "τοῖς ποιηταῖς",
            "acc_pl": "τοὺς ποιητάς"
        },
        "examples": [
            {"greek": "Ὅμηρος ὁ τῶν Ἑλλήνων ποιητής.", "tr": "Yunanların şairi Homeros.", "author": "Klasik Metin"}
        ],
        "emel_notes": "1. çekim ERİL isim grubuna girer (-ης ile biter, genitivi -ου alır). 'Şair, yapıcı' demektir."
    },
    "πολέμιος": {
        "id": "emel_polemios",
        "word": "πολέμιος",
        "lemma": "ὁ πολέμιος, -ου / πολέμιος, -α, -ον",
        "transliteration": "polémios",
        "partOfSpeech": "İsim / Sıfat (Eril, 2. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Düşman (isim olarak: ὁ πολέμιος, çoğul: οἱ πολέμιοι)",
            "Düşmanca, savaşa ait, hasım (sıfat olarak: πολέμιος, -α, -ον)"
        ],
        "meanings_en": ["enemy (noun), hostile, pertaining to war (adjective)"],
        "etymology": "πόλεμος (savaş) kelimesinden türetilmiştir.",
        "derivatives": ["polemik (tartışma/ağız savaşı), polemoloji (savaş bilimi)"],
        "grammar": {
            "nominative": "ὁ πολέμιος / πολέμιος",
            "genitive": "τοῦ πολεμίου",
            "dative": "τῷ πολεμίῳ",
            "accusative": "τὸν πολέμιον",
            "nom_pl": "οἱ πολέμιοι",
            "gen_pl": "τῶν πολεμίων",
            "dat_pl": "τοῖς πολεμίοις",
            "acc_pl": "τοὺς πολεμίους"
        },
        "examples": [
            {"greek": "οἱ πολέμιοι ἐπὶ τὴν πόλιν ἐλαύνουσιν.", "tr": "Düşmanlar kente doğru ilerliyorlar.", "author": "Ksenophon"}
        ],
        "emel_notes": "πόλεμος (savaş) kökünden gelir. Hem sıfat ('düşmanca') hem de isim ('düşman', çoğul: οἱ πολέμιοι) olarak kullanılır."
    },
    "πολίτης": {
        "id": "emel_polites",
        "word": "πολίτης",
        "lemma": "ὁ πολίτης, πολίτου",
        "transliteration": "polítēs",
        "partOfSpeech": "İsim (Eril, 1. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Vatandaş, yurttaş, hemşehri",
            "Özgür kent devleti (polis) sakini"
        ],
        "meanings_en": ["citizen, freeman of a city"],
        "etymology": "πόλις (şehir, kent devleti) kelimesinden.",
        "derivatives": ["politika, kozmopolit (dünya vatandaşı)"],
        "grammar": {
            "nominative": "ὁ πολίτης",
            "genitive": "τοῦ πολίτου",
            "dative": "τῷ πολίτῃ",
            "accusative": "τὸν πολίτην",
            "vocative": "ὦ πολῖτα",
            "nom_pl": "οἱ πολῖται",
            "gen_pl": "τῶν πολιτῶν",
            "dat_pl": "τοῖς πολίταις",
            "acc_pl": "τοὺς πολίτας"
        },
        "examples": [
            {"greek": "χρὴ τὸν πολίτην τοῖς νόμοις πείθεσθαι.", "tr": "Yurttaşın yasalara uyması gerekir.", "author": "Platon"}
        ],
        "emel_notes": "1. çekim ERİL isim örneği (-ης / gen. -ου). 'Yurttaş, vatandaş' demektir."
    },
    "στρατιώτης": {
        "id": "emel_stratiotes",
        "word": "στρατιώτης",
        "lemma": "ὁ στρατιώτης, στρατιώτου",
        "transliteration": "stratiṓtēs",
        "partOfSpeech": "İsim (Eril, 1. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Asker, savaşçı, er"
        ],
        "meanings_en": ["soldier, warrior"],
        "etymology": "στρατιά (ordu, sefer) ve στρατός (ordugah) kelimesinden.",
        "derivatives": ["strateji, stratigrafi"],
        "grammar": {
            "nominative": "ὁ στρατιώτης",
            "genitive": "τοῦ στρατιώτου",
            "dative": "τῷ στρατιώτῃ",
            "accusative": "τὸν στρατιώτην",
            "vocative": "ὦ στρατιῶτα",
            "nom_pl": "οἱ στρατιῶται",
            "gen_pl": "τῶν στρατιωτῶν",
            "dat_pl": "τοῖς στρατιώταις",
            "acc_pl": "τοὺς στρατιώτας"
        },
        "examples": [
            {"greek": "οἱ στρατιῶται ἀνδρείως μάχονται.", "tr": "Askerler cesurca savaşıyorlar.", "author": "Ksenophon"}
        ],
        "emel_notes": "1. çekim eril isim (-ης). 'Asker' anlamına gelir."
    },
    "διδάσκαλος": {
        "id": "emel_didaskalos",
        "word": "διδάσκαλος",
        "lemma": "ὁ / ἡ διδάσκαλος, -ου",
        "transliteration": "didáskalos",
        "partOfSpeech": "İsim (Ortak Cinsiyetli, Eril/Dişil, 2. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Öğretmen, hoca, eğitici, usta",
            "Oyun yazarı / koro eğiticisi (tiyatroda)"
        ],
        "meanings_en": ["teacher, master, instructor"],
        "etymology": "διδάσκω (öğretmek) fiilinden (Hint-Avrupa *dens- / *dek-).",
        "derivatives": ["didaktik (öğretici), didaktizm"],
        "grammar": {
            "nominative": "ὁ/ἡ διδάσκαλος",
            "genitive": "τοῦ/τῆς διδασκάλου",
            "dative": "τῷ/τῇ διδασκάλῳ",
            "accusative": "τὸν/τὴν διδάσκαλον",
            "vocative": "ὦ διδάσκαλε",
            "nom_pl": "οἱ/αἱ διδάσκαλοι",
            "gen_pl": "τῶν διδασκάλων",
            "dat_pl": "τοῖς/ταῖς διδασκάλοις",
            "acc_pl": "τοὺς/τὰς διδασκάλους"
        },
        "examples": [
            {"greek": "χαῖρε, ὦ διδάσκαλε.", "tr": "Selam, ey öğretmen!", "author": "Ders Diyaloğu"}
        ],
        "emel_notes": "Ortak cinsiyetli isim (ὁ/ἡ διδάσκαλος: hem erkek hem kadın öğretmen için aynı form kullanılır)."
    },
    "ἄστρον": {
        "id": "emel_astron",
        "word": "ἄστρον",
        "lemma": "τὸ ἄστρον, -ου",
        "transliteration": "ástron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": [
            "Yıldız, gök cismi, takımyıldız"
        ],
        "meanings_en": ["star, constellation, heavenly body"],
        "etymology": "Hint-Avrupa *h₂stḗr (yıldız; krş. Latince astrum/stella, İngilizce star).",
        "derivatives": ["astronomi (gökbilim), astronot, astroloji, asteroit, felaket (disaster)"],
        "grammar": {
            "nominative": "τὸ ἄστρον",
            "genitive": "τοῦ ἄστρου",
            "dative": "τῷ ἄστρῳ",
            "accusative": "τὸ ἄστρον",
            "vocative": "ὦ ἄστρον",
            "nom_pl": "τὰ ἄστρα",
            "gen_pl": "τῶν ἄστρων",
            "dat_pl": "τοῖς ἄστροις",
            "acc_pl": "τὰ ἄστρα"
        },
        "examples": [
            {"greek": "λάμπει τὰ ἄστρα ἐν τῷ οὐρανῷ.", "tr": "Gökyüzünde yıldızlar parıldar.", "author": "Klasik Şiir"}
        ],
        "emel_notes": "2. çekim nötr (-ον) isim. Nötr çoğul özne (τὰ ἄστρα) tekil fiil (λάμπει) alabilir."
    },
    "δῶρον": {
        "id": "emel_doron",
        "word": "δῶρον",
        "lemma": "τὸ δῶρον, δώρου",
        "transliteration": "dō̃ron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 4,
        "meanings_tr": [
            "Hediye, armağan, bağış",
            "Tanrılara adak"
        ],
        "meanings_en": ["gift, present, offering"],
        "etymology": "δίδωμι (vermek) fiilinden (Hint-Avrupa *deh₃-).",
        "derivatives": ["Dorothea, Teodor (Tanrı'nın hediyesi), donor (bağışçı)"],
        "grammar": {
            "nominative": "τὸ δῶρον",
            "genitive": "τοῦ δώρου",
            "dative": "τῷ δώρῳ",
            "accusative": "τὸ δῶρον",
            "vocative": "ὦ δῶρον",
            "nom_pl": "τὰ δῶρα",
            "gen_pl": "τῶν δώρων",
            "dat_pl": "τοῖς δώροις",
            "acc_pl": "τὰ δῶρα"
        },
        "examples": [
            {"greek": "φοβοῦ τοὺς Δαναοὺς καὶ δῶρα φέροντας.", "tr": "Hediye getiren Yunanlardan bile kork (Truva atı atfı).", "author": "Vergilius / Grek Özdeyişi"}
        ],
        "emel_notes": "2. çekim nötr isim. 'Hediye, armağan' demektir."
    },
    "ἔργον": {
        "id": "emel_ergon",
        "word": "ἔργον",
        "lemma": "τὸ ἔργον, ἔργου",
        "transliteration": "érgon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "İş, çalışma, emek, faaliyet, eylem",
            "Eser, ürün, yapıt",
            "Görev, işlev (Aristoteles felsefesinde insanın ergon'u)"
        ],
        "meanings_en": ["work, deed, action, task, function, opus"],
        "etymology": "Hint-Avrupa *wérǵ-om (iş; krş. İngilizce work, Almanca Werk).",
        "derivatives": ["ergonomi, enerji (en + ergon), cerrah (kheir + ergon = elle çalışan), alerji"],
        "grammar": {
            "nominative": "τὸ ἔργον",
            "genitive": "τοῦ ἔργου",
            "dative": "τῷ ἔργῳ",
            "accusative": "τὸ ἔργον",
            "vocative": "ὦ ἔργον",
            "nom_pl": "τὰ ἔργα",
            "gen_pl": "τῶν ἔργων",
            "dat_pl": "τοῖς ἔργοις",
            "acc_pl": "τὰ ἔργα"
        },
        "examples": [
            {"greek": "ἔργα καὶ ἡμέραι.", "tr": "İşler ve Günler (Hesiodos'un ünlü eseri).", "author": "Hesiodos"}
        ],
        "emel_notes": "En temel Grekçe kavramlardan biri: 'İş, emek, eylem, yapıt'. 'Enerji' kelimesinin köküdür."
    },
    "ἱερόν": {
        "id": "emel_hieron",
        "word": "ἱερόν",
        "lemma": "τὸ ἱερόν, -οῦ",
        "transliteration": "hierón",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Mitoloji & İnanç",
        "frequency": 4,
        "meanings_tr": [
            "Kutsal alan, tapınak, mabet, kutsal yer",
            "Kurban, adak (çoğulda: τὰ ἱερά)"
        ],
        "meanings_en": ["holy place, sanctuary, temple, sacred rites (pl.)"],
        "etymology": "ἱερός (kutsal, adanmış) sıfatının nötr formundan.",
        "derivatives": ["hiyerarşi (kutsal düzen/makam), hiyeroglif (kutsal yazı), Hierapolis (Pamukkale)"],
        "grammar": {
            "nominative": "τὸ ἱερόν",
            "genitive": "τοῦ ἱεροῦ",
            "dative": "τῷ ἱερῷ",
            "accusative": "τὸ ἱερόν",
            "vocative": "ὦ ἱερόν",
            "nom_pl": "τὰ ἱερά",
            "gen_pl": "τῶν ἱερῶν",
            "dat_pl": "τοῖς ἱεροῖς",
            "acc_pl": "τὰ ἱερά"
        },
        "examples": [
            {"greek": "θύουσιν ἐν τῷ ἱερῷ.", "tr": "Kutsal alanda / tapınakta kurban kesiyorlar.", "author": "Klasik Metin"}
        ],
        "emel_notes": "Kutsal alan, tapınak anlamında nötr isim."
    },
    "ὅπλον": {
        "id": "emel_hoplon",
        "word": "ὅπλον",
        "lemma": "τὸ ὅπλον, -ου",
        "transliteration": "hóplon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Silah, zırh (özellikle ağır piyade hoplit kalkanı)",
            "Alet, edavat (özellikle çoğulda: τὰ ὅπλα = silahlar, ordugah)"
        ],
        "meanings_en": ["tool, implement; (in pl.) arms, weapons, armor, shield"],
        "etymology": "Hint-Avrupa *sep- (özen göstermek, donatmak).",
        "derivatives": ["hoplit (ὁπλίτης = Antik Yunan ağır zırhlı piyadesi), panopli (tam takım zırh)"],
        "grammar": {
            "nominative": "τὸ ὅπλον",
            "genitive": "τοῦ ὅπλου",
            "dative": "τῷ ὅπλῳ",
            "accusative": "τὸ ὅπλον",
            "nom_pl": "τὰ ὅπλα",
            "gen_pl": "τῶν ὅπλων",
            "dat_pl": "τοῖς ὅπλοις",
            "acc_pl": "τὰ ὅπλα"
        },
        "examples": [
            {"greek": "τὰ ὅπλα τίθεσθαι.", "tr": "Silahları bırakmak / silah çatmak.", "author": "Thukydides"}
        ],
        "emel_notes": "'Hoplit' askerinin adını aldığı meşhur kalkan ve silah: 'Silah, teçhizat'."
    },
    "παιδίον": {
        "id": "emel_paidion",
        "word": "παιδίον",
        "lemma": "τὸ παιδίον, παιδίου",
        "transliteration": "paidíon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim Küçültme)",
        "category": "Günlük Yaşam",
        "frequency": 4,
        "meanings_tr": [
            "Küçük çocuk, yavru, bebek",
            "Genç köle, uşak (küçültme/sevgi formu)"
        ],
        "meanings_en": ["little child, young slave, infant"],
        "etymology": "παῖς (çocuk) kelimesinin -ιον küçültme (diminutive) ekiyle türetilmiş hali.",
        "derivatives": ["pediatri (çocuk hekimliği), pedagoji"],
        "grammar": {
            "nominative": "τὸ παιδίον",
            "genitive": "τοῦ παιδίου",
            "dative": "τῷ παιδίῳ",
            "accusative": "τὸ παιδίον",
            "nom_pl": "τὰ παιδία",
            "gen_pl": "τῶν παιδίων",
            "dat_pl": "τοῖς παιδίοις",
            "acc_pl": "τὰ παιδία"
        },
        "examples": [
            {"greek": "τὸ παιδίον παίζει.", "tr": "Küçük çocuk oynuyor.", "author": "Klasik Metin"}
        ],
        "emel_notes": "παῖς (çocuk) kelimesinin küçültme (diminutive) nötr formudur: 'Küçük çocuk'."
    },
    "χωρίον": {
        "id": "emel_khorion",
        "word": "χωρίον",
        "lemma": "τὸ χωρίον, -ου",
        "transliteration": "khōríon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim Küçültme)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Yer, alan, mahal, bölge, toprak parçası",
            "Müstahkem mevki, kale, hisar, savunma noktası"
        ],
        "meanings_en": ["place, spot, country place, stronghold, fortified post"],
        "etymology": "χῶρος (yer, mekan, memleket) kelimesinden türetilmiştir.",
        "derivatives": ["korografi (bölge tasviri)"],
        "grammar": {
            "nominative": "τὸ χωρίον",
            "genitive": "τοῦ χωρίου",
            "dative": "τῷ χωρίῳ",
            "accusative": "τὸ χωρίον",
            "nom_pl": "τὰ χωρία",
            "gen_pl": "τῶν χωρίων",
            "dat_pl": "τοῖς χωρίοις",
            "acc_pl": "τὰ χωρία"
        },
        "examples": [
            {"greek": "χωρίον ἰσχυρόν.", "tr": "Müstahkem bir yer / kale.", "author": "Ksenophon", "work": "Anabasis"}
        ],
        "emel_notes": "Hem coğrafi 'yer, alan' hem de askeri 'kale, hisar mevzii' demektir."
    },
    "ἀγγέλλω": {
        "id": "emel_angello",
        "word": "ἀγγέλλω",
        "lemma": "ἀγγέλλω [fut. ἀγγελῶ]",
        "transliteration": "angéllō",
        "partOfSpeech": "Fiil (Etken, Likit Gövde)",
        "category": "Temel Fiiller",
        "frequency": 4,
        "meanings_tr": [
            "Duyurmak, haber vermek, tebliğ etmek, bildirmek"
        ],
        "meanings_en": ["announce, report, bring news, proclaim"],
        "etymology": "ἄγγελος (haberci, elçi) ile aynı kök (Muhtemelen Doğu/Fars alt katman kökeni).",
        "derivatives": ["melek (angel), evangelist (müjdeci, İncil yazarı)"],
        "grammar": {
            "principal_parts": [
                "ἀγγέλλω (Şimdiki - Pres.)",
                "ἀγγελῶ (Gelecek - Fut.)",
                "ἤγγειλα (Geçmiş - Aor.)",
                "ἤγγελκα (Tamamlanmış - Perf.)"
            ]
        },
        "examples": [
            {"greek": "ὁ ἄγγελος τὴν νίκην ἀγγέλλει.", "tr": "Haberci zaferi duyurur.", "author": "Klasik Metin"}
        ],
        "emel_notes": "Gelecek zamanda likit çekime girer: [fut. ἀγγελῶ]. 'Duyurmak, haber vermek'."
    },
    "ἁρπάζω": {
        "id": "emel_harpazo",
        "word": "ἁρπάζω",
        "lemma": "ἁρπάζω [fut. ἁρπάσω]",
        "transliteration": "harpázō",
        "partOfSpeech": "Fiil (Etken, -ζω)",
        "category": "Temel Fiiller",
        "frequency": 4,
        "meanings_tr": [
            "Kapmak, yakalamak, kaçırmak, zorla çekip almak, yağmalamak"
        ],
        "meanings_en": ["snatch away, seize, carry off, kidnap, plunder"],
        "etymology": "Hint-Avrupa *serp- (orak, kapmak; krş. Latince carpere, harpy).",
        "derivatives": ["Harpy (mitolojik kapıp kaçıran canavar Harpiya), harpagon"],
        "grammar": {
            "principal_parts": [
                "ἁρπάζω (Pres.)",
                "ἁρπάσω (Fut.)",
                "ἥρπασα (Aor.)",
                "ἥρπακα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "ὁ Πλούτων τὴν Περσεφόνην ἁρπάζει.", "tr": "Pluton Persephone'yi kaçırır.", "author": "Mitoloji"}
        ],
        "emel_notes": "Kökü sert soluklu (spiritus asper: ἁ-): 'Kapmak, kaçırmak'."
    },
    "ἄρχω": {
        "id": "emel_arkho",
        "word": "ἄρχω",
        "lemma": "ἄρχω (+ gen.)",
        "transliteration": "árkhō",
        "partOfSpeech": "Fiil (Etken, + Genitiv)",
        "category": "Politika & Toplum",
        "frequency": 5,
        "meanings_tr": [
            "+ Genitiv ile: Yönetmek, hükmetmek, buyurmak",
            "Başlamak, öncülük etmek (özellikle orta çatıda: ἄρχομαι)"
        ],
        "meanings_en": ["rule, command, govern (+ gen.); begin, start"],
        "etymology": "ἀρχή (başlangıç, yönetim, ilke) kökü.",
        "derivatives": ["monarşi, anarşi, oligarşi, hiyerarşi, arkon (Atina yöneticisi)"],
        "grammar": {
            "principal_parts": [
                "ἄρχω (Pres.)",
                "ἄρξω (Fut.)",
                "ἦρξα (Aor.)",
                "ἦρχα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "ὁ βασιλεὺς ἄρχει τοῦ λαοῦ.", "tr": "Kral halkı yönetir (+ genitiv: τοῦ λαοῦ).", "author": "Klasik Metin"}
        ],
        "emel_notes": "Önemli sözdizimi kuralı: 'Yönetmek' anlamındayken yönetilen nesneyi GENİTİV (-in hali) durumunda alır (+ gen.)."
    },
    "βουλεύω": {
        "id": "emel_bouleuo",
        "word": "βουλεύω",
        "lemma": "βουλεύω (+ inf.)",
        "transliteration": "bouleúō",
        "partOfSpeech": "Fiil (Etken, -εύω)",
        "category": "Politika & Toplum",
        "frequency": 4,
        "meanings_tr": [
            "Plan yapmak, tasarlamak, danışmak",
            "+ Mastar (infinitive) ile: Bir şeyi yapmaya karar vermek, azmetmek",
            "Orta çatı (βουλεύομαι): Kendi kendine düşünüp taşınmak, müzakere etmek"
        ],
        "meanings_en": ["plan, deliberate, take counsel; (+ inf.) resolve to do"],
        "etymology": "βουλή (irade, meclis, plan) isminden türetilmiştir.",
        "derivatives": ["Bouleuterion (Antik Yunan meclis binası)"],
        "grammar": {
            "principal_parts": [
                "βουλεύω (Pres.)",
                "βουλεύσω (Fut.)",
                "ἐβούλευσα (Aor.)",
                "βεβούλευκα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "βουλεύου πρὸ ἔργων.", "tr": "İşe girişmeden önce plan yap / düşün taşın.", "author": "Özdeyiş"}
        ],
        "emel_notes": "+ Mastar ile bağlandığında 'yapmaya karar vermek' anlamı kazanır."
    },
    "βούλομαι": {
        "id": "emel_boulomai",
        "word": "βούλομαι",
        "lemma": "βούλομαι (+ inf.)",
        "transliteration": "boúlomai",
        "partOfSpeech": "Fiil (Deponens / Orta Çatılı, + Mastar)",
        "category": "Temel Fiiller",
        "frequency": 5,
        "meanings_tr": [
            "İstemek, arzu etmek, dilemek, niyetinde olmak (deponens fiil)",
            "+ Mastar ile: Bir şeyi yapmak istemek"
        ],
        "meanings_en": ["will, wish, want, prefer (+ inf.)"],
        "etymology": "Hint-Avrupa *gʷel- (arzu etmek, seçmek; krş. Latince velle, volo).",
        "derivatives": ["abuli (irade zayıflığı)"],
        "grammar": {
            "principal_parts": [
                "βούλομαι (Pres. deponens)",
                "βουλήσομαι (Fut.)",
                "ἐβουλήθην (Aor. passivum/deponens)",
                "βεβούλημαι (Perf.)"
            ]
        },
        "examples": [
            {"greek": "βούλομαι μανθάνειν τὴν Ἑλληνικὴν γλῶτταν.", "tr": "Grek dilini öğrenmek istiyorum.", "author": "Ders Cümlesi"}
        ],
        "emel_notes": "Deponens fiildir (biçimi edilgen/orta çatı -ομαι ile biter ama anlamı etkendir: 'İstemek')."
    },
    "γίγνομαι": {
        "id": "emel_gignomai",
        "word": "γίγνομαι",
        "lemma": "γίγνομαι (+ nom.)",
        "transliteration": "gígnomai",
        "partOfSpeech": "Fiil (Deponens, Kök Çoğaltmalı)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "Olmak, meydana gelmek, vuku bulmak",
            "Doğmak, dünyaya gelmek, ortaya çıkmak (felsefede: oluş - becoming)",
            "+ Nominativ ile yüklem tamamlayıcısı alır"
        ],
        "meanings_en": ["become, be born, come into being, happen, occur"],
        "etymology": "Hint-Avrupa *ǵenh₁- (doğurmak, var olmak; krş. Latince gignere, genus).",
        "derivatives": ["genetik, genesis (yaratılış), genealoji, projenitör"],
        "grammar": {
            "principal_parts": [
                "γίγνομαι (Pres.)",
                "γενήσομαι (Fut.)",
                "ἐγενόμην (Aor. medii)",
                "γέγονα (Perf. act.) / γεγένημαι (Perf. pass.)"
            ]
        },
        "examples": [
            {"greek": "ἐγένετο φῶς.", "tr": "Işık oldu.", "author": "Septuaginta"}
        ],
        "emel_notes": "Klasik Grekçenin en temel felsefi fiilidir (Oluş / Becoming). Yükleminde nominativ durum ister (+ nom.)."
    },
    "ἐθέλω": {
        "id": "emel_ethelo",
        "word": "ἐθέλω",
        "lemma": "ἐθέλω / θέλω (+ inf.)",
        "transliteration": "ethélō",
        "partOfSpeech": "Fiil (Etken, + Mastar)",
        "category": "Temel Fiiller",
        "frequency": 5,
        "meanings_tr": [
            "İstemek, razı olmak, gönüllü olmak, hazır olmak",
            "+ Mastar ile: Yapmayı arzu etmek / razı gelmek"
        ],
        "meanings_en": ["be willing, wish, consent, desire (+ inf.)"],
        "etymology": "Kökü tartışmalı Grekçe kök (krş. Yeni Yunanca θέλω).",
        "derivatives": ["Monotheletizm (tek iradecilik mezhebi)"],
        "grammar": {
            "principal_parts": [
                "ἐθέλω (Pres.)",
                "ἐθελήσω (Fut.)",
                "ἠθέλησα (Aor.)",
                "ἠθέληκα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "εἰ θεὸς ἐθέλει.", "tr": "Eğer Tanrı dilerse (İnşallah).", "author": "Klasik Özdeyiş"}
        ],
        "emel_notes": "'İstemek, razı olmak'. βούλομαι'ya göre daha çok 'gönüllü olma, razı gelme' nüansı taşır."
    },
    "θύω": {
        "id": "emel_thuo",
        "word": "θύω",
        "lemma": "θύω [fut. θύσω]",
        "transliteration": "thúō",
        "partOfSpeech": "Fiil (Etken)",
        "category": "Mitoloji & İnanç",
        "frequency": 4,
        "meanings_tr": [
            "Kurban etmek, kurban sunmak, adakta bulunmak",
            "Kurban ziyafeti vermek"
        ],
        "meanings_en": ["sacrifice, offer sacrifice, slay a victim"],
        "etymology": "Hint-Avrupa *dʰuh₂- (duman çıkarmak, tütmek; krş. Latince fumus, İngilizce fume).",
        "derivatives": ["thyme (kekik - kurban tütsüsü kokusu)"],
        "grammar": {
            "principal_parts": [
                "θύω (Pres.)",
                "θύσω (Fut.)",
                "ἔθυσα (Aor.)",
                "τέθυκα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "οἱ Ἀθηναῖοι τοῖς θεοῖς θύουσιν.", "tr": "Atinalılar tanrılara kurban sunarlar.", "author": "Klasik Metin"}
        ],
        "emel_notes": "Antik dinde kurban eylemi: 'Kurban kesmek / sunmak'. Gelecek zamanı [θύσω]'dur."
    },
    "κρίνω": {
        "id": "emel_krino",
        "word": "κρίνω",
        "lemma": "κρίνω",
        "transliteration": "krínō",
        "partOfSpeech": "Fiil (Etken, Likit Gövde)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "Yargılamak, hüküm vermek",
            "Karar vermek, ayırmak, seçmek, muhakeme etmek"
        ],
        "meanings_en": ["judge, decide, separate, choose, determine"],
        "etymology": "Hint-Avrupa *krey- (ayırmak, elemek; krş. Latince cernere, crimen).",
        "derivatives": ["kriter, kritik (eleştiri), kriz (karar anı/dönüm noktası), hipokrasi (ikiyüzlülük)"],
        "grammar": {
            "principal_parts": [
                "κρίνω (Pres.)",
                "κρινῶ (Fut. likit)",
                "ἔκρινα (Aor.)",
                "κέκρικα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "μὴ κρίνετε, ἵνα μὴ κριθῆτε.", "tr": "Yargılamayın ki yargılanmayasınız.", "author": "Yeni Ahit (Matta 7:1)"}
        ],
        "emel_notes": "'Kritik, kriter, kriz' kelimelerinin kaynağı olan felsefi ve hukuki fiildir: 'Yargılamak, ayırmak'."
    },
    "λύομαι": {
        "id": "emel_luomai",
        "word": "λύομαι",
        "lemma": "λύομαι (Orta/Edilgen Çatı)",
        "transliteration": "lúomai",
        "partOfSpeech": "Fiil (Orta/Edilgen Çatı)",
        "category": "Temel Fiiller",
        "frequency": 4,
        "meanings_tr": [
            "Orta çatı: Birisini fidye karşılığı serbest bıraktırmak / fidyeyle kurtarmak",
            "Kendine ait bir şeyi çözmek / serbest bırakmak",
            "Edilgen çatı: Serbest bırakılmak, çözülmek"
        ],
        "meanings_en": ["ransom, cause to be released by paying ransom; (pass.) be freed, be dissolved"],
        "etymology": "λύω fiilinin medyum (orta) ve passivum (edilgen) formu.",
        "derivatives": ["lysis, analiz, diyaliz"],
        "grammar": {
            "principal_parts": [
                "λύομαι (Pres. med./pass.)",
                "λύσομαι (Fut. med.)",
                "ἐλυσάμην (Aor. med. - fidye ile kurtardı)",
                "ἐλύθην (Aor. pass. - serbest bırakıldı)"
            ]
        },
        "examples": [
            {"greek": "ὁ πατὴρ τὸν υἱὸν λύεται.", "tr": "Baba fidye ödeyerek oğlunu kurtarır.", "author": "Homeros (İlyada 1. Kitap Khryses örneği)"}
        ],
        "emel_notes": "Grekçe dilbilgisinde orta çatının (medium) anlam farkını gösteren en meşhur örnektir: λύω = serbest bırakmak; λύομαι = fidyeyle kurtarmak."
    },
    "νομίζω": {
        "id": "emel_nomizo",
        "word": "νομίζω",
        "lemma": "νομίζω",
        "transliteration": "nomízō",
        "partOfSpeech": "Fiil (Etken, -ζω)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "Düşünmek, saymak, kabul etmek, addetmek",
            "İnanmak (özellikle tanrılara inanmak: θεοὺς νομίζειν)",
            "Gelenek olarak benimsemek, âdet edinmek"
        ],
        "meanings_en": ["think, consider, believe, hold as custom, acknowledge (gods)"],
        "etymology": "νόμος (yasa, töre, âdet) kelimesinden türetilmiştir.",
        "derivatives": ["nümizmatik (sikke/para bilimi - νόμισμα'dan)"],
        "grammar": {
            "principal_parts": [
                "νομίζω (Pres.)",
                "νομιῶ (Fut. Attika)",
                "ἐνόμισα (Aor.)",
                "νενόμικa (Perf.)"
            ]
        },
        "examples": [
            {"greek": "οὓς ἡ πόλις νομίζει θεούς.", "tr": "Kentin inandığı / kabul ettiği tanrılar (Sokrates'in savunmasında geçen suçlama).", "author": "Platon", "work": "Sokrates'in Savunması"}
        ],
        "emel_notes": "νόμος (yasa/âdet) kökünden gelir. Felsefe ve mahkemede 'inanmak, kabul etmek, saymak' anlamında kilit fiildir."
    },
    "παιδεύω": {
        "id": "emel_paideuo",
        "word": "παιδεύω",
        "lemma": "παιδεύω",
        "transliteration": "paideúō",
        "partOfSpeech": "Fiil (Etken, Düzenli Fiil)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Eğitmek, yetiştirmek, öğretmek, terbiye etmek"
        ],
        "meanings_en": ["educate, train, teach, bring up a child"],
        "etymology": "παῖς (çocuk) ve παιδεία (eğitim) kökünden.",
        "derivatives": ["pedagoji, paideia (Antik Yunan eğitim ideali), ansiklopedi"],
        "grammar": {
            "principal_parts": [
                "παιδεύω (Pres.)",
                "παιδεύσω (Fut.)",
                "ἐπαίδευσα (Aor.)",
                "πεπαίδευκα (Perf.)",
                "πεπαίδευμαι (Perf. pass.)",
                "ἐπαιδεύθην (Aor. pass.)"
            ]
        },
        "examples": [
            {"greek": "παιδεύομεν τοὺς παῖδας.", "tr": "Çocukları eğitiyoruz.", "author": "Klasik Örnek"}
        ],
        "emel_notes": "Grekçe dilbilgisinde kurallı fiil çekim paradigmasının (model verb) standart örneğidir: 'Eğitmek'."
    },
    "παύω": {
        "id": "emel_pauo",
        "word": "παύω",
        "lemma": "παύω / παύομαι",
        "transliteration": "paúō",
        "partOfSpeech": "Fiil (Etken & Orta Çatılı)",
        "category": "Temel Fiiller",
        "frequency": 4,
        "meanings_tr": [
            "Etken çatı (παύω): Durdurmak, dindirmek, son verdirmek",
            "Orta çatı (παύομαι): Durmak, dinlenmek, ara vermek, vazgeçmek"
        ],
        "meanings_en": ["stop, bring to an end; (mid.) cease, rest, pause"],
        "etymology": "Hint-Avrupa *peh₂w- (az, durmak; krş. Latince paucus, paulum).",
        "derivatives": ["pause (duraklama, mola), pouse"],
        "grammar": {
            "principal_parts": [
                "παύω (Pres. act.)",
                "παύσω (Fut.)",
                "ἔπαυσα (Aor. act. - durdurdu)",
                "ἐπαυσάμην (Aor. med. - durdu)",
                "πέπαυκα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "παῦε τὸν πόλεμον.", "tr": "Savaşa son ver!", "author": "Klasik Örnek"}
        ],
        "emel_notes": "Etkeni 'durdurmak', orta çatısı (παύομαι) ise 'kendi durmak, mola vermek' demektir. 'Pause' kelimesinin kökenidir."
    },
    "πείθω": {
        "id": "emel_peitho",
        "word": "πείθω",
        "lemma": "πείθω (+ acc.) / πείθομαι (+ dat.)",
        "transliteration": "peíthō",
        "partOfSpeech": "Fiil (Etken & Orta Çatılı)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "Etken çatı (+ acc.): İkna etmek, inandırmak, kandırmak",
            "Orta çatı (+ dat. πείθομαι): İtaat etmek, boyun eğmek, güvenmek, dinlemek"
        ],
        "meanings_en": ["persuade, convince (+ acc.); (mid. + dat.) obey, trust, yield"],
        "etymology": "Hint-Avrupa *bʰeydʰ- (güvenmek, inanmak; krş. Latince fides, fidus).",
        "derivatives": ["Peitho (İkna Tanrıçası), fideizm (inanççılık)"],
        "grammar": {
            "principal_parts": [
                "πείθω (Pres.)",
                "πείσω (Fut.)",
                "ἔπεισα (Aor.)",
                "πέπεικα (Perf. act. - ikna ettim)",
                "πέποιθα (Perf. 2 med. - güvendim)"
            ]
        },
        "examples": [
            {"greek": "πείθου τοῖς νόμοις.", "tr": "Yasalara itaat et (+ dativ).", "author": "Özdeyiş"}
        ],
        "emel_notes": "Çatıya göre anlam değişir: Etken (+ acc.) = 'ikna etmek'; Orta çatı (+ dat.) = 'itaat etmek, güvenmek'."
    },
    "πέμπω": {
        "id": "emel_pempo",
        "word": "πέμπω",
        "lemma": "πέμπω",
        "transliteration": "pémpō",
        "partOfSpeech": "Fiil (Etken, Labial Gövde)",
        "category": "Temel Fiiller",
        "frequency": 4,
        "meanings_tr": [
            "Göndermek, yollamak, sevk etmek",
            "Uğurlamak, refakat etmek"
        ],
        "meanings_en": ["send, dispatch, escort, conduct"],
        "etymology": "Hint-Avrupa *penkʷ- (adım atmak, göndermek).",
        "derivatives": ["pompa (πομπή = kortej, tören alayı, geçit töreni; buradan Türkçeye ve Batı dillerine geçmiştir)"],
        "grammar": {
            "principal_parts": [
                "πέμπω (Pres.)",
                "πέμψω (Fut.)",
                "ἔπεμψα (Aor.)",
                "πέπομφα (Perf.)",
                "πέπεμμαι (Perf. pass.)",
                "ἐπέμφθην (Aor. pass.)"
            ]
        },
        "examples": [
            {"greek": "ὁ δεσπότης τὸν δοῦλον πέμπει.", "tr": "Efendi köleyi gönderir.", "author": "Klasik Metin"}
        ],
        "emel_notes": "Dudak sessizli (-π-) temel fiil. Dudaksı sessiz + σ birleşip ψ olur: [fut. πέμψω]."
    },
    "πιστεύω": {
        "id": "emel_pisteuo",
        "word": "πιστεύω",
        "lemma": "πιστεύω (+ dat.)",
        "transliteration": "pisteúō",
        "partOfSpeech": "Fiil (Etken, + Dativ)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "+ Dativ ile: Güvenmek, inanmak, itimat etmek",
            "Emanet etmek (çift nesneyle)"
        ],
        "meanings_en": ["trust, believe in, rely on (+ dat.); entrust"],
        "etymology": "πίστις (inanç, güven) isminden.",
        "derivatives": ["epistemoloji kökündeki güvence/inanç boyutu"],
        "grammar": {
            "principal_parts": [
                "πιστεύω (Pres.)",
                "πιστεύσω (Fut.)",
                "ἐπίστευσα (Aor.)",
                "πεπίστευκα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "πιστεύω τῷ φίλῳ.", "tr": "Arkadaşıma güveniyorum (+ dativ).", "author": "Klasik Cümle"}
        ],
        "emel_notes": "+ Dativ ile kullanılır: Güvenilen kişi dativ halindedir: 'Güvenmek, inanmak'."
    },
    "πράττω": {
        "id": "emel_pratto",
        "word": "πράττω",
        "lemma": "πράττω (Attika) / πράσσω",
        "transliteration": "práttō",
        "partOfSpeech": "Fiil (Etken, -ττω)",
        "category": "Temel Fiiller",
        "frequency": 5,
        "meanings_tr": [
            "Yapmak, etmek, icra etmek, başarmak",
            "Durumu olmak (örn: εὖ πράττω = iyi durumdayım / işlerim yolunda)",
            "Orta çatı (πράττομαι): Kendine almak, tahsil etmek (vergi vb.)"
        ],
        "meanings_en": ["do, achieve, accomplish, fare; (mid.) exact for oneself"],
        "etymology": "Hint-Avrupa *per- (geçmek, aşmak; krş. Latince portare, peritus).",
        "derivatives": ["pratik, pragmatizm (faydacılık/eylemcilik), praxis (eylem)"],
        "grammar": {
            "principal_parts": [
                "πράττω (Pres.)",
                "πράξω (Fut.)",
                "ἔπραξα (Aor.)",
                "πέπραχα / πέπραγα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "εὖ πρᾶττε.", "tr": "İşlerin yolunda gitsin / Mutlu ol!", "author": "Klasik Tebrik Formülü"}
        ],
        "emel_notes": "Attika Grekçesinde -ττω formundadır (-ττ-/-σσ- değişimi). 'Pratik, pragmatizm' köküdür."
    },
    "φεύγω": {
        "id": "emel_pheugo",
        "word": "φεύγω",
        "lemma": "φεύγω",
        "transliteration": "pheúgō",
        "partOfSpeech": "Fiil (Etken, Damaksıl Gövde)",
        "category": "Temel Fiiller",
        "frequency": 5,
        "meanings_tr": [
            "Kaçmak, firar etmek, uzak durmak",
            "Sürgüne gitmek (ὁ φεύγων = sürgün)",
            "Mahkemede sanık olmak / savunma yapmak (ὁ φεύγων = davalı/sanık)"
        ],
        "meanings_en": ["flee, escape, take flight, go into exile, be a defendant"],
        "etymology": "Hint-Avrupa *bʰewg- (kaçmak; krş. Latince fugere, fuga).",
        "derivatives": ["füg (müzikte kaçış melodisi), firar (Latince fuga akrabası)"],
        "grammar": {
            "principal_parts": [
                "φεύγω (Pres.)",
                "φεύξομαι (Fut. deponens)",
                "ἔφυγον (Aor. 2)",
                "πέφευγα (Perf.)"
            ]
        },
        "examples": [
            {"greek": "οἱ στρατιῶται φεύγουσιν ἐκ τῆς μάχης.", "tr": "Askerler savaştan kaçıyorlar.", "author": "Klasik Metin"}
        ],
        "emel_notes": "Hem fiili 'kaçmak' hem de hukuk dilinde 'sanık olmak / savunma tarafı olmak' demektir."
    },
    "νέος": {
        "id": "emel_neos",
        "word": "νέος",
        "lemma": "νέος, νέα, νέον",
        "transliteration": "néos",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": [
            "Yeni, taze, çağdaş",
            "Genç (ὁ νέος = genç adam, delikanlı)"
        ],
        "meanings_en": ["new, fresh, young"],
        "etymology": "Hint-Avrupa *néwos (yeni; krş. Latince novus, İngilizce new, Rusça nový).",
        "derivatives": ["neo- (yeni- ön eki: neolitik, neoklasik, neon), Neapolis (Napoli = Yeni Şehir)"],
        "grammar": {
            "masculine": "νέος",
            "feminine": "νέα",
            "neuter": "νέον"
        },
        "examples": [
            {"greek": "νέος ἄνθρωπος.", "tr": "Genç adam.", "author": "Klasik Örnek"}
        ],
        "emel_notes": "1. ve 2. çekim sıfat (3 takılı). Dişil formu kök sesliyle bittiği için saf alfa (-α) alır: νέα."
    },
    "παλαιός": {
        "id": "emel_palaios",
        "word": "παλαιός",
        "lemma": "παλαιός, παλαιά, παλαιόν",
        "transliteration": "palaiós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Tarih & Kültür",
        "frequency": 4,
        "meanings_tr": [
            "Eski, antik, kadim, çok önceden kalma",
            "Yaşlı, kıdemli"
        ],
        "meanings_en": ["old in years, ancient, antique"],
        "etymology": "πάλαι (eskiden, çok önce) zarfından (Hint-Avrupa *kʷel-).",
        "derivatives": ["paleontoloji (fosil bilimi), paleolitik (eski taş çağı), paleografi (eski yazı bilimi)"],
        "grammar": {
            "masculine": "παλαιός",
            "feminine": "παλαιά",
            "neuter": "παλαιόν"
        },
        "examples": [
            {"greek": "ἡ παλαιὰ πόλις.", "tr": "Antik / eski kent.", "author": "Klasik Metin"}
        ],
        "emel_notes": "νέος (yeni/genç) sıfatının zıttıdır: 'Eski, antik, kadim'. Dişili παλαιά biçimindedir."
    },
    "σοφός": {
        "id": "emel_sophos",
        "word": "σοφός",
        "lemma": "σοφός, σοφή, σοφόν",
        "transliteration": "sophós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Felsefe",
        "frequency": 5,
        "meanings_tr": [
            "Bilge, akıllı, zeki, basiretli",
            "Becerikli, mahir, uzman"
        ],
        "meanings_en": ["wise, clever, skilled, prudent"],
        "etymology": "Kökü belirsiz; Akdeniz alt katman kökenli kabul edilir.",
        "derivatives": ["filozof (philosophos = bilgeliği seven), sofist, sofistike"],
        "grammar": {
            "masculine": "σοφός",
            "feminine": "σοφή",
            "neuter": "σοφόν"
        },
        "examples": [
            {"greek": "ἓν οἶδα ὅτι οὐδὲν οἶδα, ἔφη ὁ σοφός.", "tr": "Bir şey biliyorum, o da hiçbir şey bilmediğimdir, dedi bilge kişi.", "author": "Sokrates atfı"}
        ],
        "emel_notes": "Felsefenin (philosophia) temel sıfatı: 'Bilge, akıllı'. Dişili -η alır (σοφή)."
    },
    "παρά": {
        "id": "emel_para",
        "word": "παρά",
        "lemma": "παρά (+ acc., + dat., + gen.)",
        "transliteration": "pará",
        "partOfSpeech": "Edat (Üç Durumlu Preposition)",
        "category": "Zarflar & Edatlar",
        "frequency": 5,
        "meanings_tr": [
            "+ Accusativ: Yanına, -e doğru, boyunca; ek olarak; aksine / karşı (nereye?)",
            "+ Dativ: Yanında, bitişiğinde, huzurunda, ile, yakında (nerede?)",
            "+ Genitiv: Yanından, huzurundan, tarafından, -den (nereden?)"
        ],
        "meanings_en": ["beside, by, along, beyond, against (+ acc.); beside, at (+ dat.); from beside, from (+ gen.)"],
        "etymology": "Hint-Avrupa *per- (ötesinde, yanından; krş. Latince per, İngilizce for).",
        "derivatives": ["paralel, paradoks, parametre, paranoya, paragraf, parazit"],
        "examples": [
            {"greek": "παρὰ τὸν ποταμόν (acc.).", "tr": "Nehir boyunca / nehrin kenarına.", "author": "Accusativ örneği"},
            {"greek": "παρὰ τῷ βασιλεῖ (dat.).", "tr": "Kralın yanında / nezdinde.", "author": "Dativ örneği"},
            {"greek": "παρὰ τοῦ φίλου (gen.).", "tr": "Arkadaşın yanından / arkadaşından.", "author": "Genitiv örneği"}
        ],
        "emel_notes": "Üç durumla (Accusativ, Dativ, Genitiv) da kullanılan en önemli Grekçe edattır. Hal durumuna göre yön/mekan anlamı değişir."
    },
    "σύν": {
        "id": "emel_sun",
        "word": "σύν",
        "lemma": "σύν (+ dat.)",
        "transliteration": "sún",
        "partOfSpeech": "Edat (+ Dativ Preposition)",
        "category": "Zarflar & Edatlar",
        "frequency": 5,
        "meanings_tr": [
            "+ Dativ ile: İle, beraber, birlikte, yardımıyla, aracılığıyla"
        ],
        "meanings_en": ["with, along with, together with (+ dat.)"],
        "etymology": "Hint-Avrupa *ḱóm (ile; krş. Latince com- / cum, Eski İrlandaca com-).",
        "derivatives": ["senfoni, sentez, sinerji, senkron, sembol, senaryo"],
        "grammar": {
            "note": "Bileşik kelimelerde ses uyumuna göre συν-, συμ-, συλ-, συσ- biçimlerine dönüşür."
        },
        "examples": [
            {"greek": "σὺn Ἀθηνᾷ καὶ χεῖρα κίνει.", "tr": "Tanrıça Athena'nın yardımıyla beraber sen de elini oynat (Tanrı'ya güven ama tedbiri elden bırakma).", "author": "Ezop Masalları"}
        ],
        "emel_notes": "Dativ hal ile kullanılan temel edattır: '+ dativ ile beraber'. 'Senfoni, sentez, sinerji' kelimelerinin köküdür."
    }
}

# 3. Process all 86 entries from emel_raw_full.txt
with open('emel_raw_full.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
cur_sec = 'Genel'
cur_subsec = ''
parsed_entries = []

for line in lines:
    line_s = line.strip()
    if line_s.startswith('## '):
        cur_sec = line_s.replace('## ', '')
        cur_subsec = ''
    elif line_s.startswith('### '):
        cur_subsec = line_s.replace('### ', '')
    elif line_s.startswith('* **'):
        m = re.match(r'^\*\s*\*\*([^*]+)\*\*(.*?):\s*(.+)$', line_s)
        if m:
            raw_greek, middle, meaning = m.groups()
            t_m = re.search(r'(?:\*|<em>)([^*<]+)(?:\*|</em>)', middle)
            translit = t_m.group(1).strip() if t_m else ''
            extra = re.sub(r'(?:\*|<em>)[^*<]+(?:\*|</em>)', '', middle).strip()
            
            parsed_entries.append({
                'sec': cur_sec,
                'subsec': cur_subsec,
                'raw_greek': raw_greek.strip(),
                'translit': translit,
                'extra': extra,
                'meaning': meaning.strip()
            })

print(f"Parsed {len(parsed_entries)} entries from prompt.")

# Track matched and added words
updated_count = 0
added_count = 0
seen_headwords = set()

for entry in parsed_entries:
    raw_g = entry['raw_greek']
    meaning = entry['meaning']
    translit = entry['translit']
    
    # clean article
    g_clean = re.sub(r'^(?:ὁ/ἡ|ὁ|ἡ|τὸ|οἱ|αἱ)\s+', '', raw_g).strip()
    headword = re.split(r'[,\[\(\/]', g_clean)[0].strip()
    norm_head = norm_greek(headword)
    
    if norm_head in seen_headwords:
        # e.g. repeat occurrences like παρά (3 times) or πολέμιος (singular/plural)
        continue
    seen_headwords.add(norm_head)
    
    # Check if already exists in dictionary
    matched = dict_by_norm.get(norm_head)
    
    if matched:
        # Tag existing entry
        matched['isEmelHoca'] = True
        tags = matched.get('tags', [])
        if 'emel_hoca' not in tags:
            tags.append('emel_hoca')
        matched['tags'] = tags
        
        # Add Emel Hoca note / meaning augment
        note_parts = []
        if entry['subsec']:
            note_parts.append(f"Kategori: {entry['subsec']}.")
        note_parts.append(f"Emel Hoca Listesi: {meaning}")
        if translit:
            note_parts.append(f"Transliterasyon: {translit}.")
        
        existing_notes = matched.get('emel_notes', '')
        if not existing_notes:
            matched['emel_notes'] = ' '.join(note_parts)
            
        updated_count += 1
        print(f"TAGGED EXISTING: {matched['word']} [{matched['id']}]")
    else:
        # Needs new entry! Check our detailed DB first
        if headword in new_entries_db:
            new_item = new_entries_db[headword]
        else:
            # Fallback generator for any remaining word
            new_item = {
                "id": f"emel_{norm_greek(headword)}",
                "word": headword,
                "lemma": raw_g,
                "transliteration": translit or headword,
                "partOfSpeech": entry['subsec'] or entry['sec'],
                "category": "Genel",
                "frequency": 4,
                "meanings_tr": [meaning],
                "meanings_en": [translit],
                "etymology": f"Klasik Grekçe {headword}.",
                "derivatives": [],
                "examples": []
            }
        
        new_item['isEmelHoca'] = True
        new_item['tags'] = ['emel_hoca']
        if 'emel_notes' not in new_item:
            new_item['emel_notes'] = f"Emel Hoca'nın kelime listesinde yer alır ({entry['subsec'] or entry['sec']}): {meaning}."
            
        dict_list.append(new_item)
        dict_by_norm[norm_head] = new_item
        added_count += 1
        print(f"ADDED NEW: {new_item['word']} ({new_item['lemma']})")

print(f"\n--- INTEGRATION SUMMARY ---")
print(f"Total existing entries updated with Emel Hoca tag: {updated_count}")
print(f"Total new entries created: {added_count}")
print(f"Total dictionary entries now: {len(dict_list)}")

# Save updated dictionary.js
output_js = prefix + json.dumps(dict_list, ensure_ascii=False, indent=2) + ';\n'
with open('data/dictionary.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Saved to data/dictionary.js successfully!")
