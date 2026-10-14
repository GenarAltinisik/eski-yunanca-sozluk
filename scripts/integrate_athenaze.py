# -*- coding: utf-8 -*-
"""
Integrate all Athenaze Book I (Chapters 1a-3b) vocabulary into Genar's Ancient Greek Dictionary.
Ensures every word has:
- word, lemma, transliteration
- partOfSpeech, category
- isAthenaze: True, tags: ['athenaze']
- athenaze_forms: textual forms from Athenaze text
- meanings_tr, meanings_en
- etymology, derivatives, examples
"""

import json
import re

# Load existing dictionary
with open('data/dictionary.js', 'r', encoding='utf-8') as f:
    c = f.read()
prefix = 'window.ANCIENT_GREEK_DICTIONARY = '
start_idx = c.find(prefix) + len(prefix)
end_idx = c.rfind(';')
dict_list = json.loads(c[start_idx:end_idx].strip())

# Build mapping of existing words by normalized Greek
def normalize_simple(s):
    if not s:
        return ''
    import unicodedata
    n = unicodedata.normalize('NFD', s)
    n = ''.join(ch for ch in n if unicodedata.category(ch) != 'Mn')
    return n.lower().replace('ς', 'σ').replace('῾', '').replace('᾿', '').strip()

existing_by_norm = {}
for item in dict_list:
    key = normalize_simple(item['word'])
    existing_by_norm[key] = item

# List of Athenaze entries to add or update
athenaze_raw = [
    # 1. İSİMLER (Nouns)
    {
        "word": "ἀγρός",
        "lemma": "ὁ ἀγρός, τοῦ ἀγροῦ",
        "athenaze_forms": "τὸν ἀγρόν, τοῦ ἀγροῦ, τῷ ἀγρῷ, τοῖς ἀγροῖς",
        "transliteration": "agrós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Tarla, kır, arazi (çoğul: kırsal bölge, taşra)"],
        "meanings_en": ["field, countryside, land"],
        "etymology": "Hint-Avrupa kökü *h₂éǵros (tarla, otlak; krş. Latince ager/agri, İngilizce acre).",
        "derivatives": ["tarım bilimi (agronomi), agronom, agrobiyoloji"],
        "examples": [{"greek": "οἰκεῖ δὲ ὁ Δικαιόπολις οὐκ ἐν ταῖς Ἀθήναις ἀλλ' ἐν τοῖς ἀγροῖς.", "tr": "Dikaiopolis Atina'da değil, kırsalda (tarlalarda) yaşar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ἄνθρωπος",
        "athenaze_forms": "οἱ ἄνθρωποι",
        "lemma": "ὁ ἄνθρωπος, -ου",
        "category": "Günlük Yaşam"
    },
    {
        "word": "ἄροτος",
        "lemma": "ὁ ἄροτος, τοῦ ἀρότου",
        "athenaze_forms": "ὁ ἄροτος",
        "transliteration": "árotos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çift sürme, toprağı sabanla sürme eylemi", "Ekin zamanı"],
        "meanings_en": ["ploughing, tilling of the soil"],
        "etymology": "ἀρόω (çift sürmek) fiilinden türemiştir.",
        "derivatives": ["arable (tarıma elverişli toprak)"],
        "examples": [{"greek": "χαλεπός ἐστιν ὁ ἄροτος.", "tr": "Çift sürmek zordur.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἄροτρον",
        "lemma": "τὸ ἄροτρον, τοῦ ἀρότρου",
        "athenaze_forms": "τὸ ἄροτρον",
        "transliteration": "árotron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Saban, pulluk"],
        "meanings_en": ["plough"],
        "etymology": "Hint-Avrupa kökü *h₂orh₃trom (saban; krş. Latince aratrum).",
        "derivatives": [],
        "examples": [{"greek": "ἕλκουσι δὲ τὸ ἄροτρον οἱ βόες.", "tr": "Öküzler sabanı çekerler.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "αὐτουργός",
        "lemma": "ὁ αὐτουργός, τοῦ αὐτουργοῦ",
        "athenaze_forms": "ὁ αὐτουργός",
        "transliteration": "autourgós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Kendi toprağını bizzat işleyen çiftçi, kendi emeğiyle geçinen köylü"],
        "meanings_en": ["one who works his own land, smallholder farmer"],
        "etymology": "αὐτός (kendi) + ἔργον (iş, emek). 'Kendi işini kendi yapan' demektir.",
        "derivatives": [],
        "examples": [{"greek": "ὁ γὰρ Δικαιόπολις αὐτουργός ἐστιν.", "tr": "Çünkü Dikaiopolis kendi toprağını işleyen bir çiftçidir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "βίος",
        "category": "Felsefe"
    },
    {
        "word": "βοῦς",
        "lemma": "ὁ / ἡ βοῦς, βοός",
        "athenaze_forms": "τὸν βοῦν, οἱ βόες, ὦ βόες, τοὺς βοῦς",
        "transliteration": "boûs",
        "partOfSpeech": "İsim (Ortak Cinsiyet, Düzensiz 3. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Öküz, sığır, inek"],
        "meanings_en": ["ox, bull, cow, cattle"],
        "etymology": "Hint-Avrupa kökü *gʷōws (sığır/inek; krş. Latince bos/bovis, İngilizce cow, Sanskritçe go).",
        "derivatives": ["bostan (Persçe üzerinden akraba kök), bukolik (çoban şiiri)", "Bosphorus / Boğaziçi (Boos-poros = İnek/Öküz Geçidi!)"],
        "examples": [{"greek": "ἐλαύνει τοὺς βοῦς εἰς τὸν ἀγρόν.", "tr": "Öküzleri tarlaya doğru sürer.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "δεῖπνον",
        "lemma": "τὸ δεῖπνον, τοῦ δείπνου",
        "athenaze_forms": "τὸ δεῖπνον",
        "transliteration": "deîpnon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Akşam yemeği, ana yemek, ziyafet"],
        "meanings_en": ["dinner, evening meal"],
        "etymology": "Hint-Avrupa kökü *dap- (pay etmek, yemek sunmak; krş. Latince daps).",
        "derivatives": ["deipnosofist (sofra bilgesi)"],
        "examples": [{"greek": "καὶ μετὰ τὸ δεῖπνον καθεύδει.", "tr": "Ve yemekten sonra uyur.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "δένδρον",
        "lemma": "τὸ δένδρον, τοῦ δένδρου",
        "athenaze_forms": "τῷ δένδρῳ",
        "transliteration": "déndron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Ağaç, fidan"],
        "meanings_en": ["tree"],
        "etymology": "Hint-Avrupa kökü *deru- (ağaç, odun; krş. İngilizce tree).",
        "derivatives": ["dendroloji (ağaç bilimi), dendrokronoloji (ağaç halkalarıyla tarihleme)", "rododendron (orman gülü)"],
        "examples": [{"greek": "ἡσυχάζει ὑπὸ τῷ δένδρῳ.", "tr": "Ağacın altında dinlenir.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "δεσπότης",
        "lemma": "ὁ δεσπότης, τοῦ δεσπότου",
        "athenaze_forms": "ὦ δέσποτα",
        "transliteration": "despótēs",
        "partOfSpeech": "İsim (Eril, 1. Çekim - ης)",
        "category": "Politika & Toplum",
        "meanings_tr": ["Efendi, ev sahibi, mevla, hükümdar"],
        "meanings_en": ["master, lord of the house, despot"],
        "etymology": "Hint-Avrupa kökü *dems-pótis (evin efendisi; krş. Latince dominus, Sanskritçe dampati).",
        "derivatives": ["despot, despotizm, despotik"],
        "examples": [{"greek": "χαλεπός ἐστιν ὁ δεσπότης.", "tr": "Efendi çok huysuzdur / serttir.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "δοῦλος",
        "athenaze_forms": "τὸν δοῦλον",
        "category": "Politika & Toplum"
    },
    {
        "word": "ἕρμα",
        "lemma": "τὸ ἕρμα, τοῦ ἕρματος",
        "athenaze_forms": "τὸ ἕρμα",
        "transliteration": "hérma",
        "partOfSpeech": "İsim (Nötr, 3. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Taş yığını, tarla temizlenirken toplanan taş tepeciği", "Gemi safrası", "Hermes kültüyle ilişkili yol sınırı taşları"],
        "meanings_en": ["heap of stones, sunken rock, ballast"],
        "etymology": "Hermes (Ἑρμῆς) tanrı adıyla yakından akrabadır.",
        "derivatives": [],
        "examples": [{"greek": "αἴρουσι τοὺς λίθους καὶ ἕρμα ποιοῦσιν.", "tr": "Taşları kaldırırlar ve bir taş yığını yaparlar.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ζυγόν",
        "lemma": "τὸ ζυγόν, τοῦ ζυγοῦ",
        "athenaze_forms": "τὸ ζυγόν",
        "transliteration": "zygón",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Boyunduruk, koşum takımı", "Terazi kefesi, çifte bağ"],
        "meanings_en": ["yoke (for oxen), crossbar, balance"],
        "etymology": "Hint-Avrupa kökü *yugóm (birbirine bağlamak; krş. Latince iugum, İngilizce yoke, Sanskritçe yoga).",
        "derivatives": ["zigot (döllenmiş yumurta / birleşen hücre)"],
        "examples": [{"greek": "προσάπτει τὸ ζυγὸν τοῖς βουσίν.", "tr": "Boyunduruğu öküzlere bağlar.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἥλιος",
        "category": "Doğa & Bilim"
    },
    {
        "word": "κέντρον",
        "lemma": "τὸ κέντρον, τοῦ κέντρου",
        "athenaze_forms": "τὸ κέντρον",
        "transliteration": "kéntron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Üvendire (öküzleri dürtmek için ucu sivri değnek)", "Diken, sokucu iğne (arı/akrep)", "Dairenin merkezi (pergelin sabit sivri ayağının bastığı nokta!)"],
        "meanings_en": ["goad (for driving oxen), sharp point, center of a circle"],
        "etymology": "κεντέω (dürtmek, batırmak) fiilinden türemiştir.",
        "derivatives": ["merkez (center, centre, santral)", "merkezcil, santrifüj"],
        "examples": [{"greek": "τῷ κέντρῳ κεντεῖ τοὺς βοῦς.", "tr": "Üvendire ile öküzleri dürter.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "κλῆρος",
        "lemma": "ὁ κλῆρος, τοῦ κλήρου",
        "athenaze_forms": "τὸν κλῆρον",
        "transliteration": "klêros",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çiftlik, tarla payı, kurayla düşen arazi hissesi", "Kura, talih"],
        "meanings_en": ["lot, allotment of land, farm, portion"],
        "etymology": "Kura çekme taşı kökünden.",
        "derivatives": ["klerik (din adamı / Tanrı payı alan kleros)", "kleriklik"],
        "examples": [{"greek": "γεωργεῖ τὸν κλῆρον.", "tr": "Çiftliğini (toprağını) işler.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "λίθος",
        "athenaze_forms": "τὸν λίθον, οἱ λίθοι, τοὺς λίθους",
        "category": "Doğa & Bilim"
    },
    {
        "word": "μαστιgίας",
        "word": "μαστιγίας",
        "lemma": "ὁ μαστιγίας, τοῦ μαστιγίου",
        "athenaze_forms": "ὦ μαστιgία / ὦ μαστιγία",
        "transliteration": "mastigías",
        "partOfSpeech": "İsim (Eril, 1. Çekim)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Kırbaçlanmayı hak eden haydut, tembel köle, alçak kerata (komedya ve günlük konuşma hakareti)"],
        "meanings_en": ["rogue, scoundrel (one who deserves a whipping)"],
        "etymology": "μάστιξ (mástix = kırbaç) kelimesinden türetilmiştir.",
        "derivatives": [],
        "examples": [{"greek": "τί ποιεῖς, ὦ μαστιγία; οὐ κάμνεις;", "tr": "Ne yapıyorsun bre kerata? Çalışmıyor musun?", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "μόσχος",
        "lemma": "ὁ μόσχος, τοῦ μόσχου",
        "athenaze_forms": "τὸν μόσχον",
        "transliteration": "móschos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Buzağı, dana, yavru sığır", "Genç sürgün, fidan"],
        "meanings_en": ["calf, young bull, shoot"],
        "etymology": "Hint-Avrupa kökenli taze yavru kelimesi.",
        "derivatives": ["Moskofor (Moschophoros = Atina Akropolis Müzesindeki ünlü 'Buzağı Taşıyan Adam' heykeli)"],
        "examples": [{"greek": "ὁ μόσχος ἐν τῷ ἀγρῷ βαδίζει.", "tr": "Buzağı tarlada yürür.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "οἶκος",
        "athenaze_forms": "τὸν οἶκον, τοῦ οἴκου, τῷ οἴκῳ",
        "category": "Günlük Yaşam"
    },
    {
        "word": "παῖς",
        "athenaze_forms": "ὦ παῖ",
        "category": "Günlük Yaşam"
    },
    {
        "word": "πατήρ",
        "athenaze_forms": "ὦ πάτερ, τὸν πατέρα",
        "category": "Günlük Yaşam"
    },
    {
        "word": "πόνος",
        "lemma": "ὁ πόνος, τοῦ πόνου",
        "athenaze_forms": "ὁ πόνος",
        "transliteration": "pónos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["İş, emek, zahmet, meşakkat, ağır çalışma"],
        "meanings_en": ["toil, hard work, labor, trouble"],
        "etymology": "πένομαι (çalışmak, yoksul olmak) kökünden.",
        "derivatives": [],
        "examples": [{"greek": "μακρός ἐστιν ὁ πόνος καὶ χαλεπός.", "tr": "İş (zahmet) uzun ve çetindir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "πούς",
        "athenaze_forms": "τὸν πόδα, τοῦ ποδός",
        "category": "Doğa & Bilim"
    },
    {
        "word": "σῖτος",
        "lemma": "ὁ σῖτος, τοῦ σίτου (çoğul nötr: τὰ σῖτα)",
        "athenaze_forms": "τὸν σῖτον",
        "transliteration": "sîtos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Tahıl, buğday, arpa", "Yiyecek, ekmek, gıda"],
        "meanings_en": ["grain, wheat, food, bread"],
        "etymology": "Ön-Grekçe Akdeniz kökenli tarım kelimesidir.",
        "derivatives": ["parazit (para + sitos = başkasının ekmeğinden yiyen!)"],
        "examples": [{"greek": "πολὺν σῖτον παρέχει ὁ ἀγρός.", "tr": "Tarla bol tahıl sağlar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "σπέρμα",
        "lemma": "τὸ σπέρμα, τοῦ σπέρματος",
        "athenaze_forms": "τὸ σπέρμα",
        "transliteration": "spérma",
        "partOfSpeech": "İsim (Nötr, 3. Çekim)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Tohum, dane", "Döl, soy, zürriyet"],
        "meanings_en": ["seed, sowing, origin, offspring"],
        "etymology": "σπείρω (tohum ekmek, saçmak) fiilinden türemiştir.",
        "derivatives": ["sperm, spermatozoit, anjiyosperm, jimnosperm (açık tohumlu bitkiler)"],
        "examples": [{"greek": "σπείρει τὸ σπέρμα εἰς τὴν γῆν.", "tr": "Tohumu toprağa eker.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "υἱός",
        "lemma": "ὁ υἱός, τοῦ υἱοῦ",
        "athenaze_forms": "ὁ υἱός",
        "transliteration": "huiós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Oğul, erkek evlat"],
        "meanings_en": ["son, child"],
        "etymology": "Hint-Avrupa kökü *suHyús (oğul; krş. Sanskritçe sunu, İngilizce son).",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Φίλιππος υἱός ἐστι τοῦ Δικαιοπόλιδος.", "tr": "Philippos ise Dikaiopolis'in oğludur.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "χρόνος",
        "athenaze_forms": "τὸν χρόνον",
        "category": "Doğa & Bilim"
    },

    # 2. ÖZEL İSİMLER VE SIFATLAR (Proper Names)
    {
        "word": "Ἀθηναῖος",
        "lemma": "Ἀθηναῖος, -α, -ον",
        "athenaze_forms": "Ἀθηναῖος",
        "transliteration": "Athēnaîos",
        "partOfSpeech": "Özel Sıfat / İsim",
        "category": "Özel İsimler",
        "meanings_tr": ["Atinalı, Atina yurttaşı"],
        "meanings_en": ["Athenian"],
        "etymology": "Ἀθῆναι (Atina kenti) adından.",
        "derivatives": ["Atinalı"],
        "examples": [{"greek": "ὁ Δικαιόπολις Ἀθηναῖός ἐστιν.", "tr": "Dikaiopolis Atinalıdır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "Ἀθῆναι",
        "lemma": "αἱ Ἀθῆναι, τῶν Ἀθηνῶν",
        "athenaze_forms": "ταῖς Ἀθήναις",
        "transliteration": "Athênai",
        "partOfSpeech": "Özel İsim (Dişil Çoğul)",
        "category": "Özel İsimler",
        "meanings_tr": ["Atina (Antik Atina kenti, daima çoğul kullanılır)"],
        "meanings_en": ["Athens"],
        "etymology": "Tanrıça Athena (Ἀθηνᾶ) adından türemiştir.",
        "derivatives": ["Atina"],
        "examples": [{"greek": "οὐκ οἰκεῖ ἐν ταῖς Ἀθήναις.", "tr": "Atina'da yaşamaz.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "Δημήτηρ",
        "lemma": "ἡ Δημήτηρ, Δήμητρος",
        "athenaze_forms": "ὦ Δήμητερ, τὴν Δήμητρα",
        "transliteration": "Dēmḗtēr",
        "partOfSpeech": "Özel İsim (Dişil, 3. Çekim)",
        "category": "Mitoloji & İnanç",
        "meanings_tr": ["Demeter (Bereket, tarım, tahıl ve hasat tanrıçası; Persephone'nin annesi)"],
        "meanings_en": ["Demeter (goddess of agriculture and harvest)"],
        "etymology": "δᾶ (Toprak) + μήτηρ (Anne). 'Toprak Ana' demektir.",
        "derivatives": ["Dimitri, Demet"],
        "examples": [{"greek": "ἵλεως ἴσθι, ὦ Δήμητερ, καὶ πλήθυνε τὸν σῖτον.", "tr": "Lütfet ey Demeter, ve tahılımızı bereketlendir!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "Δικαιόπολις",
        "lemma": "ὁ Δικαιόπολις, -ιδος",
        "athenaze_forms": "τοῦ Δικαιοπόλιδος",
        "transliteration": "Dikaiópolis",
        "partOfSpeech": "Özel İsim (Eril)",
        "category": "Özel İsimler",
        "meanings_tr": ["Dikaiopolis (Athenaze kitabının dürüst ve çalışkan çiftçi ana karakteri; kelime anlamı: 'Adil Şehirli')"],
        "meanings_en": ["Dikaiopolis ('Just City' - main character of Athenaze)"],
        "etymology": "δίκαιος (adil) + πόλις (şehir).",
        "derivatives": [],
        "examples": [{"greek": "ὁ Δικαιόπολις ἐν τῷ ἀγρῷ πονεῖ.", "tr": "Dikaiopolis tarlada çalışır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "Ζεύς",
        "lemma": "ὁ Ζεύς, Διός",
        "athenaze_forms": "ὦ Ζεῦ",
        "transliteration": "Zeús",
        "partOfSpeech": "Özel İsim (Eril, Düzensiz 3. Çekim)",
        "category": "Mitoloji & İnanç",
        "meanings_tr": ["Zeus (Olympos tanrılarının kralı, göklerin ve şimşeklerin efendisi)"],
        "meanings_en": ["Zeus (king of the gods)"],
        "etymology": "Hint-Avrupa kökü *dyēws (parlak gökyüzü; krş. Latince Iuppiter, Sanskritçe Dyaus).",
        "derivatives": ["Jüpiter (Iovis pater)"],
        "examples": [{"greek": "ὦ Ζεῦ, βοήθει μοι.", "tr": "Ey Zeus, bana yardım et!", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "Ξανθίας",
        "lemma": "ὁ Ξανθίας, τοῦ Ξανθίου",
        "athenaze_forms": "ὦ Ξανθία, τὸν Ξανθίαν",
        "transliteration": "Xanthías",
        "partOfSpeech": "Özel İsim (Eril)",
        "category": "Özel İsimler",
        "meanings_tr": ["Ksanthias (Dikaiopolis'in kölesinin adı; sarışın/kızıl saçlı manasında)"],
        "meanings_en": ["Xanthias (slave's name, lit. 'blonde/redhead')"],
        "etymology": "ξανθός (sarı, sarışın) kelimesinden.",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Ξανθίας δοῦλός ἐστιν ἀργός.", "tr": "Ksanthias ise tembel bir köledir.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "Φίλιππος",
        "lemma": "ὁ Φίλιππος, τοῦ Φιλίππου",
        "athenaze_forms": "ὁ Φίλιππος",
        "transliteration": "Phílippos",
        "partOfSpeech": "Özel İsim (Eril)",
        "category": "Özel İsimler",
        "meanings_tr": ["Philippos (Dikaiopolis'in oğlu; kelime anlamı: 'At seven / at dostu')"],
        "meanings_en": ["Philip (Dikaiopolis's son, lit. 'lover of horses')"],
        "etymology": "φίλος (seven) + ἵππος (at).",
        "derivatives": ["Filip, Philip"],
        "examples": [{"greek": "ὁ Φίλιππος βαδίζει πρὸς τὸν πατέρα.", "tr": "Philippos babasına doğru yürür.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },

    # 3. FİİLLER (Verbs)
    {
        "word": "ἄγω",
        "lemma": "ἄγω",
        "athenaze_forms": "ἄγει",
        "transliteration": "ágō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Götürmek, sevketmek, sürmek, yönlendirmek", "Geçirmek (zaman)"],
        "meanings_en": ["to lead, take, drive, conduct"],
        "etymology": "Hint-Avrupa kökü *h₂eǵ- (sürmek, gütmek; krş. Latince agere).",
        "derivatives": ["pedagog (çocuk yönlendiren), demagog (halk avcısı/sürücüsü)"],
        "examples": [{"greek": "ἄγει τοὺς βοῦς εἰς τὸν ἀγρόν.", "tr": "Öküzleri tarlaya sürer.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "αἴρω",
        "lemma": "αἴρω",
        "athenaze_forms": "αἴρει, αἴρουσι, αἶρε, αἴρειν",
        "transliteration": "aírō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Kaldırmak, yukarı çekmek, taşımak"],
        "meanings_en": ["to lift, raise, take up"],
        "etymology": "ἀείρω kökünden türemiştir.",
        "derivatives": [],
        "examples": [{"greek": "αἶρε τὸν λίθον, ὦ Ξανθία.", "tr": "Taşı kaldır ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ἀκολουθέω",
        "lemma": "ἀκολουθέω, ἀκολουθῶ (+ dativ)",
        "athenaze_forms": "ἀκολουθεῖ",
        "transliteration": "akolouthéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Takip etmek, izlemek, ardından gitmek, boyun eğmek"],
        "meanings_en": ["to follow, accompany (+ dat)"],
        "etymology": "ἀ- (birlikte) + κέλευθος (yol). 'Aynı yolda yürümek' demektir.",
        "derivatives": ["akolit (kilise çömezi / rahibi takip eden)"],
        "examples": [{"greek": "ὁ δοῦλος ἀκολουθεῖ τῷ δεσπότῃ.", "tr": "Köle efendisini takip eder.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἀρόω",
        "lemma": "ἀρόω, ἀρῶ",
        "athenaze_forms": "ἀροῦτε, ἀροῦν",
        "transliteration": "aróō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çift sürmek, toprağı sabanla sürmek"],
        "meanings_en": ["to plow, till"],
        "etymology": "Hint-Avrupa kökü *h₂orh₃- (sürmek; krş. Latince arare).",
        "derivatives": [],
        "examples": [{"greek": "ἀροῦσι τὸν ἀγρόν.", "tr": "Tarlayı sürerler.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "βαδίζω",
        "lemma": "βαδίζω",
        "athenaze_forms": "βαδίζει, βαδίζουσιν, βάδιζε",
        "transliteration": "badízō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Yürümek, adım adım gitmek, yol almak"],
        "meanings_en": ["to walk, go, step"],
        "etymology": "βαίνω ve βάδος (adım) kökünden.",
        "derivatives": [],
        "examples": [{"greek": "βαδίζει πρὸς τὸν οἶκον.", "tr": "Eve doğru yürür.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "βαίνω",
        "athenaze_forms": "βαίνει",
        "category": "Temel Fiiller"
    },
    {
        "word": "βλέπω",
        "lemma": "βλέπω",
        "athenaze_forms": "βλέπει",
        "transliteration": "blépō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Bakmak, görmek, göz gezdirmek"],
        "meanings_en": ["to look, see, look at"],
        "etymology": "Ön-Grekçe kök.",
        "derivatives": [],
        "examples": [{"greek": "βλέπει πρὸς τὸν ἥλιον.", "tr": "Güneşe doğru bakar.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "γεωργέω",
        "lemma": "γεωργέω, γεωργῶ",
        "athenaze_forms": "γεωργεῖ",
        "transliteration": "geōrgéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çiftçilik yapmak, toprağı işlemek"],
        "meanings_en": ["to farm, cultivate the earth"],
        "etymology": "γῆ (toprak) + ἔργον (iş). 'Toprakla uğraşmak' demektir.",
        "derivatives": ["George / Yorgi (çiftçi ismi!)"],
        "examples": [{"greek": "γεωργεῖ τὸν κλῆρον καὶ πονεῖ ἐν τοῖς ἀγροῖς.", "tr": "Toprağını işler ve tarlalarda emek verir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "δειπνέω",
        "lemma": "δειπνέω, δειπνῶ",
        "athenaze_forms": "δειπνοῦσιν, δείπνει",
        "transliteration": "deipnéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Yemek yemek, akşam yemeği yemek"],
        "meanings_en": ["to dine, eat dinner"],
        "etymology": "δεῖπνον (yemek) isminden.",
        "derivatives": [],
        "examples": [{"greek": "ἐν τῷ οἴκῳ δειπνοῦσιν.", "tr": "Evde akşam yemeği yerler.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "εἰμί",
        "athenaze_forms": "εἶ, ἐστί[ν], εἰσί[ν], ἴσθι",
        "category": "Temel Fiiller"
    },
    {
        "word": "εἰσάγω",
        "lemma": "εἰσάγω",
        "athenaze_forms": "εἰσάγει",
        "transliteration": "eiságō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["İçeri götürmek, içeri sokmak, içeri sevk etmek"],
        "meanings_en": ["to lead in, bring in"],
        "etymology": "εἰς (içine) + ἄγω (götürmek).",
        "derivatives": [],
        "examples": [{"greek": "εἰσάγει τοὺς βοῦς εἰς τὴν αὐλήν.", "tr": "Öküzleri avlunun içine sokar.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "εἰσβαίνω",
        "lemma": "εἰσβαίνω",
        "athenaze_forms": "εἰσβαίνει",
        "transliteration": "eisbaínō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["İçeri girmek, içeri adım atmak"],
        "meanings_en": ["to enter, step into"],
        "etymology": "εἰς (içine) + βαίνω (adım atmak).",
        "derivatives": [],
        "examples": [{"greek": "εἰσβαίνει εἰς τὸν οἶκον.", "tr": "Evin içine girer.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "ἐκβαίνω",
        "lemma": "ἐκβαίνω",
        "athenaze_forms": "ἐκβαίνει",
        "transliteration": "ekbaínō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Dışarı çıkmak, dışarı adım atmak"],
        "meanings_en": ["to step out, come out"],
        "etymology": "ἐκ (dışarı) + βαίνω (adım atmak).",
        "derivatives": [],
        "examples": [{"greek": "ἐκβαίνει ἐκ τοῦ οἴκου.", "tr": "Evden dışarı çıkar.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἐκφέρω",
        "lemma": "ἐκφέρω",
        "athenaze_forms": "ἐκφέρουσιν, ἔκφερε, ἐκφέρειν",
        "transliteration": "ekphérō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Dışarı taşımak, dışarı çıkarmak, defnetmek"],
        "meanings_en": ["to carry out, bring forth"],
        "etymology": "ἐκ (dışarı) + φέρω (taşımak).",
        "derivatives": [],
        "examples": [{"greek": "ἔκφερε τὸ ἄροtron, ὦ Ξανθία.", "tr": "Sabanı dışarı çıkar ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἐλαύνω",
        "lemma": "ἐλαύνω",
        "athenaze_forms": "ἐλαύνει",
        "transliteration": "elaúnō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Sürmek, gütmek, hızla sevketmek, kürek çekmek"],
        "meanings_en": ["to drive, drive on, strike"],
        "etymology": "Hint-Avrupa kökü *el- (hareket ettirmek).",
        "derivatives": ["elastik"],
        "examples": [{"greek": "ἐλαύνει τοὺς βοῦς.", "tr": "Öküzleri sürer.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἕλκω",
        "lemma": "ἕλκω",
        "athenaze_forms": "ἕλκουσι[ν], ἕλκετε",
        "transliteration": "hélkō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Çekmek, sürüklemek, asılmak"],
        "meanings_en": ["to drag, draw, pull"],
        "etymology": "Hint-Avrupa kökü *selk- (çekmek; krş. Latince sulcus = saban izi).",
        "derivatives": [],
        "examples": [{"greek": "ἕλκετε, ὦ βόες, ἕλκετε τὸ ἄροτρον.", "tr": "Çekin ey öküzler, sabanı çekin!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἐμποδίζω",
        "lemma": "ἐμποδίζω",
        "athenaze_forms": "ἐμποδίζει",
        "transliteration": "empodízō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Engel olmak, ayak bağı olmak, önünü kesmek"],
        "meanings_en": ["to entangle the feet, hinder, impede"],
        "etymology": "ἐν (içinde) + πούς / ποδός (ayak). 'Ayağına dolanmak / köstek olmak' demektir.",
        "derivatives": ["empedans (elektrikte engel/direnç)"],
        "examples": [{"greek": "οἱ λίθοι ἐμποδίζουσι τῷ ἀρότρῳ.", "tr": "Taşlar sabana engel olur.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ἐπαίρω",
        "lemma": "ἐπαίρω",
        "athenaze_forms": "ἐπαίρει (ἐπαίρει ἑαυτόν)",
        "transliteration": "epaírō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Yukarı kaldırmak (ἐπαίρει ἑαυτόν: kendini kaldırmak, ayağa kalkmak)"],
        "meanings_en": ["to lift up, raise (epairei heauton: to get up)"],
        "etymology": "ἐπί (üzerine) + αἴρω (kaldırmak).",
        "derivatives": [],
        "examples": [{"greek": "μόλις ἐπαίρει ἑαυτόν.", "tr": "Kendini güçlükle ayağa kaldırır.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἔρχομαι",
        "lemma": "ἔρχομαι",
        "athenaze_forms": "ἐλθέ",
        "transliteration": "érchomai",
        "partOfSpeech": "Düzensiz Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Gelmek, gitmek, varmak (emir: ἐλθέ = gel!)"],
        "meanings_en": ["to come, go (imperative: elthe = come!)"],
        "etymology": "Polirizik fiil: praesens ἔρχομαι, aorist ἦλθον (kök: ἐλθ-).",
        "derivatives": [],
        "examples": [{"greek": "ἐλθὲ δεῦρο, ὦ δοῦλε.", "tr": "Buraya gel ey köle!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἡσυχάζω",
        "lemma": "ἡσυχάζω",
        "athenaze_forms": "ἡσυχάζει",
        "transliteration": "hēsycházō",
        "partOfSpeech": "Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Dinlenmek, istirahat etmek, sessizce durmak"],
        "meanings_en": ["to rest, be quiet, keep still"],
        "etymology": "ἥσυχος (sessiz, sakin) sıfatından.",
        "derivatives": ["hesychasm (Hristiyan mistisizminde sessizlik/iç huzur namazı)"],
        "examples": [{"greek": "ἡσυχάζει ὑπὸ τῷ δένδρῳ.", "tr": "Ağacın altında dinlenir.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "καθεύδω",
        "lemma": "καθεύδω",
        "athenaze_forms": "καθεύδεις, καθεύδει, κάθευδε",
        "transliteration": "katheúdō",
        "partOfSpeech": "Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Uyumak, uykuya dalmak, yatmak"],
        "meanings_en": ["to sleep, lie down to sleep"],
        "etymology": "κατά (aşağı) + εὕδω (uyumak).",
        "derivatives": [],
        "examples": [{"greek": "σὺ δὲ καθεύδεις; οὐ πονεῖς;", "tr": "Sen uyuyor musun? Çalışmıyor musun?", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "καθίζω",
        "lemma": "καθίζω",
        "athenaze_forms": "καθίζει, καθίζουσιν, κάθιζε",
        "transliteration": "kathízō",
        "partOfSpeech": "Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Oturmak, oturtmak, çökmek"],
        "meanings_en": ["to sit down, seat"],
        "etymology": "κατά (aşağı) + ἵζω (oturmak; Hint-Avrupa *sed- / sit).",
        "derivatives": ["katedral (piskoposun makam koltuğu kathedra'dan gelir)"],
        "examples": [{"greek": "καθίζει ὑπὸ τῷ δένδρῳ.", "tr": "Ağacın altına oturur.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "καλέω",
        "lemma": "καλέω, καλῶ",
        "athenaze_forms": "καλεῖ",
        "transliteration": "kaléō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Çağırmak, seslenmek, davet etmek, adlandırmak"],
        "meanings_en": ["to call, summon, name"],
        "etymology": "Hint-Avrupa kökü *kelh₁- (bağırmak, çağırmak; krş. Latince clamare / calare).",
        "derivatives": ["kilise (ek-klesia = çağrılmışlar meclisi)"],
        "examples": [{"greek": "καλεῖ τὸν δοῦλον μέγα βοῶν.", "tr": "Köleyi yüksek sesle bağırarak çağırır.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "κάμνω",
        "lemma": "κάμνω",
        "athenaze_forms": "κάμνει",
        "transliteration": "kámnō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Yorulmak, bitkin düşmek, zahmet çekmek, hastalanmak"],
        "meanings_en": ["to be weary, be tired, work hard"],
        "etymology": "Hint-Avrupa kökü *ḱemh₂- (yorulmak).",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Δικαιόπολις κάμνει.", "tr": "Dikaiopolis ise yorulur.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "καταβάλλω",
        "lemma": "καταβάλλω",
        "athenaze_forms": "καταβάλλει",
        "transliteration": "katabállō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Düşürmek, yere atmak, fırlatıp devirmek"],
        "meanings_en": ["to throw down, drop"],
        "etymology": "κατά (aşağı) + βάλλω (atmak, fırlatmak).",
        "derivatives": [],
        "examples": [{"greek": "καταβάλλει τὸν λίθον χαμαί.", "tr": "Taşı yere düşürür/bırakır.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "καταδύνω",
        "lemma": "καταδύνω",
        "athenaze_forms": "καταδύνει",
        "transliteration": "katadýnō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Batmak, ufukta kaybolmak (güneş ve gök cisimleri için)"],
        "meanings_en": ["to go down, sink, set (of the sun)"],
        "etymology": "κατά (aşağı) + δύνω (dalmak, batmak).",
        "derivatives": [],
        "examples": [{"greek": "καταδύνει ὁ ἥλιος εἰς τὴν θάλατταν.", "tr": "Güneş denize doğru batar.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "κατατρίβω",
        "lemma": "κατατρίβω",
        "athenaze_forms": "κατατρίβει",
        "transliteration": "katatríbō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Yıpratmak, tüketmek, bitkin düşürmek, aşındırmak"],
        "meanings_en": ["to wear down, exhaust, wear out"],
        "etymology": "κατά (iyice) + τρίβω (ovalamak, sürtmek, aşındırmak).",
        "derivatives": [],
        "examples": [{"greek": "ὁ πόνος κατατρίβει τὸν ἄνθρωπον.", "tr": "Zahmetli iş insanı tüketir/yıpratır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "κεντέω",
        "lemma": "κεντέω, κεντῶ",
        "athenaze_forms": "κεντεῖ",
        "transliteration": "kentéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Dürtmek, üvendire ile dürtmek, batırmak"],
        "meanings_en": ["to prick, goad, spur on"],
        "etymology": "κέντρον (üvendire/sivri uç) kelimesiyle aynı kökten.",
        "derivatives": [],
        "examples": [{"greek": "κεντεῖ τοὺς βοῦς τῷ κέντρῳ.", "tr": "Öküzleri üvendire ile dürter.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "λαμβάνω",
        "lemma": "λαμβάνω",
        "athenaze_forms": "λαμβάνει, λάμβανε",
        "transliteration": "lambánō",
        "partOfSpeech": "Düzensiz Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Almak, tutmak, yakalamak, kavramak"],
        "meanings_en": ["to take, grasp, seize, receive"],
        "etymology": "Hint-Avrupa kökü *sleh₂gʷ- (yakalamak).",
        "derivatives": ["dilemma (iki kez tutma / ikilem)", "epilepsi (ani yakalanma)"],
        "examples": [{"greek": "λαμβάνει τὸ ἄροτρον.", "tr": "Sabanı tutar / eline alır.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "λέγω",
        "athenaze_forms": "λέγει",
        "category": "Temel Fiiller"
    },
    {
        "word": "λείπω",
        "lemma": "λείπω",
        "athenaze_forms": "λείπει, λείπουσιν",
        "transliteration": "leípō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Bırakmak, terk etmek, geride bırakmak, eksik olmak"],
        "meanings_en": ["to leave, abandon, forsake"],
        "etymology": "Hint-Avrupa kökü *leymkʷ- (bırakmak; krş. Latince linquere).",
        "derivatives": ["elips (eksik halka), elipsis (üç nokta / sözcük eksiltisi)"],
        "examples": [{"greek": "λείπουσι τὸν ἀγρὸν καὶ οἴκαδε βαδίζουσιν.", "tr": "Tarlayı bırakırlar ve eve doğru yürürler.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "λύω",
        "athenaze_forms": "λύουσι",
        "category": "Temel Fiiller"
    },
    {
        "word": "μένω",
        "lemma": "μένω",
        "athenaze_forms": "μένει, μένουσι[ν], μένε, μένετε",
        "transliteration": "ménō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Kalmak, beklemek, durmak, sebat etmek"],
        "meanings_en": ["to stay, remain, wait"],
        "etymology": "Hint-Avrupa kökü *men- (kalmak; krş. Latince manere / malikane).",
        "derivatives": [],
        "examples": [{"greek": "μένετε, ὦ βόες, μένετε.", "tr": "Durun ey öküzler, bekleyin!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "οἰκέω",
        "lemma": "οἰκέω, οἰκῶ",
        "athenaze_forms": "οἰκεῖ",
        "transliteration": "oikéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Yaşamak, ikamet etmek, oturmak, evi yönetmek"],
        "meanings_en": ["to inhabit, live, dwell"],
        "etymology": "οἶκος (ev) kelimesinden türetilmiştir.",
        "derivatives": ["ekümenopolis (dünya şehri)"],
        "examples": [{"greek": "οἰκεῖ δὲ ὁ Δικαιόπολις ἐν τοῖς ἀγροῖς.", "tr": "Dikaiopolis kırsalda yaşar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "πάρειμι",
        "lemma": "πάρειμι",
        "athenaze_forms": "πάρεστι[ν]",
        "transliteration": "páreimi",
        "partOfSpeech": "Bileşik Yardımcı Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Hazır bulunmak, burada/orada olmak, mevcut olmak"],
        "meanings_en": ["to be present, be near, be here"],
        "etymology": "παρά (yanında) + εἰμί (olmak).",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Ξανθίας οὐ πάρεστιν.", "tr": "Ksanthias ise ortalıkta yoktur (hazır bulunmaz).", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "παρέχω",
        "lemma": "παρέχω",
        "athenaze_forms": "παρέχει",
        "transliteration": "paréchō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Sağlamak, vermek, sunmak, temin etmek"],
        "meanings_en": ["to furnish, provide, supply"],
        "etymology": "παρά (yanında) + ἔχω (tutmak, vermek).",
        "derivatives": [],
        "examples": [{"greek": "πολὺν σῖτον παρέχει ὁ κλῆρος.", "tr": "Çiftlik bol tahıl sağlar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "πίπτω",
        "lemma": "πίπτω",
        "athenaze_forms": "πίπτει",
        "transliteration": "píptō",
        "partOfSpeech": "Düzensiz Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Düşmek, yere serilmek, yıkılmak"],
        "meanings_en": ["to fall, fall down"],
        "etymology": "Hint-Avrupa kökü *peth₂- (uçmak, düşmek; krş. Latince petere).",
        "derivatives": ["semptom (birlikte düşen/gelen belirti)", "asemptomatik"],
        "examples": [{"greek": "πταίει καὶ πίπτει χαμαί.", "tr": "Tökezler ve yere düşer.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "πληθύνω",
        "lemma": "πληθύνω",
        "athenaze_forms": "πλήθυνε",
        "transliteration": "plēthýnō",
        "partOfSpeech": "Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çoğaltmak, bereketlendirmek, artırmak"],
        "meanings_en": ["to increase, multiply"],
        "etymology": "πλῆθος (çokluk, kalabalık) kelimesinden.",
        "derivatives": [],
        "examples": [{"greek": "πλήθυνε τὸν σῖτον, ὦ Δήμητερ.", "tr": "Tahılımızı bereketlendir ey Demeter!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "πονέω",
        "lemma": "πονέω, πονῶ",
        "athenaze_forms": "πονεῖ, πονοῦσιν, πόνει",
        "transliteration": "ponéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Çalışmak, emek vermek, zahmet çekmek, didinmek"],
        "meanings_en": ["to work, toil, suffer hardship"],
        "etymology": "πόνος (emek/zahmet) kelimesinden.",
        "derivatives": [],
        "examples": [{"greek": "ἀεὶ πονεῖ ὁ Δικαιόπολις.", "tr": "Dikaiopolis daima çalışır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "προσάπτω",
        "lemma": "προσάπτω",
        "athenaze_forms": "προσάπτει",
        "transliteration": "prosáptō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Bağlamak, takmak, iliştirmek"],
        "meanings_en": ["to attach, bind to, fasten"],
        "etymology": "πρός (yanına) + ἅπτω (bağlamak, dokunmak).",
        "derivatives": [],
        "examples": [{"greek": "προσάπτει τὸ ἄροτρον τῷ ζυγῷ.", "tr": "Sabanı boyunduruğa bağlar.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "προσχωρέω",
        "lemma": "προσχωρέω, προσχωρῶ (+ dativ)",
        "athenaze_forms": "προσχωρεῖ",
        "transliteration": "proschōréō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Yaklaşmak, -e doğru gitmek, yanına varmak"],
        "meanings_en": ["to approach, come near to (+ dat)"],
        "etymology": "πρός (-e doğru) + χωρέω (ilerlemek, yer açmak).",
        "derivatives": [],
        "examples": [{"greek": "προσχωρεῖ τῷ πατρί.", "tr": "Babasına doğru yaklaşır.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "πταίω",
        "lemma": "πταίω",
        "athenaze_forms": "πταίει",
        "transliteration": "ptaíō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Tökezlemek, ayağı takılmak, sendelemek"],
        "meanings_en": ["to stumble, trip, strike against"],
        "etymology": "Ön-Grekçe kök.",
        "derivatives": [],
        "examples": [{"greek": "πταίει πρὸς λίθον.", "tr": "Taşa çarparak tökezler.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "σκάπτω",
        "lemma": "σκάπτω",
        "athenaze_forms": "σκάπτει, σκάπτε",
        "transliteration": "skáptō",
        "partOfSpeech": "Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Kazmak, çapalamak, toprağı kazıp açmak"],
        "meanings_en": ["to dig, hoe"],
        "etymology": "Hint-Avrupa kökü *skep- (kazmak, yontmak).",
        "derivatives": [],
        "examples": [{"greek": "σκάπτει τοὺς ἀγρούς.", "tr": "Tarlaları kazar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "σπείρω",
        "lemma": "σπείρω",
        "athenaze_forms": "σπείρει, σπεῖρε",
        "transliteration": "speírō",
        "partOfSpeech": "Fiil",
        "category": "Tarım & Doğa",
        "meanings_tr": ["(Tohum) ekmek, tohum saçmak, saçmak"],
        "meanings_en": ["to sow, scatter seed"],
        "etymology": "Hint-Avrupa kökü *sper- (saçmak).",
        "derivatives": ["spor (bitki tohumcuğu), diaspora (toplulukların saçılması)"],
        "examples": [{"greek": "σπεῖρε τὸ σπέρμα, ὦ παῖ.", "tr": "Tohumu ek ey çocuk!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "σπεύδω",
        "lemma": "σπεύδω",
        "athenaze_forms": "σπεύδει, σπεῦδε, σπεύdete",
        "transliteration": "speúdō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Acele etmek, tez davranmak, çabalamak"],
        "meanings_en": ["to hurry, hasten, be eager"],
        "etymology": "Hint-Avrupa kökü *spewd- (acele etmek).",
        "derivatives": [],
        "examples": [{"greek": "σπεῦδε, ὦ Ξανθία.", "tr": "Acele et ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "στενάζω",
        "lemma": "στενάζω",
        "athenaze_forms": "στενάζει",
        "transliteration": "stenázō",
        "partOfSpeech": "Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["İnlemek, iç çekmek, sızlanmak"],
        "meanings_en": ["to groan, sigh, moan"],
        "etymology": "στενός (dar) ve στενάχω kökünden.",
        "derivatives": [],
        "examples": [{"greek": "στενάζει καὶ λέγει· 'φεῦ τοῦ ποδός.'", "tr": "İnler ve der ki: 'Ah ayağım!'", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "συλλαμβάνω",
        "lemma": "συλλαμβάνω (+ dativ)",
        "athenaze_forms": "συλλαμβάνει, συλλάμβανε",
        "transliteration": "syllambánō",
        "partOfSpeech": "Bileşik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Yardım etmek, el atmak, birlikte tutmak, yakalamak"],
        "meanings_en": ["to help, assist (+ dat); to seize, bring together"],
        "etymology": "σύν (birlikte) + λαμβάνω (tutmak). 'Bir işi birlikte tutmak' manasındadır.",
        "derivatives": ["hece (syllabe / seslerin birlikte tutulması)"],
        "examples": [{"greek": "συλλάμβανέ μοι, ὦ Ξανθία.", "tr": "Bana yardım et ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "φέρω",
        "athenaze_forms": "φέρει, φέρουσιν, φέρε, φέρειν",
        "category": "Temel Fiiller"
    },
    {
        "word": "φημί",
        "lemma": "φημί",
        "athenaze_forms": "φησί[ν]",
        "transliteration": "phēmí",
        "partOfSpeech": "Düzensiz Atematik Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Demek, söylemek, iddia etmek, beyan etmek"],
        "meanings_en": ["to say, assert, speak"],
        "etymology": "Hint-Avrupa kökü *bʰeh₂- (konuşmak; krş. Latince fari).",
        "derivatives": ["eufemizm (güzel adlandırma)"],
        "examples": [{"greek": "φησὶν ὅτι χαλεπός ἐστιν ὁ πόνος.", "tr": "Zahmetin çetin olduğunu söyler.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "φιλέω",
        "lemma": "φιλέω, φιλῶ",
        "athenaze_forms": "φιλεῖ",
        "transliteration": "philéō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Temel Fiiller",
        "meanings_tr": ["Sevmek, hoşlanmak, öpmek, adet edinmek"],
        "meanings_en": ["to love, like, be accustomed to"],
        "etymology": "φίλος (dost/sevgili) isminden.",
        "derivatives": ["felsefe (philosophia)"],
        "examples": [{"greek": "φιλεῖ τὸν ἀγρόν.", "tr": "Tarlasını sever.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "φλέγω",
        "lemma": "φλέγω",
        "athenaze_forms": "φλέγει",
        "transliteration": "phlégō",
        "partOfSpeech": "Fiil",
        "category": "Doğa & Bilim",
        "meanings_tr": ["Yakmak, kavurmak, alev alev parlamak"],
        "meanings_en": ["to burn, scorch, blaze"],
        "etymology": "Hint-Avrupa kökü *bʰle-g- (parlamak; krş. Latince flagrare).",
        "derivatives": ["balgam (phlegm / antik tıbbın dört hıltından biri)"],
        "examples": [{"greek": "ὁ ἥλιος φλέγει.", "tr": "Güneş kavurur / yakar.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "φλυαρέω",
        "lemma": "φλυαρέω, φλυαρῶ",
        "athenaze_forms": "φλυάρει",
        "transliteration": "phlyaréō",
        "partOfSpeech": "Büzüşmeli Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Saçmalamak, boş konuşmak, gevezelik etmek"],
        "meanings_en": ["to talk nonsense, play the fool"],
        "etymology": "φλύαρος (geveze, boşboğaz) kelimesinden.",
        "derivatives": [],
        "examples": [{"greek": "μὴ φλυάρει, ὦ Ξανθία.", "tr": "Saçmalama ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "χαίρω",
        "lemma": "χαίρω",
        "athenaze_forms": "χαίρει",
        "transliteration": "chaírō",
        "partOfSpeech": "Fiil",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Sevinmek, mutlu olmak, neşelenmek", "Selamlaşma: χαῖρε = Selam! Esen kal!"],
        "meanings_en": ["to rejoice, be glad; (imperative: chaire = greetings!)"],
        "etymology": "Hint-Avrupa kökü *ǵʰer- (arzu etmek; krş. kharis = lütuf).",
        "derivatives": ["karizma (kharisma = lütuf/çekicilik)"],
        "examples": [{"greek": "χαίρει ὁ Δικαιόπολις.", "tr": "Dikaiopolis sevinir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },

    # 4. SIFATLAR (Adjectives)
    {
        "word": "αἴτιος",
        "lemma": "αἴτιος, -α, -ον",
        "athenaze_forms": "αἴτιος",
        "transliteration": "aítios",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Felsefe",
        "meanings_tr": ["Sorumlu, sebep olan, suçlu, mesul"],
        "meanings_en": ["responsible, blameworthy, cause of (+ gen)"],
        "etymology": "αἰτία (sebep, neden, suçlama) isminden.",
        "derivatives": ["etyoloji (tıpta hastalık nedenleri bilimi)"],
        "examples": [{"greek": "σὺ αἴτιος εἶ τοῦ πόνου.", "tr": "Zahmetin sebebi sensin.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἀνδρεῖος",
        "lemma": "ἀνδρεῖος, -α, -ον",
        "athenaze_forms": "ἀνδρεῖος",
        "transliteration": "andreîos",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Felsefe",
        "meanings_tr": ["Cesur, yiğit, mert, erkeğe yakışır"],
        "meanings_en": ["brave, manly, courageous"],
        "etymology": "ἀνήρ (erkek/er) isminden.",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Δικαιόπολις ἀνδρεῖός ἐστιν.", "tr": "Dikaiopolis ise cesurdur.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ἀνόητος",
        "lemma": "ἀνόητος, -ον",
        "athenaze_forms": "ὦ ἀνόητε",
        "transliteration": "anóētos",
        "partOfSpeech": "Sıfat (2 sonlanışlı)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Akılsız, ahmak, düşüncesiz, aptal"],
        "meanings_en": ["foolish, senseless, unintelligent"],
        "etymology": "ἀ- (olumsuzluk) + νοέω (düşünmek, akıl etmek). 'Aklı olmayan' demektir.",
        "derivatives": [],
        "examples": [{"greek": "μὴ οὕτω ποίει, ὦ ἀνόητε.", "tr": "Öyle yapma ey akılsız!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἄοκνος",
        "lemma": "ἄοκνος, -ον",
        "athenaze_forms": "ἄοκνος",
        "transliteration": "áoknos",
        "partOfSpeech": "Sıfat (2 sonlanışlı)",
        "category": "Tarım & Doğa",
        "meanings_tr": ["Enerjik, gayretli, yorulmak bilmez, tereddütsüz"],
        "meanings_en": ["resolute, energetic, untiring"],
        "etymology": "ἀ- (olumsuzluk) + ὄκνος (tereddüt, üşengeçlik).",
        "derivatives": [],
        "examples": [{"greek": "ἄοκνος γάρ ἐστιν ὁ αὐτουργός.", "tr": "Çünkü çiftçi gayretli ve çalışkandır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ἀπέραντος",
        "lemma": "ἀπέραντος, -ον",
        "athenaze_forms": "ἀπέραντος",
        "transliteration": "apérantos",
        "partOfSpeech": "Sıfat (2 sonlanışlı)",
        "category": "Felsefe",
        "meanings_tr": ["Sonsuz, bitmek tükenmek bilmeyen, sınırsız"],
        "meanings_en": ["endless, boundless, infinite"],
        "etymology": "ἀ- (olumsuzluk) + περαίνω (sona erdirmek, bitirmek).",
        "derivatives": [],
        "examples": [{"greek": "ἀπέραντός ἐστιν ὁ πόνος.", "tr": "İş/zahmet bitmek tükenmek bilmez.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ἀργός",
        "lemma": "ἀργός, -όν",
        "athenaze_forms": "ἀργός",
        "transliteration": "argós",
        "partOfSpeech": "Sıfat (2 sonlanışlı)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Tembel, işsiz, boş duran, atıl"],
        "meanings_en": ["idle, lazy, not working"],
        "etymology": "ἀ- (olumsuzluk) + ἔργον (iş). 'İşsiz, çalışmayan' demektir.",
        "derivatives": ["argon (kimyasal soy gaz = tepkimeye girmeyen tembel gaz!)"],
        "examples": [{"greek": "ὁ δὲ Ξανθίας ἀργός ἐστι δοῦλος.", "tr": "Ksanthias ise tembel bir köledir.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "δυνατός",
        "lemma": "δυνατός, -ή, -όν",
        "athenaze_forms": "δυνατόν",
        "transliteration": "dynatós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Felsefe",
        "meanings_tr": ["Güçlü, muktedir; nötr (δυνατόν): Mümkün, olası"],
        "meanings_en": ["strong, powerful, able; (neut.) possible"],
        "etymology": "δύναμαι (gücü yetmek) fiilinden.",
        "derivatives": ["dinamik, dinamit, hanedan (dynasty)"],
        "examples": [{"greek": "οὐ δυνατόν ἐστιν αἴρειν τὸν λίθον.", "tr": "Taşı kaldırmak mümkün değildir.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ἐλεύθερος",
        "athenaze_forms": "ἐλεύθερος",
        "category": "Politika & Toplum"
    },
    {
        "word": "ἱκανός",
        "lemma": "ἱκανός, -ή, -όν",
        "athenaze_forms": "ἱκανόν",
        "transliteration": "hikanós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Yeterli, kafi, elverişli, yetkin"],
        "meanings_en": ["sufficient, enough, capable"],
        "etymology": "ἱκάνω (ulaşmak, yetmek) fiilinden.",
        "derivatives": [],
        "examples": [{"greek": "ἱκανόν ἐστι τὸ δεῖπνον.", "tr": "Yemek yeterlidir.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "ἵλεως",
        "lemma": "ἵλεως, -ων (Attik 2. çekim)",
        "athenaze_forms": "ἵλεως",
        "transliteration": "híleōs",
        "partOfSpeech": "Sıfat (Attik Çekim)",
        "category": "Mitoloji & İnanç",
        "meanings_tr": ["Lütfeden, merhametli, inayeti bol, esirgeyen"],
        "meanings_en": ["propitious, gracious, merciful"],
        "etymology": "Dua ve yakarışlarda tanrılara hitaben kullanılır.",
        "derivatives": [],
        "examples": [{"greek": "ἵλεως ἴσθι, ὦ Δήμητερ.", "tr": "Lütfet / merhametli ol ey Demeter!", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "ἰσχυρός",
        "lemma": "ἰσχυρός, -ά, -όν",
        "athenaze_forms": "ἰσχυρός",
        "transliteration": "ischyrós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Doğa & Bilim",
        "meanings_tr": ["Güçlü, kuvvetli, sağlam, zorlu"],
        "meanings_en": ["strong, mighty, powerful"],
        "etymology": "ἰσχύς (güç, kuvvet) isminden.",
        "derivatives": [],
        "examples": [{"greek": "ὁ δὲ Δικαιόπολις ἰσχυρός ἐστιν.", "tr": "Dikaiopolis ise kuvvetlidir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "καλός",
        "athenaze_forms": "καλός",
        "category": "Sıfatlar & Zarflar"
    },
    {
        "word": "κατάρατος",
        "lemma": "κατάρατος, -ον",
        "athenaze_forms": "ὦ κατάρατε",
        "transliteration": "katáratos",
        "partOfSpeech": "Sıfat (2 sonlanışlı)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Lanetli, kahrolası, melun"],
        "meanings_en": ["accursed, abominable"],
        "etymology": "κατά (üzerine) + ἀράομαι (beddua etmek).",
        "derivatives": [],
        "examples": [{"greek": "ἐλθὲ δεῦρο, ὦ κατάρατε δοῦλε.", "tr": "Buraya gel ey lanet olası köle!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "μακρός",
        "lemma": "μακρός, -ά, -όν",
        "athenaze_forms": "μακρός",
        "transliteration": "makrós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Uzun, büyük, geniş, vakit alan"],
        "meanings_en": ["long, large, distant"],
        "etymology": "Hint-Avrupa kökü *mak- (uzun; krş. Latince macer).",
        "derivatives": ["makro (makroekonomi, makromolekül, makrokozmos)"],
        "examples": [{"greek": "μακρός ἐστιν ὁ πόνος.", "tr": "İş uzundur.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "μέγας",
        "athenaze_forms": "μέγαν",
        "category": "Sıfatlar & Zarflar"
    },
    {
        "word": "μικρός",
        "lemma": "μικρός, -ά, -όν",
        "athenaze_forms": "μικρός",
        "transliteration": "mikrós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Küçük, ufak, önemsiz, kısa"],
        "meanings_en": ["small, little, short"],
        "etymology": "Hint-Avrupa kökü *smeyk- (küçük).",
        "derivatives": ["mikro (mikroskop, mikrobiyoloji, mikrofon, mikron)"],
        "examples": [{"greek": "μικρός ἐστιν ὁ κλῆρος.", "tr": "Çiftlik küçüktür.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ὀλίγος",
        "lemma": "ὀλίγος, -η, -ον",
        "athenaze_forms": "ὀλίγου (δι' ὀλίγου)",
        "transliteration": "olígos",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Az, küçük; deyim: δι' ὀλίγου = kısa süre sonra"],
        "meanings_en": ["few, little, small (di' oligou: soon)"],
        "etymology": "Hint-Avrupa kökü *h₃leyg-.",
        "derivatives": ["oligarşi (azınlık yönetimi), oligopol"],
        "examples": [{"greek": "δι' ὀλίγου οἴκαδε βαδίζουσιν.", "tr": "Kısa süre sonra eve doğru yürürler.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "πολύς",
        "lemma": "πολύς, πολλή, πολύ",
        "athenaze_forms": "πολύν, πολλοί",
        "transliteration": "polýs",
        "partOfSpeech": "Düzensiz Sıfat",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Çok, bol, büyük; çoğul (πολλοί): Birçok kimse, halk çoğunluğu"],
        "meanings_en": ["much, many, great"],
        "etymology": "Hint-Avrupa kökü *pleh₁- (dolmak, çok olmak; krş. Latince plus/plenus, İngilizce full).",
        "derivatives": ["poli- ön eki (politeizm, poliglot, poliklinik, polimer)"],
        "examples": [{"greek": "πολὺν σῖτον παρέχει ὁ ἀγρός.", "tr": "Tarla bol tahıl sağlar.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "σκαιός",
        "lemma": "σκαιός, -ά, -όν",
        "athenaze_forms": "σκαιός",
        "transliteration": "skaiós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Günlük Yaşam",
        "meanings_tr": ["Sakar, beceriksiz, hantal; sol (sol taraf uğursuz sayıldığı için)"],
        "meanings_en": ["clumsy, awkward; left, unlucky"],
        "etymology": "Hint-Avrupa kökü *skayw- (sol; krş. Latince scaevus).",
        "derivatives": [],
        "examples": [{"greek": "ὦ σκαιὲ δοῦλε, τί ποιεῖς;", "tr": "Ey sakar köle, ne yapıyorsun?", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "τοσοῦτος",
        "lemma": "τοσοῦτος, τοσαύτη, τοσοῦτο(ν)",
        "athenaze_forms": "τοσούτους",
        "transliteration": "tosoûtos",
        "partOfSpeech": "Gösterme Sıfatı / Zamiri",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Bu kadar büyük, böylesine iri; çoğul: Bu kadar çok"],
        "meanings_en": ["so great, so large; (pl.) so many"],
        "etymology": "τόσος + οὗτος.",
        "derivatives": [],
        "examples": [{"greek": "τοσούτους λίθους ἔχει ὁ ἀγρός.", "tr": "Tarla bu kadar çok taşa sahiptir.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "χαλεπός",
        "lemma": "χαλεπός, -ή, -όν",
        "athenaze_forms": "χαλεπός",
        "transliteration": "chalepós",
        "partOfSpeech": "Sıfat (1. ve 2. Çekim)",
        "category": "Sıfatlar & Zarflar",
        "meanings_tr": ["Zor, çetin, güç, sert, huysuz"],
        "meanings_en": ["difficult, hard, harsh, severe"],
        "etymology": "Klasik Grek ahlakında 'χαλεπὰ τὰ καλά' (güzel şeyler zordur) deyişiyle ünlüdür.",
        "derivatives": [],
        "examples": [{"greek": "χαλεπός ἐστιν ὁ βίος.", "tr": "Hayat zordur / çetindir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },

    # 5. ZAMİRLER VE TANIMLIKLAR (Pronouns & Articles)
    {
        "word": "ὁ, ἡ, τό",
        "lemma": "ὁ, ἡ, τό",
        "athenaze_forms": "τὸν, τοῦ, τῷ, τὴν, οἱ, τοὺς, τοῖς, ταῖς",
        "transliteration": "ho, hē, to",
        "partOfSpeech": "Belirli Tanımlık (Article)",
        "category": "Gramer & Zamirler",
        "meanings_tr": ["Belirli tanımlık (harf-i tarif; İngilizce 'the')"],
        "meanings_en": ["the (definite article)"],
        "etymology": "Hint-Avrupa kökü *so, *seh₂, *tod.",
        "derivatives": [],
        "examples": [{"greek": "ὁ ἄνθρωπος, ἡ γυνή, τὸ δένδρον.", "tr": "Adam, kadın, ağaç.", "author": "Athenaze I"}]
    },
    {
        "word": "ἐγώ",
        "lemma": "ἐγώ",
        "athenaze_forms": "μοι",
        "category": "Gramer & Zamirler"
    },
    {
        "word": "σύ",
        "lemma": "σύ",
        "athenaze_forms": "σύ",
        "category": "Gramer & Zamirler"
    },
    {
        "word": "αὐτός",
        "athenaze_forms": "αὐτόν, αὐτό",
        "category": "Gramer & Zamirler"
    },
    {
        "word": "ἑαυτόν",
        "lemma": "ἑαυτόν, ἑαυτήν, ἑαυτό",
        "athenaze_forms": "ἑαυτόν",
        "transliteration": "heautón",
        "partOfSpeech": "Dönüşlü Zamir (Reflexive)",
        "category": "Gramer & Zamirler",
        "meanings_tr": ["Kendini, kendi kendini (3. şahıs dönüşlü zamiri)"],
        "meanings_en": ["himself, herself, itself"],
        "etymology": "ἕ (kendi) + αὐτός.",
        "derivatives": [],
        "examples": [{"greek": "ἐπαίρει ἑαυτόν.", "tr": "Kendini ayağa kaldırır.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "οὗτος",
        "lemma": "οὗτος, αὕτη, τοῦτο",
        "athenaze_forms": "τούτῳ (ἐν δὲ τούτῳ)",
        "transliteration": "hoûtos",
        "partOfSpeech": "Gösterme Zamiri (Demonstrative)",
        "category": "Gramer & Zamirler",
        "meanings_tr": ["Bu, şu; kalıp: ἐν δὲ τούτῳ = bu sırada, bu esnada"],
        "meanings_en": ["this, these (en de toutōi: meanwhile)"],
        "etymology": "Grekçe temel işaret zamiri.",
        "derivatives": [],
        "examples": [{"greek": "ἐν δὲ τούτῳ προσχωρεῖ ὁ Φίλιππος.", "tr": "Bu sırada ise Philippos yaklaşır.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ὅς",
        "lemma": "ὅς, ἥ, ὅ",
        "athenaze_forms": "ᾧ (ἐν ᾧ)",
        "transliteration": "hós",
        "partOfSpeech": "İlgi Zamiri (Relative Pronoun)",
        "category": "Gramer & Zamirler",
        "meanings_tr": ["Ki o, -en, -diği (ilgi zamiri); kalıp: ἐν ᾧ = -dığı sırada, -iken"],
        "meanings_en": ["who, which, that (en hōi: while)"],
        "etymology": "Hint-Avrupa kökü *yos.",
        "derivatives": [],
        "examples": [{"greek": "ἐν ᾧ δὲ καθεύδει ὁ δοῦλος, προσέρχεται ὁ δεσπότης.", "tr": "Köle uyurken (uyuduğu sırada) efendi gelir.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },

    # 6. ZARFLAR (Adverbs)
    {
        "word": "ἀεί",
        "lemma": "ἀεί",
        "athenaze_forms": "ἀεί",
        "transliteration": "aeí",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Her zaman, daima, sürekli"],
        "meanings_en": ["always, forever, constantly"],
        "etymology": "Hint-Avrupa kökü *h₂eyw- (ömür; krş. Latince aevum / eon).",
        "derivatives": [],
        "examples": [{"greek": "ἀεὶ πονεῖ ὁ Δικαιόπολις.", "tr": "Dikaiopolis daima çalışır.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "ἅμα",
        "lemma": "ἅμα",
        "athenaze_forms": "ἅμα",
        "transliteration": "háma",
        "partOfSpeech": "Zarf / Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Birlikte, aynı anda, beraberce (+ dativ)"],
        "meanings_en": ["at the same time, together with (+ dat)"],
        "etymology": "Hint-Avrupa kökü *sem- (bir, birlikte; krş. İngilizce same).",
        "derivatives": [],
        "examples": [{"greek": "ἅμα δὲ τῷ ἡλίῳ ἐκβαίνει.", "tr": "Güneşle birlikte dışarı çıkar.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "αὖθις",
        "lemma": "αὖθις",
        "athenaze_forms": "αὖθις",
        "transliteration": "aûthis",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Tekrar, yeniden, bir daha, gene"],
        "meanings_en": ["again, back again"],
        "etymology": "αὖ (tekrar) kökünden.",
        "derivatives": [],
        "examples": [{"greek": "αὖθις πονεῖ.", "tr": "Yeniden çalışır.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "βραδέως",
        "lemma": "βραδέως",
        "athenaze_forms": "βραδέως",
        "transliteration": "bradéōs",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Yavaşça, ağır ağır, aheste"],
        "meanings_en": ["slowly"],
        "etymology": "βραδύς (yavaş) sıfatından.",
        "derivatives": ["bradikardi (kalbin yavaş atması)"],
        "examples": [{"greek": "βραδέως βαδίζουσιν οἱ βόες.", "tr": "Öküzler yavaşça yürürler.", "author": "Athenaze I", "work": "Bölüm 2α"}]
    },
    {
        "word": "δεῦρο",
        "lemma": "δεῦρο",
        "athenaze_forms": "δεῦρο",
        "transliteration": "deûro",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Buraya, bu tarafa"],
        "meanings_en": ["hither, here, to this place"],
        "etymology": "Grekçe yönelme zarfı.",
        "derivatives": [],
        "examples": [{"greek": "ἐλθὲ δεῦρο, ὦ Ξανθία.", "tr": "Buraya gel ey Ksanthias!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἔπειτα",
        "lemma": "ἔπειτα",
        "athenaze_forms": "ἔπειτα",
        "transliteration": "épeita",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Sonra, ondan sonra, ardından"],
        "meanings_en": ["then, next, thereupon"],
        "etymology": "ἐπί + εἶτα.",
        "derivatives": [],
        "examples": [{"greek": "ἔπειτα δὲ δειπνεῖ.", "tr": "Ondan sonra ise yemek yer.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "ἔτι",
        "lemma": "ἔτι",
        "athenaze_forms": "ἔτι",
        "transliteration": "éti",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Hâlâ, henüz, daha da, bundan başka"],
        "meanings_en": ["yet, still, further"],
        "etymology": "Hint-Avrupa kökü *eti (ayrıca; krş. Latince et).",
        "derivatives": [],
        "examples": [{"greek": "ἔτι καθεύδει ὁ δοῦλος.", "tr": "Köle hâlâ uyuyor.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἤδη",
        "lemma": "ἤδη",
        "athenaze_forms": "ἤδη",
        "transliteration": "ḗdē",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Zaten, artık, şimdi, hemen"],
        "meanings_en": ["already, now, by this time"],
        "etymology": "Zaman zarfı.",
        "derivatives": [],
        "examples": [{"greek": "ἤδη καταδύνει ὁ ἥλιος.", "tr": "Artık güneş batıyor.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "μάλα",
        "lemma": "μάλα",
        "athenaze_forms": "μάλα",
        "transliteration": "mála",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Çok, pek, gayet"],
        "meanings_en": ["very, very much, exceedingly"],
        "etymology": "Pekiştirme zarfı.",
        "derivatives": [],
        "examples": [{"greek": "μάλα κάμνει ὁ ἀνήρ.", "tr": "Adam pek çok yorulur.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "μή",
        "lemma": "μή",
        "athenaze_forms": "μή",
        "transliteration": "mḗ",
        "partOfSpeech": "Olumsuzluk Parçacığı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Değil (emir ve istek kipleriyle: yapma!)"],
        "meanings_en": ["not (with imperatives, conditions, wishes)"],
        "etymology": "Hint-Avrupa kökü *mē (öznel olumsuzluk; krş. Sanskritçe ma).",
        "derivatives": [],
        "examples": [{"greek": "μὴ φλυάρει.", "tr": "Saçmalama!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "μηκέτι",
        "lemma": "μηκέτι",
        "athenaze_forms": "μηκέτι",
        "transliteration": "mēkéti",
        "partOfSpeech": "Olumsuzluk Zarfı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Artık ... yapma! Bundan böyle ... etme!"],
        "meanings_en": ["no longer, no more (with imperative)"],
        "etymology": "μή + ἔτι.",
        "derivatives": [],
        "examples": [{"greek": "μηκέτι κάθευδε.", "tr": "Artık uyuma!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "μόλις",
        "lemma": "μόλις",
        "athenaze_forms": "μόλις",
        "transliteration": "mólis",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Zorlukla, güçbela, zar zor, ancak"],
        "meanings_en": ["with difficulty, scarcely, hardly"],
        "etymology": "μόλος (zahmet, savaş meşakkati) kökünden.",
        "derivatives": [],
        "examples": [{"greek": "μόλις ἐπαίρει τὸν λίθον.", "tr": "Taşı güçbela kaldırır.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "νῦν",
        "lemma": "νῦν",
        "athenaze_forms": "νῦν",
        "transliteration": "nŷn",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Şimdi, şu anda"],
        "meanings_en": ["now, at present"],
        "etymology": "Hint-Avrupa kökü *nu (şimdi; krş. Latince nunc, İngilizce now, Almanca nun).",
        "derivatives": [],
        "examples": [{"greek": "νῦν δὲ οἴκαδε βαδίζει.", "tr": "Şimdi ise eve doğru yürür.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "ὄπισθεν",
        "lemma": "ὄπισθεν",
        "athenaze_forms": "ὄπισθεν",
        "transliteration": "ópisthen",
        "partOfSpeech": "Zarf / Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Arkadan, arkada, geride (+ genitiv)"],
        "meanings_en": ["behind, in back, from behind"],
        "etymology": "ὀπίσω kökünden.",
        "derivatives": ["opistodomos (antik tapınakların arka odası)"],
        "examples": [{"greek": "ὄπισθεν δὲ βαδίζει ὁ παῖς.", "tr": "Arkadan ise çocuk yürür.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "οὐ",
        "athenaze_forms": "οὐ / οὐκ / οὐχ",
        "category": "Zarflar & Edatlar"
    },
    {
        "word": "οὐκέτι",
        "lemma": "οὐκέτι",
        "athenaze_forms": "οὐκέτι",
        "transliteration": "oukéti",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Artık değil, bundan böyle değil"],
        "meanings_en": ["no longer, no more"],
        "etymology": "οὐκ + ἔτι.",
        "derivatives": [],
        "examples": [{"greek": "οὐκέτι φλέγει ὁ ἥλιος.", "tr": "Güneş artık yakmıyor.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "οὖν",
        "lemma": "οὖν",
        "athenaze_forms": "οὖν",
        "transliteration": "oûn",
        "partOfSpeech": "Bağlaç / Parçacık (Postpositive)",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Öyleyse, bu yüzden, o halde, binaenaleyh"],
        "meanings_en": ["so, therefore, then"],
        "etymology": "Mantıksal bağlaç.",
        "derivatives": [],
        "examples": [{"greek": "χαλεπὸς οὖν ἐστιν ὁ βίος.", "tr": "Öyleyse hayat zordur.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "οὕτως",
        "lemma": "οὕτως / οὕτω",
        "athenaze_forms": "οὕτως / οὕτω",
        "transliteration": "hoútōs / hoútō",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Böyle, bu şekilde, bu kadar"],
        "meanings_en": ["thus, in this way, so"],
        "etymology": "οὗτος zamirinden türemiştir.",
        "derivatives": [],
        "examples": [{"greek": "μὴ οὕτω ποίει.", "tr": "Öyle yapma!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "πολλάκις",
        "lemma": "πολλάκις",
        "athenaze_forms": "πολλάκις",
        "transliteration": "pollákis",
        "partOfSpeech": "Zarf",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Sık sık, çoğu kez, defalarca"],
        "meanings_en": ["many times, often"],
        "etymology": "πολύς (çok) sıfatından türetilmiş sıklık zarfı.",
        "derivatives": [],
        "examples": [{"greek": "πολλάκις πταίει.", "tr": "Sık sık tökezler.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "τέλος",
        "lemma": "τέλος, -ους, τό / τέλος (zarf)",
        "athenaze_forms": "τέλος",
        "transliteration": "télos",
        "partOfSpeech": "Zarf / İsim",
        "category": "Felsefe",
        "meanings_tr": ["Sonunda, nihayet; İsim olarak: Son, amaç, gaye (Aristoteles teleolojisi)"],
        "meanings_en": ["finally, at last; (noun) end, purpose, goal"],
        "etymology": "Hint-Avrupa kökü *kʷel- (dönmek, tamamlanmak).",
        "derivatives": ["teleoloji (amaçlılık bilimi)"],
        "examples": [{"greek": "τέλος δὲ καταδύνει ὁ ἥλιος.", "tr": "Sonunda ise güneş batar.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "τί;",
        "lemma": "τί;",
        "athenaze_forms": "τί;",
        "transliteration": "tí?",
        "partOfSpeech": "Soru Zamiri / Zarfı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Neden? Niçin? Ne?"],
        "meanings_en": ["why? what?"],
        "etymology": "Soru zamiri τίς, τί nötr formu.",
        "derivatives": [],
        "examples": [{"greek": "τί ποιεῖς, ὦ Ξανθία;", "tr": "Ne yapıyorsun ey Ksanthias?", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },

    # 7. EDATLAR (Prepositions)
    {
        "word": "διά",
        "lemma": "διά / δι' (+ genitiv)",
        "athenaze_forms": "διά / δι' (+ Gen.)",
        "transliteration": "diá",
        "partOfSpeech": "Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["İçinden, arasından, boyunca (Genetivus ile); deyim: δι' ὀλίγου = kısa süre sonra"],
        "meanings_en": ["through (+ gen); because of (+ acc)"],
        "etymology": "Hint-Avrupa kökü *dis- (ikiye, arasından).",
        "derivatives": ["diyalog, diyabet, diyagonal"],
        "examples": [{"greek": "δι' ὀλίγου βαδίζει.", "tr": "Kısa süre sonra yürür.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "εἰς",
        "athenaze_forms": "εἰς (+ Acc.)",
        "category": "Zarflar & Edatlar"
    },
    {
        "word": "ἐκ",
        "athenaze_forms": "ἐκ / ἐξ (+ Gen.)",
        "category": "Zarflar & Edatlar"
    },
    {
        "word": "ἐν",
        "athenaze_forms": "ἐν (+ Dat.)",
        "category": "Zarflar & Edatlar"
    },
    {
        "word": "μετά",
        "lemma": "μετά / μετ' / μεθ'",
        "athenaze_forms": "μετά (+ Acc.)",
        "transliteration": "metá",
        "partOfSpeech": "Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["-den sonra (Accusativus ile); ile, birlikte (Genetivus ile)"],
        "meanings_en": ["after (+ acc); with (+ gen)"],
        "etymology": "Hint-Avrupa kökü *medʰi- (arasında, ile).",
        "derivatives": ["metafor, metafizik, metamorfoz"],
        "examples": [{"greek": "καὶ μετὰ τὸ δεῖπνον καθεύδει.", "tr": "Ve yemekten sonra uyur.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "πρός",
        "lemma": "πρός",
        "athenaze_forms": "πρός (+ Acc.)",
        "transliteration": "prós",
        "partOfSpeech": "Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["-e doğru, yanına, üzerine, karşısında (Accusativus ile)"],
        "meanings_en": ["towards, to, against (+ acc)"],
        "etymology": "Yönelme edatı.",
        "derivatives": ["prozodi"],
        "examples": [{"greek": "βαδίζει πρὸς τὸν ἀγρόν.", "tr": "Tarlaya doğru yürür.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "ὑπό",
        "lemma": "ὑπό / ὑπ' / ὑφ'",
        "athenaze_forms": "ὑπό (+ Dat. / + Acc.)",
        "transliteration": "hypó",
        "partOfSpeech": "Edat",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Altında (Dativus ile); altına (Accusativus ile); tarafından (Genetivus ile)"],
        "meanings_en": ["under (+ dat/acc); by (agent + gen)"],
        "etymology": "Hint-Avrupa kökü *upo (altında; krş. Latince sub).",
        "derivatives": ["hipotez, hipotermi, hipotenüs"],
        "examples": [{"greek": "ἡσυχάζει ὑπὸ τῷ δένδρῳ.", "tr": "Ağacın altında dinlenir.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },

    # 8. BAĞLAÇLAR VE İLGEÇLER (Conjunctions & Particles)
    {
        "word": "ἀλλά",
        "lemma": "ἀλλά / ἀλλ'",
        "athenaze_forms": "ἀλλά / ἀλλ'",
        "transliteration": "allá",
        "partOfSpeech": "Bağlaç",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Ama, fakat, lakin, bilakis"],
        "meanings_en": ["but, yet, on the contrary"],
        "etymology": "ἄλλος (başka) kelimesinin çoğul nötr formundan.",
        "derivatives": [],
        "examples": [{"greek": "οὐκ ἐν ταῖς Ἀθήναις ἀλλ' ἐν τοῖς ἀγροῖς.", "tr": "Atina'da değil, bilakis kırsalda.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "γάρ",
        "lemma": "γάρ (postpositive)",
        "athenaze_forms": "γάρ",
        "transliteration": "gár",
        "partOfSpeech": "Gerekçe Bağlacı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Çünkü, zira (cümlede 2. sırada yer alır / postpositive)"],
        "meanings_en": ["for, because"],
        "etymology": "γε + ἄρα birleşimi.",
        "derivatives": [],
        "examples": [{"greek": "ὁ γὰρ Δικαιόπολις αὐτουργός ἐστιν.", "tr": "Çünkü Dikaiopolis kendi toprağını işleyen bir çiftçidir.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "δέ",
        "lemma": "δέ / δ' (postpositive)",
        "athenaze_forms": "δέ / δ'",
        "transliteration": "dé",
        "partOfSpeech": "Bağlaç",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Ve, ama, ise (cümlede 2. sırada yer alır / postpositive)"],
        "meanings_en": ["and, but, on the other hand"],
        "etymology": "Grekçe temel bağlaç.",
        "derivatives": [],
        "examples": [{"greek": "οἰκεῖ δὲ ἐν τοῖς ἀγροῖς.", "tr": "Kırsalda ise ikamet eder.", "author": "Athenaze I", "work": "Bölüm 1α"}]
    },
    {
        "word": "εἰ",
        "lemma": "εἰ",
        "athenaze_forms": "εἰ (εἰ μή)",
        "transliteration": "ei",
        "partOfSpeech": "Koşul Bağlacı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Eğer, şayet; kalıp: εἰ μή = eğer değilse, -medikçe"],
        "meanings_en": ["if (ei mē: unless, except)"],
        "etymology": "Şart eki.",
        "derivatives": [],
        "examples": [{"greek": "εἰ μὴ πονεῖς, οὐδὲν ἔχεις.", "tr": "Çalışmazsan hiçbir şeyin olmaz.", "author": "Athenaze I"}]
    },
    {
        "word": "ἐπεί",
        "lemma": "ἐπεί",
        "athenaze_forms": "ἐπεί",
        "transliteration": "epeí",
        "partOfSpeech": "Zaman / Sebep Bağlacı",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["-dığı zaman, -ınca, mademki, çünkü"],
        "meanings_en": ["when, after, since"],
        "etymology": "ἐπί kökünden.",
        "derivatives": [],
        "examples": [{"greek": "ἐπεὶ δὲ καταδύνει ὁ ἥλιος, οἴκαδε βαδίζει.", "tr": "Güneş batınca ise eve doğru yürür.", "author": "Athenaze I", "work": "Bölüm 1β"}]
    },
    {
        "word": "καί",
        "athenaze_forms": "καί",
        "category": "Zarflar & Edatlar"
    },
    {
        "word": "μέν ... δέ",
        "lemma": "μέν ... δέ ...",
        "athenaze_forms": "μέν ... δέ ...",
        "transliteration": "mén ... dé ...",
        "partOfSpeech": "Dengeleme / Karşılaştırma İlgeci",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Bir yandan ... diğer yandan ...; ... ise de ... (iki cümleyi dengeleyen klasik kalıp)"],
        "meanings_en": ["on the one hand... on the other hand..."],
        "etymology": "Klasik Grekçe düşünce simetrisi yapısı.",
        "derivatives": [],
        "examples": [{"greek": "ὁ μὲν Δικαιόπολις πονεῖ, ὁ δὲ Ξανθίας καθεύδει.", "tr": "Dikaiopolis çalışırken, Ksanthias ise uyur.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "τε ... καί",
        "lemma": "τε ... καί / τε καί",
        "athenaze_forms": "τε ... καί / τε καί",
        "transliteration": "te ... kaí",
        "partOfSpeech": "Çifte Bağlaç",
        "category": "Zarflar & Edatlar",
        "meanings_tr": ["Hem ... hem de ..."],
        "meanings_en": ["both... and..."],
        "etymology": "τε (enklitik ve) + καί.",
        "derivatives": [],
        "examples": [{"greek": "τόν τε πατέρα καὶ τὸν υἱὸν φιλεῖ.", "tr": "Hem babayı hem de oğulu sever.", "author": "Athenaze I"}]
    },

    # 9. ÜNLEMLER VE KALIP İFADELER (Interjections & Idioms)
    {
        "word": "ἰδού",
        "lemma": "ἰδού",
        "athenaze_forms": "ἰδού",
        "transliteration": "idoú",
        "partOfSpeech": "Ünlem",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["Bak! İşte! Gör!"],
        "meanings_en": ["look! behold! see!"],
        "etymology": "εἶδον (gördüm) fiilinin orta çatı emir formu ἰδοῦ vurgu kaymasıyla ünlemleşmiştir.",
        "derivatives": [],
        "examples": [{"greek": "ἰδού, ὦ πάτερ, ἕτοιμός ἐστιν ὁ βοῦς.", "tr": "Bak ey baba, öküz hazırdır!", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "φεῦ",
        "lemma": "φεῦ (+ genitiv)",
        "athenaze_forms": "φεῦ (φεῦ τοῦ ποδός)",
        "transliteration": "pheû",
        "partOfSpeech": "Ünlem",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["Ah! Eyvah! Yazık! (Genetivus ile acı kaynağını belirtir: φεῦ τοῦ ποδός = Ah ayağım!)"],
        "meanings_en": ["alas! oh! woe! (pheu tou podos: alas for my foot!)"],
        "etymology": "Doğal iç çekiş yansıması.",
        "derivatives": [],
        "examples": [{"greek": "φεῦ τοῦ ποδός· πταίω γὰρ πρὸς λίθον.", "tr": "Ah ayağım! Çünkü taşa çarptım.", "author": "Athenaze I", "work": "Bölüm 3α"}]
    },
    {
        "word": "ὦ",
        "lemma": "ὦ (+ vocativ)",
        "athenaze_forms": "ὦ",
        "transliteration": "ô",
        "partOfSpeech": "Seslenme Ünlemi",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["Ey! (Vocativus / Hitap hali ile zorunlu ve saygılı seslenme ünlemi)"],
        "meanings_en": ["O! (used with vocative case)"],
        "etymology": "Klasik Grekçe seslenme edatı.",
        "derivatives": [],
        "examples": [{"greek": "ὦ Ξανθία, ἐλθὲ δεῦρο.", "tr": "Ey Ksanthias, buraya gel!", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "δι' ὀλίγου",
        "lemma": "δι' ὀλίγου (deyim)",
        "athenaze_forms": "δι' ὀλίγου",
        "transliteration": "di' olígou",
        "partOfSpeech": "Kalıp İfade / Deyim",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["Kısa süre sonra, çok geçmeden, az sonra"],
        "meanings_en": ["soon, after a little while"],
        "etymology": "διά (içinden) + ὀλίγου (az bir sürenin).",
        "derivatives": [],
        "examples": [{"greek": "δι' ὀλίγου οἴκαδε βαδίζουσιν.", "tr": "Az sonra eve doğru yürürler.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "εἰ μή",
        "lemma": "εἰ μή (kalıp)",
        "athenaze_forms": "εἰ μή",
        "transliteration": "ei mḗ",
        "partOfSpeech": "Kalıp İfade",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["-medikçe, eğer ... değilse, müstesna"],
        "meanings_en": ["unless, except, if not"],
        "etymology": "εἰ (eğer) + μή (değil).",
        "derivatives": [],
        "examples": [{"greek": "εἰ μὴ πονεῖς, οὐ δειπνεῖς.", "tr": "Çalışmazsan yemek yemezsin.", "author": "Athenaze I"}]
    },
    {
        "word": "ἐν δὲ τούτῳ",
        "lemma": "ἐν δὲ τούτῳ (kalıp)",
        "athenaze_forms": "ἐν δὲ τούτῳ",
        "transliteration": "en dè toútōi",
        "partOfSpeech": "Kalıp İfade",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["Bu sırada, bu esnada, tam o esnada"],
        "meanings_en": ["meanwhile, in the meantime"],
        "etymology": "ἐν (içinde) + τούτῳ (bu zamanın).",
        "derivatives": [],
        "examples": [{"greek": "ἐν δὲ τούτῳ προσέρχεται ὁ δεσπότης.", "tr": "Bu esnada efendi çıkagelir.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    },
    {
        "word": "ἐν ᾧ",
        "lemma": "ἐν ᾧ (kalıp)",
        "athenaze_forms": "ἐν ᾧ",
        "transliteration": "en hôi",
        "partOfSpeech": "Kalıp İfade",
        "category": "Ünlemler & Kalıplar",
        "meanings_tr": ["-dığı sırada, -iken, o esnada"],
        "meanings_en": ["while, in which time"],
        "etymology": "ἐν + ilgi zamiri ᾧ.",
        "derivatives": [],
        "examples": [{"greek": "ἐν ᾧ δὲ καθεύδει ὁ δοῦλος, πονεῖ ὁ δεσπότης.", "tr": "Köle uyurken, efendi çalışır.", "author": "Athenaze I", "work": "Bölüm 2β"}]
    }
]

# Track statistics
updated_count = 0
added_count = 0

for item in athenaze_raw:
    w = item["word"]
    norm = normalize_simple(w)
    
    # Check if already exists in dictionary
    if norm in existing_by_norm:
        existing = existing_by_norm[norm]
        existing["isAthenaze"] = True
        if "tags" not in existing:
            existing["tags"] = []
        if "athenaze" not in existing["tags"]:
            existing["tags"].append("athenaze")
        if "athenaze_forms" in item:
            existing["athenaze_forms"] = item["athenaze_forms"]
        # If user has better/more specific meanings, append or preserve
        if "meanings_tr" in item and not existing.get("meanings_tr"):
            existing["meanings_tr"] = item["meanings_tr"]
        updated_count += 1
    else:
        # Create new full entry
        safe_id = "ath_" + re.sub(r'[^a-zA-Z0-9_]', '', item.get("transliteration", norm).lower().replace(' ', '_'))
        if not safe_id or safe_id == "ath_":
            safe_id = f"ath_{len(dict_list) + 1}"
            
        new_entry = {
            "id": safe_id,
            "word": item["word"],
            "lemma": item.get("lemma", item["word"]),
            "transliteration": item.get("transliteration", ""),
            "athenaze_forms": item.get("athenaze_forms", ""),
            "partOfSpeech": item.get("partOfSpeech", "Kelime"),
            "category": item.get("category", "Athenaze"),
            "frequency": item.get("frequency", 4),
            "isAthenaze": True,
            "tags": ["athenaze"],
            "source": "Athenaze: Book I (1α – 3β)",
            "meanings_tr": item.get("meanings_tr", []),
            "meanings_en": item.get("meanings_en", []),
            "etymology": item.get("etymology", ""),
            "derivatives": item.get("derivatives", []),
            "grammar": item.get("grammar", {}),
            "examples": item.get("examples", [])
        }
        dict_list.append(new_entry)
        existing_by_norm[norm] = new_entry
        added_count += 1

# Save back to data/dictionary.js
output_js = f"// Ancient Greek Comprehensive Vocabulary Dataset (Includes Athenaze Book I 1a-3b)\nwindow.ANCIENT_GREEK_DICTIONARY = {json.dumps(dict_list, ensure_ascii=False, indent=2)};\n"
with open("data/dictionary.js", "w", encoding="utf-8") as f:
    f.write(output_js)

print(f"Integration complete!")
print(f"Existing words tagged with Athenaze: {updated_count}")
print(f"New Athenaze words added: {added_count}")
print(f"Total words now in dictionary: {len(dict_list)}")
