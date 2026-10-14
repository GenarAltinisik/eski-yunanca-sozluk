# -*- coding: utf-8 -*-
"""
Add everyday Ancient Greek words with etymology and grammar.
"""
import json

daily_words = [
    {
        "id": "pater",
        "word": "πατήρ",
        "lemma": "πατήρ, πατρός, ὁ",
        "transliteration": "patḗr",
        "partOfSpeech": "İsim (Eril, 3. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": ["Baba, peder, ata", "Tanrıların ve insanların babası (Zeus)", "Kurucu, hami"],
        "meanings_en": ["father, ancestor, founder"],
        "etymology": "Hint-Avrupa kökü *ph₂tḗr (baba; krş. Latince pater, İngilizce father, Farsça pedar).",
        "derivatives": ["patriark (ataerkil), patriot (yurtsever), patron"],
        "grammar": {"nominative": "πατήρ", "genitive": "πατρός", "dative": "πατρί", "accusative": "πατέρα", "vocative": "πάτερ"},
        "examples": [{"greek": "πατὴρ ἀνδρῶν τε θεῶν τε.", "tr": "Tanrıların ve insanların babası.", "author": "Homeros", "work": "İlyada"}]
    },
    {
        "id": "meter",
        "word": "μήτηρ",
        "lemma": "μήτηρ, μητρός, ἡ",
        "transliteration": "mḗtēr",
        "partOfSpeech": "İsim (Dişil, 3. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": ["Anne, ana, valide", "Ana vatan, kaynak, memba (metropolis)"],
        "meanings_en": ["mother, source, origin"],
        "etymology": "Hint-Avrupa kökü *méh₂tēr (anne; krş. Latince mater, İngilizce mother, Farsça mader).",
        "derivatives": ["metropol (meter + polis = ana kent), Demeter (Toprak Ana)"],
        "grammar": {"nominative": "μήτηρ", "genitive": "μητρός", "dative": "μητρί", "accusative": "μητέρα", "vocative": "μῆτερ"},
        "examples": [{"greek": "τίμα τὸν πατέρα σου καὶ τὴν μητέρα.", "tr": "Babana ve anana saygı göster.", "author": "On Emir / Septuaginta"}]
    },
    {
        "id": "adelphos",
        "word": "ἀδελφός",
        "lemma": "ἀδελφός, -οῦ, ὁ",
        "transliteration": "adelphós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": ["Erkek kardeş, birader", "Dindaş, yoldaş, yakın dost"],
        "meanings_en": ["brother, kin, fellow-countryman"],
        "etymology": "ἀ- (birlik, ortak) + δελφύς (delphys = rahim). 'Aynı rahimden doğan' demektir.",
        "derivatives": ["Filadelfiya (kardeş sevgisi kenti)"],
        "grammar": {"nominative": "ἀδελφός", "genitive": "ἀδελφοῦ"},
        "examples": [{"greek": "ἀδελφὸς ὑπ' ἀδελφοῦ σῳζόμενος ὡς πόλις ὀχυρά.", "tr": "Kardeşi tarafından korunan kardeş, muhkem bir kale gibidir.", "author": "Antik Özdeyiş"}]
    },
    {
        "id": "pais",
        "word": "παῖς",
        "lemma": "παῖς, παιδός, ὁ / ἡ",
        "transliteration": "paîs",
        "partOfSpeech": "İsim (Ortak, 3. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": ["Çocuk, evlat, oğul veya kız", "Uşak, hizmetkar", "Genç delikanlı"],
        "meanings_en": ["child, boy, girl, son, daughter", "servant, slave"],
        "etymology": "Hint-Avrupa kökü *peh₂w- (küçük, az; krş. Latince puer/paulus).",
        "derivatives": ["pedagoji (çocuk eğitimi), pediatri (çocuk tıbbı), ansiklopedi (enkyklios paideia = döngüsel/kapsamlı çocuk eğitimi)"],
        "grammar": {"nominative": "παῖς", "genitive": "παιδός", "dative": "παιδί", "accusative": "παῖδα", "vocative": "παῖ"},
        "examples": [{"greek": "παιδεία παισὶ σωφροσύνη.", "tr": "Eğitim (paideia), çocuk için itidal ve erdemdir.", "author": "Menandros"}]
    },
    {
        "id": "kyon",
        "word": "κύων",
        "lemma": "κύων, κυνός, ὁ / ἡ",
        "transliteration": "kýōn",
        "partOfSpeech": "İsim (Ortak, 3. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": [
            "Köpek, tazı",
            "Kinikler: Sinoplu Diogenes ve takipçilerine verilen ad (köpeksi sade yaşamı savunanlar)"
        ],
        "meanings_en": ["dog, hound", "cynic philosopher"],
        "etymology": "Hint-Avrupa kökü *ḱwṓ (köpek; krş. Latince canis, İngilizce hound).",
        "derivatives": ["kinik (kinizm = köpeksi yaşam felsefesi), kinoloji"],
        "grammar": {"nominative": "κύων", "genitive": "κυνός", "dative": "κυνί", "accusative": "κύνα", "vocative": "κύον"},
        "examples": [{"greek": "Διογένης ὁ κύων.", "tr": "Köpek Diogenes (Sinoplu Kinik Filozof Diogenes).", "author": "Diogenes Laertios"}]
    },
    {
        "id": "potamos",
        "word": "ποταμός",
        "lemma": "ποταμός, -οῦ, ὁ",
        "transliteration": "potamós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Nehir, ırmak, akarsu", "Sel, coşkun akıntı"],
        "meanings_en": ["river, stream, torrent"],
        "etymology": "πέτομαι (petomai = uçmak, hızla akmak) köküyle akrabadır.",
        "derivatives": ["Mezopotamya (mesos + potamos = nehirler arası / Fırat-Dicle)", "hipopotam (nehir atı)"],
        "grammar": {"nominative": "ποταμός", "genitive": "ποταμοῦ"},
        "examples": [{"greek": "ποταμοῖς τοῖς αὐτοῖς ἐμβαίνομέν τε καὶ οὐκ ἐμβαίνομεν, εἶμέν τε καὶ οὐκ εἶμεν.", "tr": "Aynı ırmaklara hem gireriz hem girmeyiz; hem bizizdir hem biz değilizdir.", "author": "Herakleitos", "work": "Fragman B49a"}]
    },
    {
        "id": "oros",
        "word": "ὄρος",
        "lemma": "ὄρος, ὄρους, τό",
        "transliteration": "óros",
        "partOfSpeech": "İsim (Nötr, 3. Çekim - s-stem)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": ["Dağ, tepe, yükselti", "Olympos Dağı (tanrılar dağı)"],
        "meanings_en": ["mountain, hill, height"],
        "etymology": "Hint-Avrupa kökü *h₃er- (yükselmek, harekete geçmek; krş. ornis/kuş).",
        "derivatives": ["orojenez (dağ oluşumu), orografi (dağ bilimi)"],
        "grammar": {"nominative": "ὄρος", "genitive": "ὄρους", "dative": "ὄρει", "accusative": "ὄρος"},
        "examples": [{"greek": "ἐν ὄρει Ὀλύμπῳ.", "tr": "Olympos Dağı'nda.", "author": "Homeros"}]
    },
    {
        "id": "hemera",
        "word": "ἡμέρα",
        "lemma": "ἡμέρα, -ας, ἡ",
        "transliteration": "hēméra",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Gün, gündüz, aydınlık vakit", "Tarih, vakit"],
        "meanings_en": ["day, daytime"],
        "etymology": "Hint-Avrupa kökü *h₂em- (gün).",
        "derivatives": ["efemera (ephemeros = bir günlük, gelip geçici)"],
        "grammar": {"nominative": "ἡμέρᾱ", "genitive": "ἡμέρᾱς", "dative": "ἡμέρᾳ", "accusative": "ἡμέρᾱν"},
        "examples": [{"greek": "μία χελιδὼν ἔαρ οὐ ποιεῖ, οὐδὲ μία ἡμέρα.", "tr": "Bir kırlangıçla bahar gelmez, ne de bir tek günle.", "author": "Aristoteles", "work": "Nikomakhos'a Etik 1098a"}]
    },
    {
        "id": "nyx",
        "word": "νύξ",
        "lemma": "νύξ, νυκτός, ἡ",
        "transliteration": "nýx",
        "partOfSpeech": "İsim (Dişil, 3. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Gece, karanlık", "Nyx: Gece tanrıçası"],
        "meanings_en": ["night, darkness, Nyx (goddess)"],
        "etymology": "Hint-Avrupa kökü *nókʷts (gece; krş. Latince nox, İngilizce night, Almanca Nacht).",
        "derivatives": ["niktofobi (gece/karanlık korkusu)"],
        "grammar": {"nominative": "νύξ", "genitive": "νυκτός", "dative": "νυκτί", "accusative": "νύκτα"},
        "examples": [{"greek": "νὺξ δ' ἤδη τελέθει· ἀγαθὸν καὶ νυκτὶ πιθέσθαι.", "tr": "Gece oldu artık; geceye de boyun eğmek (dinlenmek) iyidir.", "author": "Homeros", "work": "İlyada 7.282"}]
    },
    {
        "id": "kyrios",
        "word": "κύριος",
        "lemma": "κύριος, -ου, ὁ",
        "transliteration": "kýrios",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 5,
        "meanings_tr": ["Efendi, sahip, rab, mevla", "Hükümran, yetkili kimse", "Hristiyanlıkta: Rab İsa Mesih"],
        "meanings_en": ["lord, master, guardian, sovereign", "the Lord (Septuagint & NT)"],
        "etymology": "κῦρος (kŷros = güç, otorite) kelimesinden türetilmiştir.",
        "derivatives": ["Kyrie eleison (Rab bize merhamet et duası)"],
        "grammar": {"nominative": "κύριος", "genitive": "κυρίου", "vocative": "κύριε"},
        "examples": [{"greek": "Κύριε ἐλέησον.", "tr": "Rab, merhamet et!", "author": "Litürjik Dua"}]
    },
    {
        "id": "basileus",
        "word": "βασιλεύς",
        "lemma": "βασιλεύς, -έως, ὁ",
        "transliteration": "basileús",
        "partOfSpeech": "İsim (Eril, 3. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 5,
        "meanings_tr": ["Kral, hükümdar, hakan", "Pers Şahı (Büyük Kral / ho Basileus)", "Bizans imparatorunun resmi unvanı"],
        "meanings_en": ["king, prince, monarch, emperor"],
        "etymology": "Miken Linear B tabletlerinde qa-si-re-u olarak geçer. Ön-Grekçe kökenlidir.",
        "derivatives": ["bazilika (kraliyet sarayı tarzında kilise), fesleğen / basil (kral otu!)"],
        "grammar": {"nominative": "βασιλεύς", "genitive": "βασιλέως", "dative": "βασιλεῖ", "accusative": "βασιλέα", "vocative": "βασιλεῦ"},
        "examples": [{"greek": "βασιλεὺς βασιλέων.", "tr": "Kralların kralı (Şahlar Şahı).", "author": "Tarihsel Unvan"}]
    },
    {
        "id": "doulos",
        "word": "δοῦλος",
        "lemma": "δοῦλος, -ου, ὁ",
        "transliteration": "doûlos",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 5,
        "meanings_tr": ["Köle, kul, cariye, esir", "Bağımlı kimse"],
        "meanings_en": ["slave, servant, bondsman"],
        "etymology": "Miken tabletlerinde do-e-ro şeklinde rastlanır. Özgür yurttaşın (eleutheros) karşıtıdır.",
        "derivatives": ["doulos (sosyoloji terimi)"],
        "grammar": {"nominative": "δοῦλος", "genitive": "δούλου"},
        "examples": [{"greek": "ὁ μὲν γὰρ ἐλεύθερος, ὁ δὲ δοῦλος φύσει ἐστίν.", "tr": "Çünkü kimi insan doğası gereği özgür, kimi ise doğası gereği köledir.", "author": "Aristoteles", "work": "Politika 1254b"}]
    },
    {
        "id": "stratos",
        "word": "στρατός",
        "lemma": "στρατός, -οῦ, ὁ",
        "transliteration": "stratós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Savaş & Tarih",
        "frequency": 5,
        "meanings_tr": ["Ordu, askeri güç, leşker", "Ordugah, karargah", "Halk kitlesi (silah altındaki millet)"],
        "meanings_en": ["army, host, camp, expedition"],
        "etymology": "Hint-Avrupa kökü *sterh₃- (sermek, yayılmak; krş. stratosfer).",
        "derivatives": ["strateji (stratēgia = ordu yönetimi)"],
        "grammar": {"nominative": "στρατός", "genitive": "στρατοῦ"},
        "examples": [{"greek": "ὁ στρατὸς τῶν Ἀθηναίων.", "tr": "Atinalıların ordusu.", "author": "Thukydides"}]
    },
    {
        "id": "naus",
        "word": "ναῦς",
        "lemma": "ναῦς, νεώς, ἡ",
        "transliteration": "naûs",
        "partOfSpeech": "İsim (Dişil, Düzensiz 3. Çekim)",
        "category": "Savaş & Tarih",
        "frequency": 5,
        "meanings_tr": ["Gemi, kadırga, tekne", "Savaş gemisi (triērēs / trireme üç kürekli kadırga)"],
        "meanings_en": ["ship, vessel, warship"],
        "etymology": "Hint-Avrupa kökü *neh₂w- (gemi; krş. Latince navis, İngilizce navy).",
        "derivatives": ["astronot (yıldız gemicisi), kozmonot (evren gemicisi), mide bulantısı (nausea = deniz tutması!)"],
        "grammar": {"nominative": "ναῦς", "genitive": "νεώς", "dative": "νηΐ", "accusative": "ναῦν"},
        "examples": [{"greek": "ξύλινον τεῖχος.", "tr": "Tahta duvar (Delphoi kehanetinde Atina'yı kurtaracak gemiler).", "author": "Herodotos", "work": "Tarih 7.141"}]
    },
    {
        "id": "hodos",
        "word": "ὁδός",
        "lemma": "ὁδός, -οῦ, ἡ",
        "transliteration": "hodós",
        "partOfSpeech": "İsim (Dişil, 2. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": ["Yol, cadde, patika", "Yolculuk, sefer", "Yöntem, metot, tarz"],
        "meanings_en": ["way, road, path, journey", "method, manner"],
        "etymology": "Hint-Avrupa kökü *sod- (yürümek). Yunanca 2. çekim dişil istisnalarındandır (ὁ değil ἡ artikelini alır).",
        "derivatives": ["metot (meta + hodos = bir amaca giden yol)", "periyot (peri + hodos = dönemeç/devir)", "sinot / sinod (birlikte yürüme meclisi)", "egzodus (çıkış yolu)"],
        "grammar": {"nominative": "ἡ ὁδός", "genitive": "τῆς ὁδοῦ", "dative": "τῇ ὁδῷ", "accusative": "τὴν ὁδόν"},
        "examples": [{"greek": "ὁδὸς ἄνω κάτω μία καὶ ὡυτή.", "tr": "Yukarı çıkan yol ile aşağı inen yol bir ve aynıdır.", "author": "Herakleitos", "work": "Fragman B60"}]
    },
    {
        "id": "lithos",
        "word": "λίθος",
        "lemma": "λίθος, -ου, ὁ / ἡ",
        "transliteration": "líthos",
        "partOfSpeech": "İsim (Eril/Dişil, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": ["Taş, kaya, mermer parçası", "Kıymetli taş, mücevher"],
        "meanings_en": ["stone, rock, gem"],
        "etymology": "Ön-Grekçe Akdeniz kökenli kelimedir.",
        "derivatives": ["paleolitik (eski taş çağı), neolitik (yeni taş çağı), litografi (taş baskı), monolit"],
        "grammar": {"nominative": "λίθος", "genitive": "λίθου"},
        "examples": [{"greek": "λίθος ἐπὶ λίθῳ οὐ μὴ ἀφεθῇ.", "tr": "Taş üstünde taş bırakılmayacak.", "author": "Matta İncili 24:2"}]
    },
    {
        "id": "selene",
        "word": "σελήνη",
        "lemma": "σελήνη, -ης, ἡ",
        "transliteration": "selḗnē",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": ["Ay, kamer, mehtap", "Selene: Ay tanrıçası"],
        "meanings_en": ["moon, crescent, Selene (goddess)"],
        "etymology": "σέλας (sélas = ışıltı, parlaklık) kelimesinden türemiştir.",
        "derivatives": ["selenografi (ay yüzeyi bilimi), selenyum (kimyasal element)"],
        "grammar": {"nominative": "σελήνη", "genitive": "σελήνης"},
        "examples": [{"greek": "ἡ σελήνη οὐ δώσει τὸ φέγγος αὐτῆς.", "tr": "Ay ışığını vermeyecek.", "author": "Matta İncili 24:29"}]
    },
    {
        "id": "kephale",
        "word": "κεφαλή",
        "lemma": "κεφαλή, -ῆς, ἡ",
        "transliteration": "kephalḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Baş, kafa, ser", "En üst nokta, tepe, kaynak"],
        "meanings_en": ["head, chief, extremity"],
        "etymology": "Hint-Avrupa kökü *gʰebʰ-el- (baş, kafa; krş. Almanca Giebel).",
        "derivatives": ["hidrosefali (beyinde su toplanması), ensefalit, sefalik"],
        "grammar": {"nominative": "κεφαλή", "genitive": "κεφαλῆς"},
        "examples": [{"greek": "κεφαλὴ γωνίας.", "tr": "Köşe taşı / temel başı.", "author": "Mezmurlar / Yeni Ahit"}]
    },
    {
        "id": "pous",
        "word": "πούς",
        "lemma": "πούς, ποδός, ὁ",
        "transliteration": "poús",
        "partOfSpeech": "İsim (Eril, 3. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Ayak, kadem", "Şiirde: Vezin ayağı", "Uzunluk ölçüsü (ayak = yakl. 30 cm)"],
        "meanings_en": ["foot, leg, poetic foot, measure of length"],
        "etymology": "Hint-Avrupa kökü *pṓds (ayak; krş. Latince pes/pedis, İngilizce foot).",
        "derivatives": ["podyum, tripod (üçayak), ahtapot (oktopous = sekiz ayaklı), podoloji, Oidipous (şiş ayaklı)"],
        "grammar": {"nominative": "πούς", "genitive": "ποδός", "dative": "ποδί", "accusative": "πόδα", "nom_pl": "πόδες"},
        "examples": [{"greek": "τί ἐστιν ὃ μίαν ἔχον φωνὴν τετράπουν καὶ δίπουν καὶ τρίπουν γίνεται;", "tr": "Tek bir sesi olup sabah 4 ayaklı, öğlen 2 ayaklı, akşam 3 ayaklı olan nedir? (Sfenks'in Oidipus'a sorduğu bilmece: İnsan!).", "author": "Apollodoros", "work": "Bibliotheke"}]
    },
    {
        "id": "glossa",
        "word": "γλῶσσα",
        "lemma": "γλῶσσα, -ης, ἡ (Attik: γλῶττα)",
        "transliteration": "glôssa",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Dil (organ)", "Dil, lisan, lehçe", "Yabancı veya arkaik kelime, şerh (glosa)"],
        "meanings_en": ["tongue, language, dialect, obsolete word"],
        "etymology": "Ön-Yunanca *glōkhya kökünden.",
        "derivatives": ["glosaryum (sözlük/lügatçe), poliglot (çok dilli), glossofobi (topluluk önünde konuşma korkusu)"],
        "grammar": {"nominative": "γλῶσσα", "genitive": "γλώσσης", "dative": "γλώσσῃ", "accusative": "γλῶσσαν"},
        "examples": [{"greek": "γλώσσης κρατεῖν.", "tr": "Diline sahip çıkmak / dilini tutmak.", "author": "Solon"}]
    },
    {
        "id": "haima",
        "word": "αἷμα",
        "lemma": "αἷμα, -ατος, τό",
        "transliteration": "haîma",
        "partOfSpeech": "İsim (Nötr, 3. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 4,
        "meanings_tr": ["Kan, can suyu", "Kan bağı, soy, akrabalık", "Dökülen kan, cinayet suçu"],
        "meanings_en": ["blood, bloodshed, kinship"],
        "etymology": "Kökeni belirsiz kadim bir terimdir. Gövdesi αἱματ- (haimat-) şeklindedir.",
        "derivatives": ["hematoloji (kan bilimi), hemoglobin, anemi (kansızlık), hemofili"],
        "grammar": {"nominative": "αἷμα", "genitive": "αἵματος", "dative": "αἵματι", "accusative": "αἷμα"},
        "examples": [{"greek": "αἷμα καὶ ὕδωρ.", "tr": "Kan ve su.", "author": "Yuhanna İncili 19:34"}]
    }
]

with open("data/dictionary.js", "r", encoding="utf-8") as f:
    content = f.read()

prefix = "window.ANCIENT_GREEK_DICTIONARY = "
start_idx = content.find(prefix) + len(prefix)
end_idx = content.rfind(";")
current_dict = json.loads(content[start_idx:end_idx].strip())

current_ids = {item["id"] for item in current_dict}
added = 0
for w in daily_words:
    if w["id"] not in current_ids:
        current_dict.append(w)
        added += 1

output_js = f"// Ancient Greek Comprehensive Vocabulary Dataset\nwindow.ANCIENT_GREEK_DICTIONARY = {json.dumps(current_dict, ensure_ascii=False, indent=2)};\n"
with open("data/dictionary.js", "w", encoding="utf-8") as f:
    f.write(output_js)

print(f"Added {added} daily words. New total: {len(current_dict)}")
