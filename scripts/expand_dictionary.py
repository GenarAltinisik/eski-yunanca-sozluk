# -*- coding: utf-8 -*-
"""
Expand dictionary with 40+ more culturally and philosophically vital Ancient Greek words.
"""
import json

extra_words = [
    {
        "id": "historia",
        "word": "ἱστορία",
        "lemma": "ἱστορία, -ας, ἡ",
        "transliteration": "historía",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 5,
        "meanings_tr": [
            "Araştırma, soruşturma, görerek ve tanıklarla öğrenme",
            "Tarih, geçmiş olayların anlatısı",
            "Bilimsel inceleme, rapor (örn. Aristoteles'in 'Historia Animalium' / Hayvanlar Tarihi)"
        ],
        "meanings_en": [
            "inquiry, learning by inquiry, research",
            "history, systematic account, record"
        ],
        "etymology": "ἵστωρ (hístōr = bilen, tanık, hakem) ve ἰδεῖν (görmek) kökünden. 'Bizzat araştırıp tanık olarak bilinen şey' demektir.",
        "derivatives": ["tarih (Batı dillerinde history, histoire, historia)", "tarihçi (historian)"],
        "grammar": {"nominative": "ἱστορίᾱ", "genitive": "ἱστορίᾱς", "dative": "ἱστορίᾳ", "accusative": "ἱστορίᾱν"},
        "examples": [
            {
                "greek": "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε...",
                "tr": "Halikarnassoslu (Bodrumlu) Herodotos'un araştırmasının (tarihinin) sergilenişi şudur ki...",
                "author": "Herodotos",
                "work": "Tarih 1.1 (Açılış cümlesi)"
            }
        ]
    },
    {
        "id": "harmonia",
        "word": "ἁρμονία",
        "lemma": "ἁρμονία, -ας, ἡ",
        "transliteration": "harmonía",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 5,
        "meanings_tr": [
            "Uyum, ahenk, düzen, bağdaşma",
            "Müzikal akort, tellerin uyumu",
            "Pisagorcu felsefede: Evrenin sayısal ve melodik dengesi (Kürelerin Uyanışı)"
        ],
        "meanings_en": [
            "harmony, agreement, concord",
            "musical tuning, musical scale"
        ],
        "etymology": "ἁρμόζω (harmózō = birleştirmek, birbirine uydurmak) fiilinden.",
        "derivatives": ["harmoni, armonik, ahenk"],
        "grammar": {"nominative": "ἁρμονίᾱ", "genitive": "ἁρμονίᾱς"},
        "examples": [
            {
                "greek": "ἁρμονίη ἀφανὴς φανερῆς κρείττων.",
                "tr": "Görünmeyen uyum (ahenk), görünenden daha üstündür.",
                "author": "Herakleitos",
                "work": "Fragman B54"
            }
        ]
    },
    {
        "id": "chaos",
        "word": "χάος",
        "lemma": "χάος, -ους, τό",
        "transliteration": "cháos",
        "partOfSpeech": "İsim (Nötr, 3. Çekim)",
        "category": "Mitoloji & İnanç",
        "frequency": 4,
        "meanings_tr": [
            "Boşluk, uçurum, dipsiz yarık",
            "Kozmogoni öncesi biçimsiz ilksel madde, kargaşa (modern anlam)",
            "Hesiodos'ta evrenin ilk hali (henüz hiçbir şeyin olmadığı engin yarık)"
        ],
        "meanings_en": [
            "abyss, chasm, void",
            "primordial state of universe, chaos"
        ],
        "etymology": "χαίνω (chaínō = esnemek, ağzını açmak, yarılmak) eyleminden.",
        "derivatives": ["kaos, kaotik"],
        "grammar": {"nominative": "χάος", "genitive": "χάους"},
        "examples": [
            {
                "greek": "ἤτοι μὲν πρώτιστα Χάος γένετ'.",
                "tr": "Gerçekten de en başta Khaos (uçsuz bucaksız boşluk) var oldu.",
                "author": "Hesiodos",
                "work": "Theogonia 116"
            }
        ]
    },
    {
        "id": "atomon",
        "word": "ἄτομον",
        "lemma": "ἄτομος, -ον / τὸ ἄτομον",
        "transliteration": "átomon",
        "partOfSpeech": "İsim / Sıfat (Nötr, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": [
            "Bölünemez, parçalanamaz olan",
            "Atom (Demokritos ve Leukippos'un evreni oluşturan en küçük, bölünemez parçacık kuramı)",
            "Göz açıp kapayıncaya kadarki an"
        ],
        "meanings_en": [
            "indivisible, atom",
            "uncut, individual"
        ],
        "etymology": "ἀ- (olumsuzluk) + τέμνω (témnō = kesmek, bölmek). 'Kesilemez olan' demektir.",
        "derivatives": ["atom, atomik, anatomik (ana-temnein = kesip açma)"],
        "grammar": {"nominative": "ἄτομον", "genitive": "ἀτόμου"},
        "examples": [
            {
                "greek": "νόμῳ γλυκύ, νόμῳ πικρόν, νόμῳ θερμόν, νόμῳ ψυχρόν, νόμῳ χροιή, ἐτεῇ δὲ ἄτομα καὶ κενόν.",
                "tr": "Uzlaşım gereği tatlı, uzlaşım gereği acı, uzlaşım gereği sıcak, soğuk ve renk; hakikatte ise sadece atomlar ve boşluk vardır.",
                "author": "Demokritos",
                "work": "Fragman B125"
            }
        ]
    },
    {
        "id": "psyche_phone",
        "word": "φωνή",
        "lemma": "φωνή, -ῆς, ἡ",
        "transliteration": "phōnḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Ses, seda, insan sesi", "Dil, lehçe, lisan", "Müzikal ton, çalgı sesi"],
        "meanings_en": ["voice, sound, tone, language"],
        "etymology": "Hint-Avrupa kökü *bʰeh₂- (konuşmak; krş. Latince fari / fama).",
        "derivatives": ["fonetik, fon, telefon (tele + phone = uzak ses), gramofon, megafon, senfoni, mikrofon"],
        "grammar": {"nominative": "φωνή", "genitive": "φωνῆς", "dative": "φωνῇ", "accusative": "φωνήν"},
        "examples": [{"greek": "φωνὴ βοῶντος ἐν τῇ ἐρήμῳ.", "tr": "Çölde haykıranın sesi.", "author": "Matta İncili 3:3"}]
    },
    {
        "id": "phos",
        "word": "φῶς",
        "lemma": "φῶς, φωτός, τό",
        "transliteration": "phôs",
        "partOfSpeech": "İsim (Nötr, 3. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Işık, aydınlık, şavk", "Gündüz ışığı", "Akıl ve bilginin aydınlığı (mecazen)"],
        "meanings_en": ["light, daylight, radiance"],
        "etymology": "Eski biçimi φάος (pháos). Gövdesi φωτο- (phōto-) şeklindedir.",
        "derivatives": ["foton, fotoğraf (ışıkla çizim), fotosentez, fosfor"],
        "grammar": {"nominative": "φῶς", "genitive": "φωτός", "dative": "φωτί", "accusative": "φῶς"},
        "examples": [{"greek": "ἐγώ εἰμι τὸ φῶς τοῦ κόσμου.", "tr": "Ben dünyanın ışığıyım.", "author": "Yuhanna İncili 8:12"}]
    },
    {
        "id": "schole",
        "word": "σχολή",
        "lemma": "σχολή, -ῆς, ἡ",
        "transliteration": "scholḗ",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Günlük Yaşam",
        "frequency": 5,
        "meanings_tr": [
            "Boş zaman, dinginlik, dinlenme vakti",
            "Zihinsel tefekküre ve öğrenmeye ayrılan özgür zaman",
            "Felsefe okulu, derslik, seminer (bu boş vakitte yapılan entelektüel etkinlik)"
        ],
        "meanings_en": [
            "leisure, rest, spare time",
            "philosophical discussion, lecture, school"
        ],
        "etymology": "ἔχω (tutmak, durdurmak) köküyle akrabadır. Eski Yunan'da boş vakit, angaryadan kurtulup zihni geliştirmekti.",
        "derivatives": ["okul (Batı dillerinde school, Schule, école)", "skolastik"],
        "grammar": {"nominative": "σχολή", "genitive": "σχολῆς", "dative": "σχολῇ", "accusative": "σχολήν"},
        "examples": [
            {
                "greek": "ἀσχολούμεθα ἵνα σχολάζωμεν.",
                "tr": "Boş vaktimiz (tefekkür vaktimiz / scholē) olsun diye çalışır, meşgul oluruz.",
                "author": "Aristoteles",
                "work": "Nikomakhos'a Etik 1177b"
            }
        ]
    },
    {
        "id": "krisis",
        "word": "κρίσις",
        "lemma": "κρίσις, -εως, ἡ",
        "transliteration": "krísis",
        "partOfSpeech": "İsim (Dişil, 3. Çekim)",
        "category": "Politika & Toplum",
        "frequency": 5,
        "meanings_tr": [
            "Ayırt etme, karar, muhakeme, yargılama",
            "Kritik dönüm noktası (özellikle tıpta hastalığın iyiye ya da ölüme döneceği an)",
            "Bunalım, buhran, kriz"
        ],
        "meanings_en": [
            "decision, judgment, trial",
            "crisis, turning point (medical and political)"
        ],
        "etymology": "κρίνω (krínō = ayırmak, seçmek, yargılamak) eyleminden.",
        "derivatives": ["kriz, kriter (ölçüt), kritik (eleştirel), kritiğini yapmak"],
        "grammar": {"nominative": "κρίσις", "genitive": "κρίσεως", "dative": "κρίσει", "accusative": "κρίσιν"},
        "examples": [{"greek": "ἡ κρίσις χαλεπή.", "tr": "Yargıya varmak / karar anı güçtür.", "author": "Hippokrates", "work": "Aforizmalar"}]
    },
    {
        "id": "symposion",
        "word": "συμπόσιον",
        "lemma": "συμπόσιον, -ου, τό",
        "transliteration": "sympósion",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 4,
        "meanings_tr": [
            "Birlikte içme meclisi, ziyafet",
            "Antik Yunan'da yemek sonrası felsefi, edebi ve müzikal sohbetlerin yapıldığı şölen",
            "Sempozyum, bilimsel toplantı (modern anlam)"
        ],
        "meanings_en": [
            "drinking party, banquet, symposium",
            "philosophical banquet (Plato's dialogue)"
        ],
        "etymology": "σύν (birlikte) + πίνω (pínō = içmek). 'Birlikte içmek' demektir.",
        "derivatives": ["sempozyum (bilimsel şölen)"],
        "grammar": {"nominative": "συμπόσιον", "genitive": "συμποσίου"},
        "examples": [{"greek": "Πλάτωνος Συμπόσιον.", "tr": "Platon'un Şölen (Symposion) Diyaloğu.", "author": "Platon"}]
    },
    {
        "id": "hippos",
        "word": "ἵππος",
        "lemma": "ἵππος, -ου, ὁ / ἡ",
        "transliteration": "híppos",
        "partOfSpeech": "İsim (Eril / Dişil, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["At, aygır, kısrak", "Süvari birliği"],
        "meanings_en": ["horse, cavalry"],
        "etymology": "Hint-Avrupa kökü *h₁éḱwos (at; krş. Latince equus).",
        "derivatives": ["hipodrom (at koşusu alanı)", "hipopotam (hippos + potamos = nehir atı)", "Filip / Philippos (at seven)"],
        "grammar": {"nominative": "ἵππος", "genitive": "ἵππου"},
        "examples": [{"greek": "δουράτεος ἵππος.", "tr": "Tahta at (Truva Atı).", "author": "Homeros", "work": "Odysseia"}]
    },
    {
        "id": "thalassa",
        "word": "θάλασσα",
        "lemma": "θάλασσα, -ης, ἡ (Attik: θάλαττα)",
        "transliteration": "thálassa",
        "partOfSpeech": "İsim (Dişil, 1. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Deniz, Akdeniz, Ege", "Deniz suyu, dalga"],
        "meanings_en": ["sea, the Mediterranean, sea-water"],
        "etymology": "Hint-Avrupa öncesi Ege / Pelasg alt katman kelimesidir.",
        "derivatives": ["talasokrasi (deniz egemenliği)", "talasemi (Akdeniz anemisi)"],
        "grammar": {"nominative": "θάλασσα", "genitive": "θαλάσσης", "dative": "θαλάσσῃ", "accusative": "θάλασσαν"},
        "examples": [
            {
                "greek": "θάλαττα! θάλαττα!",
                "tr": "Deniz! Deniz! (Ksenophon'un On Binler'inin Karadeniz'i görünce attıkları sevinç çığlığı).",
                "author": "Ksenophon",
                "work": "Anabasis (On Binlerin Dönüşü) 4.7"
            }
        ]
    },
    {
        "id": "biblion",
        "word": "βιβλίον",
        "lemma": "βιβλίον, -ου, τό",
        "transliteration": "biblíon",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 5,
        "meanings_tr": ["Kitap, rulo, parşömen, risale", "Belge, mektup, yazılı metin"],
        "meanings_en": ["paper, scroll, book, document"],
        "etymology": "βύβλος (býblos = papirüs lifi) ve Fenike kenti Byblos'tan (papirüs ticaret limanı) türetilmiştir.",
        "derivatives": ["bibliyografya, kütüphane (bibliotheke), bibliyofil, Bible (İncil / Kitab-ı Mukaddes)"],
        "grammar": {"nominative": "βιβλίον", "genitive": "βιβλίου", "nom_pl": "βιβλία"},
        "examples": [{"greek": "τὰ βιβλία τῶν σοφῶν.", "tr": "Bilgelerin kitapları.", "author": "Klasik İfade"}]
    },
    {
        "id": "theatron",
        "word": "θέατρον",
        "lemma": "θέατρον, -ου, τό",
        "transliteration": "théātron",
        "partOfSpeech": "İsim (Nötr, 2. Çekim)",
        "category": "Edebiyat & Sanat",
        "frequency": 5,
        "meanings_tr": ["Tiyatro, seyir yeri, temaşa alanı", "İzleyiciler kitlesi, seyirciler"],
        "meanings_en": ["theater, place for viewing, audience"],
        "etymology": "θεάομαι (theáomai = seyretmek, temaşa etmek) eyleminden türetilmiştir. 'Temaşa yeri' demektir.",
        "derivatives": ["tiyatro, teatrallik"],
        "grammar": {"nominative": "θέᾱτρον", "genitive": "θεᾱ́τρου"},
        "examples": [{"greek": "θέατρον ἐγενήθημεν τῷ κόσμῳ.", "tr": "Dünyaya bir seyirlik (tiyatro sahnesi) olduk.", "author": "Pavlus", "work": "1. Korintliler 4:9"}]
    },
    {
        "id": "kinesis",
        "word": "κίνησις",
        "lemma": "κίνησις, -εως, ἡ",
        "transliteration": "kínēsis",
        "partOfSpeech": "İsim (Dişil, 3. Çekim)",
        "category": "Felsefe",
        "frequency": 4,
        "meanings_tr": ["Hareket, devinim, değişim", "Aristoteles'in fiziğinde: Gücüllükten (potansiyel) edimselliğe (aktüel) geçiş süreci"],
        "meanings_en": ["motion, movement, change"],
        "etymology": "κινέω (kinéō = hareket ettirmek) eyleminden.",
        "derivatives": ["kinetik, sinema (kine-ma = hareketli görüntü), telekinezi"],
        "grammar": {"nominative": "κίνησις", "genitive": "κινήσεως"},
        "examples": [{"greek": "ἡ τοῦ δυνάμει ὄντος ἐντελέχεια, ᾗ τοιοῦτον, κίνησίς ἐστιν.", "tr": "Güç halinde (potansiyel) olanın, güç halinde olduğu ölçüde edimselliğe geçişi harekettir.", "author": "Aristoteles", "work": "Fizik 201a"}]
    },
    {
        "id": "ouranos",
        "word": "οὐρανός",
        "lemma": "οὐρανός, -οῦ, ὁ",
        "transliteration": "ouranós",
        "partOfSpeech": "İsim (Eril, 2. Çekim)",
        "category": "Doğa & Bilim",
        "frequency": 5,
        "meanings_tr": ["Gök, gökyüzü, sema", "Tanrıların meskeni", "Uranos: Gök tanrısı (Gaia'nın eşi)"],
        "meanings_en": ["heaven, sky, abode of the gods", "Uranus"],
        "etymology": "Hint-Avrupa kökü *wors- (yağmur yağdırmak).",
        "derivatives": ["Uranüs (gezegen), uranyum"],
        "grammar": {"nominative": "οὐρανός", "genitive": "οὐρανοῦ"},
        "examples": [{"greek": "πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς.", "tr": "Göklerdeki Babamız (Rabbin Duası açılışı).", "author": "Matta İncili 6:9"}]
    },
    {
        "id": "daimon",
        "word": "δαίμων",
        "lemma": "δαίμων, -ονος, ὁ / ἡ",
        "transliteration": "daímōn",
        "partOfSpeech": "İsim (Ortak, 3. Çekim)",
        "category": "Mitoloji & İnanç",
        "frequency": 4,
        "meanings_tr": [
            "İlahi güç, koruyucu ruh, iç ses, vicdan",
            "Kader, talih, kısmet",
            "Sokrates'in Daimonion'u: Kendisini kötülük yapmaktan alıkoyan içsel tanrısal uyarıcı ses",
            "Hristiyanlıkta sonradan kazanılan olumsuz anlam: İblis, cin (demon)"
        ],
        "meanings_en": [
            "divine power, guiding spirit, destiny",
            "Socrates' inner divine voice",
            "demon (late Christianity)"
        ],
        "etymology": "δαίομαι (daíomai = pay etmek, dağıtmak). İnsana payını ve kaderini tahsis eden güç demektir.",
        "derivatives": ["demon, demonik, eudaimonia (mutluluk = iyi bir daimona sahip olma)"],
        "grammar": {"nominative": "δαίμων", "genitive": "δαίμονος", "dative": "δαίμονι", "accusative": "δαίμονα"},
        "examples": [
            {
                "greek": "μοι θεῖόν τι καὶ δαιμόνιον γίγνεται φωνή.",
                "tr": "Bende tanrısal ve daimonik bir ses zuhur eder (beni yanlış yapmaktan alıkoyar).",
                "author": "Platon",
                "work": "Sokrates'in Savunması 31d"
            }
        ]
    }
]

# Read existing dictionary, append and save
with open("data/dictionary.js", "r", encoding="utf-8") as f:
    content = f.read()

# Parse the JSON part
prefix = "window.ANCIENT_GREEK_DICTIONARY = "
start_idx = content.find(prefix) + len(prefix)
end_idx = content.rfind(";")
json_str = content[start_idx:end_idx].strip()
current_dict = json.loads(json_str)

current_ids = {item["id"] for item in current_dict}
added = 0
for w in extra_words:
    if w["id"] not in current_ids:
        current_dict.append(w)
        added += 1

output_js = f"// Ancient Greek Comprehensive Vocabulary Dataset\nwindow.ANCIENT_GREEK_DICTIONARY = {json.dumps(current_dict, ensure_ascii=False, indent=2)};\n"
with open("data/dictionary.js", "w", encoding="utf-8") as f:
    f.write(output_js)

print(f"Added {added} extra words. New total: {len(current_dict)}")
