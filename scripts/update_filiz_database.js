const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Load dictionary.js
const dictPath = path.join(__dirname, '..', 'data', 'dictionary.js');
const rawCode = fs.readFileSync(dictPath, 'utf8');

const sandbox = { window: {} };
vm.runInNewContext(rawCode, sandbox);
const dict = sandbox.window.ANCIENT_GREEK_DICTIONARY;

if (!Array.isArray(dict)) {
  console.error('Failed to load ANCIENT_GREEK_DICTIONARY');
  process.exit(1);
}

console.log('Initial dictionary entries:', dict.length);

// Helper to ensure tags contain 'filiz_hoca' and isFilizHoca: true
function markFiliz(entry, note) {
  entry.isFilizHoca = true;
  if (!entry.tags) entry.tags = [];
  if (!entry.tags.includes('filiz_hoca')) {
    entry.tags.push('filiz_hoca');
  }
  if (note) {
    entry.filiz_notes = note;
  }
}

// 2. Fix duplicate IDs and old misplaced notes from earlier scripts
const edeEntry = dict.find(d => d.word === 'ἤδη' && d.id === 'ath_d');
if (edeEntry) {
  edeEntry.id = 'ath_ede';
  edeEntry.filiz_notes = undefined;
  edeEntry.isFilizHoca = false;
  if (edeEntry.tags) edeEntry.tags = edeEntry.tags.filter(t => t !== 'filiz_hoca');
}

const arooEntry = dict.find(d => d.word === 'ἀρόω' && d.id === 'ath_ar');
if (arooEntry) {
  arooEntry.id = 'ath_aroo';
}

const deEntry = dict.find(d => d.word === 'δέ');
if (deEntry) {
  deEntry.id = 'ath_de';
}

const polis = dict.find(d => d.id === 'polis');
if (polis) polis.filiz_notes = 'Filiz Hoca İsimler: Kent, şehir devleti (polis, politika, metropol kökü).';

const idea = dict.find(d => d.id === 'idea');
if (idea) idea.filiz_notes = 'Filiz Hoca İsimler: Form, şekil, görünüş; Platonik idea, kavram (ideal, ideoloji kökü).';

const logos = dict.find(d => d.id === 'logos');
if (logos) markFiliz(logos, 'Filiz Hoca İsimler: Söz, konuşma; akıl, usa vurma, ilke (ὁ λόγος; mantık, -loji kökü).');

// 3. Update existing entries matching Filiz Hoca's Athenaze Lesson 1
const existingUpdates = [
  // Fiiller
  { id: 'ath_g', note: 'Filiz Hoca Fiiller: Götürüyorum (3. tekil: ἄγει, geçmiş zaman: ἦγον).' },
  { id: 'ath_ar', note: 'Filiz Hoca Fiiller: Yukarı kaldırıyorum (αἴρω).' },
  { id: 'ath_badz', note: 'Filiz Hoca Fiiller: Yürüyorum (βαδίζω).' },
  { id: 'ath_gerg', note: 'Filiz Hoca Fiiller: Çiftçilik yapıyorum/ediyorum, toprağı işliyorum (3. tekil: γεωργεῖ).' },
  { id: 'grapho', note: 'Filiz Hoca Fiiller: Yazıyorum (3. tekil: γράφει, perf.: γέγραφα). Bileşik kök: otobiyografi (αὐτοβιογραφία).' },
  { id: 'emel_ethelo', note: 'Filiz Hoca Fiiller: İstiyorum (1. çoğul: ἐθέλομεν).' },
  { id: 'eimi', note: 'Filiz Hoca Fiiller: Varım, olurum, oluyorum, -im; olmak, var olmak (mastar: εἶναι, 3. tekil: ἐστί(ν), 3. çoğul: εἰσί).' },
  { id: 'ath_epar', note: 'Filiz Hoca Fiiller: Yukarı kaldırıyorum, yükseltiyorum (3. tekil: ἐπαίρει; kalıp: ἐπαίρει ἑαυτόν = kendini kaldırıyor/ayağa kalkıyor).' },
  { id: 'ath_hsychz', note: 'Filiz Hoca Fiiller: Dinleniyorum, dingin kalıyorum (ἡσυχάζω).' },
  { id: 'ath_kathz', note: 'Filiz Hoca Fiiller: Oturuyorum (geçişsiz: καθίζω).' },
  { id: 'ath_kmn', note: 'Filiz Hoca Fiiller: Yoruluyorum, tükeniyorum (3. tekil: κάμνει; kalıp: μάλα κάμνει = çok yorulur).' },
  { id: 'ath_katadn', note: 'Filiz Hoca Fiiller: Batıyorum (geçişsiz: καταδύνω; örn. ὁ ἥλιος καταδύνει).' },
  { id: 'ath_katatrb', note: 'Filiz Hoca Fiiller: Yoruyorum, bitkin düşürüyorum, güçsüz bırakıyorum (geçişli: κατατρίβω).' },
  { id: 'lego', note: 'Filiz Hoca Fiiller: Söylüyorum, diyorum (3. tekil: λέγει).' },
  { id: 'ath_oik', note: 'Filiz Hoca Fiiller: İkamet ediyorum, evimde yaşıyorum, oturuyorum (3. tekil: οἰκεῖ; isim kökü: ὁ οἶκος).' },
  { id: 'emel_paideuo', note: 'Filiz Hoca Fiiller: Eğitiyorum, eğitirim (3. tekil: παιδεύει).' },
  { id: 'ath_parch', note: 'Filiz Hoca Fiiller: Sağlıyorum, verir, sunar (3. tekil: παρέχει).' },
  { id: 'poieo', note: 'Filiz Hoca Fiiller: Yapıyorum, yaparım (3. tekil: ποιέει / ποιεῖ).' },
  { id: 'ath_pon', note: 'Filiz Hoca Fiiller: Çalışıyorum, çaba gösteriyorum, emek veriyorum, zahmet ediyorum (3. tekil: πονεῖ; isim kökü: ὁ πόνος).' },
  { id: 'ath_skpt', note: 'Filiz Hoca Fiiller: Kazıyorum, belliyorum, çapalıyorum (σκάπτω).' },
  { id: 'ath_stenz', note: 'Filiz Hoca Fiiller: İç çekiyor, inliyor (3. tekil: στενάζει).' },
  { id: 'phero', note: 'Filiz Hoca Fiiller: Taşıyorum, getiriyorum, götürüyorum (φέρω).' },
  { id: 'ath_phil', note: 'Filiz Hoca Fiiller: Seviyorum, hoşlanıyorum (3. tekil: φιλεῖ).' },
  { id: 'ath_phlg', note: 'Filiz Hoca Fiiller: Yakıyorum, kavuruyorum; parlıyorum (φλέγω).' },
  { id: 'ath_char', note: 'Filiz Hoca Fiiller: Seviniyorum, sevinç duyuyorum, zevk alıyorum (3. tekil: χαίρει; selamlama: χαῖρε).' },

  // Eril İsimler
  { id: 'ath_agrs', note: 'Filiz Hoca Eril İsimler: Çiftlik, tarla, arazi, kır (acc: τὸν ἀγρόν; kalıplar: ἐν τῷ ἀγρῷ = tarlada, ἐκ τοῦ ἀγροῦ = tarladan, ἐν τοῖς ἀγροῖς = kırsal alanda).' },
  { id: 'adelphos', note: 'Filiz Hoca Eril İsimler: Erkek kardeş (acc: τὸν ἀδελφόν; Philadelphia kökü).' },
  { id: 'ath_athnaos', note: 'Filiz Hoca Eril İsimler: Atinalı (ὁ Ἀθηναῖος).' },
  { id: 'anthropos', note: 'Filiz Hoca Eril İsimler: İnsan, adam (gen: ἀνθρώπου, dat. pl: ἀνθρώποις, nom. pl: οἱ ἄνθρωποι; antropoloji kökü).' },
  { id: 'ath_autourgs', note: 'Filiz Hoca Eril İsimler: Kendi kendine çalışan, toprağını köleler olmadan kendisi işleyen çiftçi (αὐτός + ἔργον).' },
  { id: 'bios', note: 'Filiz Hoca Eril İsimler: Yaşam (acc: τὸν βίον; biyoloji, otobiyografi kökü).' },
  { id: 'emel_georgos', note: 'Filiz Hoca Eril İsimler: Çiftçi, toprağı işleyen (γῆ + ἔργον).' },
  { id: 'demos', note: 'Filiz Hoca Eril İsimler: Halk, ahali (demokrasi kelimesinin kökü).' },
  { id: 'doulos', note: 'Filiz Hoca Eril İsimler: Köle (nom. pl: δοῦλοι).' },
  { id: 'helios', note: 'Filiz Hoca Eril İsimler: Güneş (ὁ ἥλιος; helyum kökü).' },
  { id: 'hippos', note: 'Filiz Hoca Eril İsimler: At (acc: τὸν ἵππον; hipodrom kökü).' },
  { id: 'filiz_karpos', note: 'Filiz Hoca Eril İsimler: Ürün, meyve, mahsul (nom. pl: οἱ καρποί).' },
  { id: 'ath_klros', note: 'Filiz Hoca Eril İsimler: Çiftlik, arazi, hisse (acc: τὸν κλῆρον; kleromansi kökü).' },
  { id: 'lithos', note: 'Filiz Hoca Eril İsimler: Taş (paleolitik, neolitik kökü).' },
  { id: 'nomos', note: 'Filiz Hoca Eril İsimler: Yasa, töre, kural (acc: τὸν νόμον; ekonomi, astronomi kökü).' },
  { id: 'oikos', note: 'Filiz Hoca Eril İsimler: Ev, ikametgah, konut (acc: τὸν οἶκον; ekonomi, ekoloji kökü).' },
  { id: 'ath_pnos', note: 'Filiz Hoca Eril İsimler: Emek, çaba, çalışma, iş; yorucu iş, zahmet, yorgunluk (ὁ πόνος).' },
  { id: 'potamos', note: 'Filiz Hoca Eril İsimler: Irmak, nehir (dat: ποταμῷ, acc. pl: τοὺς ποταμούς, gen. pl: ποταμῶν; Mezopotamya kökü).' },
  { id: 'ath_stos', note: 'Filiz Hoca Eril İsimler: Buğday, un, ekmek; erzak, besin, yiyecek (acc: τὸν σῖτον).' },
  { id: 'tyrannos', note: 'Filiz Hoca Eril İsimler: Tiran, mutlak yönetici (ὁ τύραννος).' },
  { id: 'philos', note: 'Filiz Hoca Eril İsimler: Arkadaş, dost; seven/sevilen kişi (acc: τὸν φíλον; felsefe kökü).' },
  { id: 'phobos', note: 'Filiz Hoca Eril İsimler: Korku, dehşet (fobi kelimesinin kökü).' },
  { id: 'chronos', note: 'Filiz Hoca Eril İsimler: Zaman (acc: χρόνον; kronoloji kökü; kalıplar: πολὺν χρόνον = uzun süre, οὐ πολὺν χρόνον = kısa süre).' },

  // Dişil İsimler
  { id: 'hodos', note: 'Filiz Hoca Dişil İsimler: Yol (2. çekim -ος ile bitip dişil olan isimlerdendir: ἡ ὁδός; metod [meta+hodos], periyot kökü).' },
  { id: 'selene', note: 'Filiz Hoca Dişil İsimler: Ay, ay tanrıçası (selenografi kökü).' },
  { id: 'sophia', note: 'Filiz Hoca Dişil İsimler: Bilgelik, hikmet, derinlik (felsefe: philosophia kökü).' },

  // Nötr İsimler
  { id: 'ath_dndron', note: 'Filiz Hoca Cinssiz (Nötr) İsimler: Ağaç (dat: τῷ δένδρῳ; kalıp: ὑπὸ τῷ δένδρῳ = ağacın altında; dendroloji kökü).' },
  { id: 'ath_hrma', note: 'Filiz Hoca Cinssiz (Nötr) İsimler: Taş yığını, dayanak (τὸ ἕρμα).' },
  { id: 'metron', note: 'Filiz Hoca Cinssiz (Nötr) İsimler: Ölçü, vezin (geometri, simetri kökü).' },
  { id: 'soma', note: 'Filiz Hoca Cinssiz (Nötr) İsimler: Beden, cisim, gövde (derste telaffuz örneği [sōma] olarak geçmektedir; psikosomatik kökü).' },

  // Özel İsimler
  { id: 'ath_athnai', note: "Filiz Hoca Özel İsimler: Atina (çoğul dişil: αἱ Ἀθῆναι, dat. pl: ταῖς Ἀθήναις; kalıp: ἐν ταῖς Ἀθήναις = Atina'da)." },
  { id: 'ath_dikaipolis', note: 'Filiz Hoca Özel İsimler: Dikaiopolis (Athenaze ana kahramanı: dikaia polis = adil yurttaş).' },
  { id: 'ath_zes', note: 'Filiz Hoca Özel İsimler: Zeus (voc: ὦ Ζεῦ = Ey Zeus!).' },

  // Sıfatlar
  { id: 'ath_oknos', note: 'Filiz Hoca Sıfatlar: Enerjik, çalışkan (alpha privativum: ἀ- + ὄκνος tembellik).' },
  { id: 'ath_aprantos', note: 'Filiz Hoca Sıfatlar: Sınırsız, sonsuz (ἀ- + πέρας sınır).' },
  {
    id: 'ath_211',
    note: 'Filiz Hoca Sıfatlar: Özgür, hür (ἐλεύθερος).',
    extraUpdate: (e) => {
      e.word = 'ἐλεύθερος';
      e.lemma = 'ἐλεύθερος, -α, -ον';
      e.transliteration = 'eleútheros';
      e.partOfSpeech = 'Sıfat (3 Takılı)';
      e.category = 'Politika & Toplum';
      if (!e.meanings_tr || e.meanings_tr.length === 0) {
        e.meanings_tr = ['Özgür, hür, bağımsız'];
      }
      if (!e.meanings_en || e.meanings_en.length === 0) {
        e.meanings_en = ['free, independent'];
      }
    }
  },
  { id: 'ath_hikans', note: 'Filiz Hoca Sıfatlar: Yeterli, elverişli, kafi (acc: ἱκανόν).' },
  { id: 'ath_ischyrs', note: 'Filiz Hoca Sıfatlar: Güçlü, sağlam, kuvvetli (ἰσχυρός).' },
  { id: 'kalos', note: 'Filiz Hoca Sıfatlar: Güzel, iyi, soylu (acc: καλόν, nom. pl: καλοί; articulus ile ὁ καλός: yakışıklı adam/oğlan).' },
  { id: 'ath_makrs', note: 'Filiz Hoca Sıfatlar: Uzun, büyük (makro- kökü).' },
  { id: 'ath_mikrs', note: 'Filiz Hoca Sıfatlar: Kısa, küçük (acc: μικρόν; mikro- kökü).' },
  { id: 'ath_pols', note: 'Filiz Hoca Sıfatlar: Çok, birçok (acc: πολύν; poli- kökü; kalıp: πολὺν χρόνον = uzun süre).' },
  { id: 'ath_chaleps', note: 'Filiz Hoca Sıfatlar: Zor, çetin, güç, zahmetli (χαλεπός).' },

  // Tanımlık ve Zamirler
  { id: 'ath_ho_h_to', note: 'Filiz Hoca Tanımlık (Articulus): Tanımlık (articulus); Homeros\'ta işaret zamiri, Attike düzyazısında 3. kişi zamiri ("o", "bu") ve iyelik işlevi gören belirleyici (ὁ, ἡ, τό).' },
  {
    id: 'ath_224',
    note: 'Filiz Hoca Zamirler: Ben (1. tekil şahıs zamiri: ego).',
    extraUpdate: (e) => {
      e.word = 'ἐγώ';
      e.lemma = 'ἐγώ';
      e.transliteration = 'egṓ';
      e.partOfSpeech = 'Kişi Zamiri (1. Tekil Şahıs)';
      e.category = 'Gramer & Zamirler';
      if (!e.meanings_tr || e.meanings_tr.length === 0) {
        e.meanings_tr = ['Ben (1. tekil şahıs zamiri)'];
      }
      if (!e.meanings_en || e.meanings_en.length === 0) {
        e.meanings_en = ['I (first person singular pronoun)'];
      }
    }
  },
  {
    id: 'ath_226',
    note: 'Filiz Hoca Zamirler: αὐτόν (acc.): Onu (ayrıca αὐτός: kendisi, bizzat, o; bileşik kök: otobiyografi).',
    extraUpdate: (e) => {
      e.word = 'αὐτός';
      e.lemma = 'αὐτός, -ή, -ό';
      e.transliteration = 'autós';
      e.partOfSpeech = 'Zamir / Belirteç (Intensive & 3rd Person Pronoun)';
      e.category = 'Gramer & Zamirler';
      e.meanings_tr = [
        'Onu (eril accusativus αὐτόν: metinde 3. kişi zamiri olarak)',
        'Kendisi, bizzat (özneyi pekiştiren belirteç)',
        'Aynı (articulus ile: ὁ αὐτός = aynı)'
      ];
      e.meanings_en = ['him (acc. autón); self, himself, same'];
    }
  },
  { id: 'ath_heautn', note: 'Filiz Hoca Zamirler: Kendini, kendi kendini (3. şahıs dönüşlü zamir; kalıp: ἐπαίρει ἑαυτόν = kendini kaldırıyor/ayağa kalkıyor).' },

  // Zarflar, Edatlar, Bağlaçlar
  { id: 'ath_ae', note: 'Filiz Hoca Zarflar: Her zaman, daima (ἀεί).' },
  { id: 'ath_mla', note: 'Filiz Hoca Zarflar: Çok (kalıp: μάλα κάμνει = çok yorulur).' },
  { id: 'ou', note: 'Filiz Hoca Olumsuzluk Edatı: -me, değil (ünlüden önce οὐκ, asperden/sert soluktan önce οὐχ; nesnel olumsuzluk).' },
  { id: 'ath_oukti', note: 'Filiz Hoca Zarflar: (Olumsuz cümlede) artık, bir daha değil (οὐκέτι).' },
  { id: 'ath_on', note: 'Filiz Hoca Zarflar / Bağlaçlar: Böylece, bu yüzden, bunun üzerine (οὖν).' },
  { id: 'ath_pollkis', note: 'Filiz Hoca Zarflar: Sık sık, çoğunlukla (πολλάκις).' },
  { id: 'ath_tlos', note: 'Filiz Hoca Zarflar: Sonunda, nihayet (τέλος).' },
  { id: 'eis', note: 'Filiz Hoca Edatlar: -e doğru, içine (+ accusativus: yönelme bildirir).' },
  { id: 'ek', note: 'Filiz Hoca Edatlar: -den, -dan (+ genitivus: çıkış bildirir; kalıp: ἐκ τοῦ ἀγροῦ = tarladan).' },
  { id: 'en', note: 'Filiz Hoca Edatlar: İçinde, -de/-da (+ dativus: bulunma bildirir; kalıplar: ἐν τῷ ἀγρῷ = tarlada, ἐν ταῖς Ἀθήναις = Atina\'da).' },
  { id: 'ath_prs', note: 'Filiz Hoca Edatlar: -e, -e doğru, yanına (+ accusativus).' },
  { id: 'ath_hyp', note: 'Filiz Hoca Edatlar: Altında (+ dativus: bulunma; kalıp: ὑπὸ τῷ δένδρῳ = ağacın altında).' },
  { id: 'ath_de', note: 'Filiz Hoca Bağlaçlar: Oysa, ise, öte yandan; de, da, dahi (postpositivum).' },
  { id: 'ath_all', note: "Filiz Hoca Bağlaçlar: Ama, fakat, tersine (elisio ile ἀλλ')." },
  { id: 'ath_gr', note: 'Filiz Hoca Bağlaçlar: Çünkü; gerçekten, doğrusu (postpositivum).' },
  { id: 'kai', note: 'Filiz Hoca Bağlaçlar: Ve; dahi, da, bile.' },
  { id: 'ath_263', note: 'Filiz Hoca Ünlemler: Ey! (seslenme ünlemi: vocativus ile kullanılır: ὦ Ζεῦ = Ey Zeus!).' },

  // Metin Kalıpları
  { id: 'filiz_en_tais_athenais', note: "Filiz Hoca Metin Kalıpları: Atina'da (ἐν ταῖς Ἀθήναις - yer tümleci: ἐν + dativus pluralis)." },
  { id: 'filiz_en_tois_agrois', note: 'Filiz Hoca Metin Kalıpları: Kırsal alanda, tarlalarda, kırda (ἐν τοῖς ἀγροῖς - yer tümleci: ἐν + dativus pluralis).' },
  { id: 'ath_di_olgou', note: "Filiz Hoca Metin Kalıpları: Kısa süre sonra, az sonra (δι' ὀλίγου)." }
];

let updatedCount = 0;
existingUpdates.forEach(up => {
  const entry = dict.find(d => d.id === up.id);
  if (entry) {
    markFiliz(entry, up.note);
    if (up.extraUpdate) {
      up.extraUpdate(entry);
    }
    updatedCount++;
  } else {
    console.warn('Could not find entry by ID:', up.id);
  }
});
console.log('Updated existing entries count:', updatedCount);

// 4. The 37 New Entries
const newEntries = [
  // --- 1. Fiiller ---
  {
    id: 'filiz_egklino',
    word: 'ἐγκλίνω',
    lemma: 'ἐγκλίνω (mastar: ἐγκλίνειν)',
    transliteration: 'enklínō',
    partOfSpeech: 'Fiil (Etken)',
    category: 'Temel Fiiller',
    frequency: 3,
    meanings_tr: [
      'Yatmak, arkaya dayanmak, eğilmek, yaslanmak',
      'Dilbilgisi terimi: Enklitik olmak (vurguyu bir önceki sözcüğe aktarıp arkaya dayanmak)'
    ],
    meanings_en: ['to lean upon, recline, bend', 'incline (grammar: enclitic)'],
    etymology: 'ἐν (içinde, üzerine) + κλίνω (eğmek, yatırmak, yaslamak).',
    derivatives: ['enklitik (ardına dayanan vurgusuz sözcük)', 'klinik (yatakbaşı tıp)'],
    grammar: {
      infinitive: 'ἐγκλίνειν',
      present_3sg: 'ἐγκλίνει'
    },
    examples: [
      {
        greek: 'ἐγκλίνειν ἐπὶ τῆς κλίνης.',
        tr: 'Yatağa arkasını yaslamak / uzanmak.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Yatmak, arkaya dayanmak (mastar: ἐγκλίνειν). Dilbilgisinde enklitik teriminin kökenidir.'
  },
  {
    id: 'filiz_eimi_ibo',
    word: 'εἶμι',
    lemma: 'εἶμι (ibo)',
    transliteration: 'eĩmi',
    partOfSpeech: 'Fiil (Düzensiz, Gelecek Zaman)',
    category: 'Temel Fiiller',
    frequency: 5,
    meanings_tr: [
      'Gideceğim (Attike düzyazısında ἔρχομαι fiilinin gelecek zamanı yerine kullanılır; εἰμί [olmak] ile karıştırılmamalıdır)'
    ],
    meanings_en: ['I shall go, I am going (Attic future of erchomai)'],
    etymology: 'Hint-Avrupa kökü *h₁ey- (gitmek; krş. Latince ire, eo).',
    derivatives: ['iyon (ion: elektrik alanında giden parçacık)'],
    grammar: {
      forms: '1. tekil: εἶμι, 2. tekil: εἶ, 3. tekil: εἶσι(ν), çoğul: ἴμεν, ἴτε, ἴασι(ν)'
    },
    examples: [
      {
        greek: 'οἴκαδε εἶμι.',
        tr: 'Eve doğru gideceğim.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Gideceğim (Attike lehçesinde gelecek zaman anlamı taşır; εἰμί [olmak] ile karıştırılmamalıdır).'
  },
  {
    id: 'filiz_noseo',
    word: 'νοσέω',
    lemma: 'νοσέω, νοσῶ',
    transliteration: 'noséō',
    partOfSpeech: 'Büzüşmeli Fiil',
    category: 'Temel Fiiller',
    frequency: 3,
    meanings_tr: [
      'Hastalanıyorum, hastayım, rahatsızlanıyorum'
    ],
    meanings_en: ['to be sick, ill, ailing'],
    etymology: 'νόσος (hastalık) isminden türetilmiştir.',
    derivatives: ['nozoloji (hastalıklar sınıflaması)', 'nozokomiyal (hastane enfeksiyonu)'],
    grammar: {
      stem: 'νοσε-',
      present_3sg: 'νοσεῖ'
    },
    examples: [
      {
        greek: 'ὁ δοῦλος νοσεῖ καὶ οὐ δύναται πονεῖν.',
        tr: 'Köle hasta ve çalışamıyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Hastalanıyorum, hastayım (3. tekil: νοσεῖ; isim kökü: ἡ νόσος).'
  },
  {
    id: 'filiz_okneo',
    word: 'ὀκνέω',
    lemma: 'ὀκνέω, ὀκνῶ',
    transliteration: 'oknéō',
    partOfSpeech: 'Büzüşmeli Fiil',
    category: 'Temel Fiiller',
    frequency: 3,
    meanings_tr: [
      'Tembellik ediyorum, tereddüt ediyorum, çekiniyorum, üşeniyorum'
    ],
    meanings_en: ['to shrink from, hesitate, be sluggish/lazy'],
    etymology: 'ὄκνος (tembellik, ağırdan alma) kökünden; zıt anlamlısı ἄοκνος (enerjik, gayretli).',
    derivatives: [],
    grammar: {
      stem: 'ὀκνε-',
      present_3sg: 'ὀκνεῖ'
    },
    examples: [
      {
        greek: 'ὁ δὲ δοῦλος ὀκνεῖ καὶ ἡσυχάζει.',
        tr: 'Köle ise tembellik ediyor ve dinleniyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Tembellik ediyorum (3. tekil: ὀκνεῖ; zıt anlamlısı: ἄοκνος [enerjik, çalışkan]).'
  },
  {
    id: 'filiz_skopeo',
    word: 'σκοπέω',
    lemma: 'σκοπέω, σκοπῶ',
    transliteration: 'skopéō',
    partOfSpeech: 'Büzüşmeli Fiil',
    category: 'Felsefe',
    frequency: 4,
    meanings_tr: [
      'Bakıyorum, inceliyorum, gözlemliyorum, dikkatle inceliyor'
    ],
    meanings_en: ['to look at, examine, inspect, consider'],
    etymology: 'Hint-Avrupa *speḱ- (bakmak; krş. Latince spectare, speculum).',
    derivatives: ['mikroskop', 'teleskop', 'skeptik (şüpheci)', 'periskop'],
    grammar: {
      stem: 'σκοπε-',
      present_3sg: 'σκοπεῖ'
    },
    examples: [
      {
        greek: 'σκοπεῖ τὸν ἀγρὸν καὶ τοὺς λίθους.',
        tr: 'Tarlayı ve taşları inceliyor / bakıyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Bakıyor, inceliyor (3. tekil: σκοπεῖ). Bileşik türevler: teleskop, mikroskop.'
  },
  {
    id: 'filiz_stergo',
    word: 'στέργω',
    lemma: 'στέργω',
    transliteration: 'stérgō',
    partOfSpeech: 'Fiil (Etken)',
    category: 'Temel Fiiller',
    frequency: 3,
    meanings_tr: [
      'Seviyorum (özellikle evlada, anne/babaya, kardeşe veya arkadaşa duyulan doğal ailevi sevgi/şefkat)'
    ],
    meanings_en: ['to love, feel affection for (especially of family affection), cherish'],
    etymology: 'Eski Yunanca storgē (doğal ailevi sevgi/şefkat) kavramının kökü.',
    derivatives: ['storge (dört sevgi türünden biri: aile sevgisi)'],
    grammar: {
      present_3sg: 'στέργει'
    },
    examples: [
      {
        greek: 'ὁ πατὴρ τὸν υἱὸν στέργει.',
        tr: 'Baba oğlunu (şefkatle/aile sevgisiyle) sever.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Fiiller: Seviyorum (özellikle evlada, anne/babaya, kardeşe veya arkadaşa duyulan sevgi).'
  },

  // --- 2. İsimler ---
  {
    id: 'filiz_eniautos',
    word: 'ἐνιαυτός',
    lemma: 'ὁ ἐνιαυτός, τοῦ ἐνιαυτοῦ',
    transliteration: 'eniautós',
    partOfSpeech: 'İsim (Eril, 2. Çekim)',
    category: 'Gramer & Zamirler',
    frequency: 4,
    meanings_tr: [
      'Yıl, sene (acc. τὸν ἐνιαυτόν: yıl boyunca)'
    ],
    meanings_en: ['year (acc. tòn eniautón: for a year, throughout the year)'],
    etymology: 'ἐν (içinde) + αὖ (tekrar, yeniden) köklerinden döngüsel yılı simgeler.',
    derivatives: [],
    grammar: {
      declension: '2. Çekim (Eril)',
      nominative: 'ὁ ἐνιαυτός',
      genitive: 'τοῦ ἐνιαυτοῦ',
      dative: 'τῷ ἐνιαυτῷ',
      accusative: 'τὸν ἐνιαυτόν'
    },
    examples: [
      {
        greek: 'τὸν ἐνιαυτὸν ἅπαντα πονεῖ ὁ αὐτουργός.',
        tr: 'Çiftçi bütün bir yıl boyunca çalışır.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Eril İsimler: Yıl (acc: τὸν ἐνιαυτόν; kalıp: τὸν ἐνιαυτόν = yıl boyunca [accusativus temporis]).'
  },
  {
    id: 'filiz_thermos_noun',
    word: 'θέρμος',
    lemma: 'ὁ θέρμος, τοῦ θέρμου',
    transliteration: 'thérmos',
    partOfSpeech: 'İsim (Eril, 2. Çekim)',
    category: 'Tarım & Doğa',
    frequency: 2,
    meanings_tr: [
      'Bakla, acı bakla, lupin (Eski Yunan kırsalında yaygın baklagil türü)'
    ],
    meanings_en: ['lupine, lupin bean'],
    etymology: 'Hint-Avrupa *gʷʰer- (sıcak olmak, pişirmek; krş. θερμός).',
    derivatives: [],
    grammar: {
      declension: '2. Çekim (Eril)',
      nominative: 'ὁ θέρμος',
      genitive: 'τοῦ θέρμου',
      accusative: 'τὸν θέρμον'
    },
    examples: [
      {
        greek: 'ὁ γεωργὸς θέρμους ἐσθίει.',
        tr: 'Çiftçi bakla yer.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Eril İsimler: Bakla (ὁ θέρμος; sıfat olan θερμός [sıcak] ile karıştırılmamalıdır).'
  },
  {
    id: 'filiz_nosos',
    word: 'νόσος',
    lemma: 'ἡ νόσος, τῆς νόσου',
    transliteration: 'nósos',
    partOfSpeech: 'İsim (Dişil, 2. Çekim İstisna)',
    category: 'Tıp & Yaşam',
    frequency: 4,
    meanings_tr: [
      'Hastalık, maraz, illet (2. çekim -ος ile bittiği halde dişil articulus [ἡ] alan istisnai isimlerdendir: ἡ νόσος)'
    ],
    meanings_en: ['sickness, disease, plague (feminine 2nd declension)'],
    etymology: 'Grekçe nosos (hastalık, dert).',
    derivatives: ['nozoloji (hastalık bilimi)', 'nozo- ön eki'],
    grammar: {
      declension: '2. Çekim İstisna (Dişil)',
      nominative: 'ἡ νόσος',
      genitive: 'τῆς νόσου',
      dative: 'τῇ νόσῳ',
      accusative: 'τὴν νόσον'
    },
    examples: [
      {
        greek: 'ἡ νόσος χαλεπή ἐστιν.',
        tr: 'Hastalık ağırdır / zordur.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Dişil İsimler: Hastalık (2. çekim -ος ile bittiği halde dişil articulus [ἡ] alan istisnai isimlerdendir: ἡ νόσος).'
  },
  {
    id: 'filiz_rhome',
    word: 'ῥώμη',
    lemma: 'ἡ ῥώμη, τῆς ῥώμης',
    transliteration: 'rhṓmē',
    partOfSpeech: 'İsim (Dişil, 1. Çekim)',
    category: 'Politika & Toplum',
    frequency: 4,
    meanings_tr: [
      'Güç, kuvvet, bedensel veya ruhsal sağlamlık, kudret'
    ],
    meanings_en: ['bodily strength, might, vigor, force'],
    etymology: 'ῥώννυμι (güçlendirmek, kuvvet kazandırmak) fiilinden türetilmiştir.',
    derivatives: [],
    grammar: {
      declension: '1. Çekim (Dişil)',
      nominative: 'ἡ ῥώμη',
      genitive: 'τῆς ῥώμης',
      dative: 'τῇ ῥώμῃ',
      accusative: 'τὴν ῥώμην'
    },
    examples: [
      {
        greek: 'ἡ ῥώμη τοῦ αὐτουργοῦ μεγάλη ἐστίν.',
        tr: 'Çiftçinin gücü büyüktür.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Dişil İsimler: Güç, kuvvet (ἡ ῥώμη).'
  },
  {
    id: 'filiz_sus',
    word: 'σῦς',
    lemma: 'ὁ / ἡ σῦς, συός',
    transliteration: 'sỹs',
    partOfSpeech: 'İsim (Ortak Cinsiyet, 3. Çekim)',
    category: 'Tarım & Doğa',
    frequency: 3,
    meanings_tr: [
      'Domuz, yaban domuzu (3. çekim ortak cinsiyet: ὁ/ἡ σῦς, gen. συός)'
    ],
    meanings_en: ['swine, pig, boar (common gender)'],
    etymology: 'Hint-Avrupa *sū- (domuz; krş. Latince sus, İngilizce sow).',
    derivatives: [],
    grammar: {
      declension: '3. Çekim (Ortak Cinsiyet)',
      nominative: 'ὁ / ἡ σῦς',
      genitive: 'συός',
      dative: 'συΐ',
      accusative: 'σῦν'
    },
    examples: [
      {
        greek: 'ὁ σῦς ἐν τοῖς ἀγροῖς ἐστιν.',
        tr: 'Domuz tarlalardadır.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca İsimler: Domuz (ὁ/ἡ σῦς, 3. çekim tek heceli isim).'
  },
  {
    id: 'filiz_aix',
    word: 'αἴξ',
    lemma: 'ἡ αἴξ, τῆς αἰγός',
    transliteration: 'aíx',
    partOfSpeech: 'İsim (Dişil, 3. Çekim)',
    category: 'Tarım & Doğa',
    frequency: 3,
    meanings_tr: [
      'Keçi (3. çekim dişil: ἡ αἴξ, gen. αἰγός; telaffuz örneği olarak aiks şeklinde gösterilir)'
    ],
    meanings_en: ['goat (fem. 3rd declension)'],
    etymology: 'Hint-Avrupa *h₂eyǵ- (keçi; krş. Sanskritçe eḍa).',
    derivatives: ['aegis (keçi derisinden kalkan / himaye - Zeus ve Athena kalkanı)'],
    grammar: {
      declension: '3. Çekim (Dişil)',
      nominative: 'ἡ αἴξ',
      genitive: 'αἰγός',
      dative: 'αἰγί',
      accusative: 'αἶγα'
    },
    examples: [
      {
        greek: 'ἡ αἲξ βαδίζει πρὸς τὸν κλῆρον.',
        tr: 'Keçi araziye doğru yürüyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca İsimler: Keçi (ἡ αἴξ, gen. αἰγός; derste telaffuz örneği [aiks] olarak verilmiştir).'
  },
  {
    id: 'filiz_ornis',
    word: 'ὄρνις',
    lemma: 'ὁ / ἡ ὄρνις, ὄρνιθος',
    transliteration: 'órnis',
    partOfSpeech: 'İsim (Ortak Cinsiyet, 3. Çekim)',
    category: 'Tarım & Doğa',
    frequency: 3,
    meanings_tr: [
      'Kuş, kümes hayvanı (3. çekim: ὁ/ἡ ὄρνις, gen. ὄρνιθος; telaffuz örneği ornis)'
    ],
    meanings_en: ['bird, fowl (common gender, 3rd declension)'],
    etymology: 'Hint-Avrupa *h₃or- / *orn- (kuş; krş. Hititçe ḫaraš kartal).',
    derivatives: ['ornitoloji (kuşbilim)'],
    grammar: {
      declension: '3. Çekim (Ortak Cinsiyet)',
      nominative: 'ὁ / ἡ ὄρνις',
      genitive: 'ὄρνιθος',
      dative: 'ὄρνιθι',
      accusative: 'ὄρνιθα / ὄρνιν'
    },
    examples: [
      {
        greek: 'ὁ ὄρνις ἐν τῷ δένδρῳ ᾄδει.',
        tr: 'Kuş ağaçta ötüyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca İsimler: Kuş (ὁ/ἡ ὄρνις, gen. ὄρνιθος; ornitoloji kelimesinin kökeni; derste telaffuz örneği [ornis] olarak verilmiştir).'
  },

  // --- Özel İsimler ---
  {
    id: 'filiz_aigyptos',
    word: 'Αἴγυπτος',
    lemma: 'ἡ Αἴγυπτος, τῆς Αἰγύπτου',
    transliteration: 'Aígyptos',
    partOfSpeech: 'Özel İsim (Dişil, 2. Çekim)',
    category: 'Tarih & Mitoloji',
    frequency: 4,
    meanings_tr: [
      'Mısır (ülke ve diyar adı; ülke adları Yunancada dişil kabul edilir ve dişil artikel alır: ἡ Αἴγυπτος)'
    ],
    meanings_en: ['Egypt (feminine country name)'],
    etymology: 'Antik Mısırca Hwt-ka-Ptah (Ptah ruhunun konağı = Memphis) adının Grekçeleşmiş biçimi.',
    derivatives: ['Egypt (Mısır)', 'Kıpti (Copt / Kopt)'],
    grammar: {
      declension: '2. Çekim (Dişil Özel İsim)',
      nominative: 'ἡ Αἴγυπτος',
      genitive: 'τῆς Αἰγύπτου',
      dative: 'τῇ Αἰγύπτῳ',
      accusative: 'τὴν Αἴγυπτον'
    },
    examples: [
      {
        greek: 'ἡ Αἴγυπτος δῶρον τοῦ ποταμοῦ ἐστιν.',
        tr: "Mısır ırmağın (Nil'in) bir armağanıdır.",
        author: 'Herodotos'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Özel İsimler: Mısır (Aigyptos; ülke adları Yunancada genellikle dişil articulus [ἡ] alır: ἡ Αἴγυπτος).'
  },
  {
    id: 'filiz_archimedes',
    word: 'Ἀρχιμήδης',
    lemma: 'ὁ Ἀρχιμήδης, τοῦ Ἀρχιμήδους',
    transliteration: 'Archimḗdēs',
    partOfSpeech: 'Özel İsim (Eril, 1./3. Çekim Karışık)',
    category: 'Tarih & Mitoloji',
    frequency: 4,
    meanings_tr: [
      'Arşimet (M.Ö. 287-212, Sirakuzalı ünlü Antik Yunan matematikçi, fizikçi, astronom ve mühendis)'
    ],
    meanings_en: ['Archimedes (ancient Greek mathematician and scientist)'],
    etymology: 'ἀρχι- (baş, önder) + μῆδος (akıl, düşünce, plan). "Düşüncenin önderi" demektir.',
    derivatives: ['Arşimet prensibi', 'Arşimet vidası'],
    grammar: {
      declension: 'Özel İsim (Eril)',
      nominative: 'ὁ Ἀρχιμήδης',
      genitive: 'τοῦ Ἀρχιμήδους',
      dative: 'τῷ Ἀρχιμήδει',
      accusative: 'τὸν Ἀρχιμήδην'
    },
    examples: [
      {
        greek: 'εὕρηκα, εὕρηκα! εἶπεν ὁ Ἀρχιμήδης.',
        tr: 'Buldum, buldum! dedi Arşimet.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Özel İsimler: Arşimet (Arkhimēdēs - Sirakuzalı büyük bilgin).'
  },
  {
    id: 'filiz_haides',
    word: 'Ἅιδης',
    lemma: 'ὁ Ἅιδης, τοῦ Ἅιδου',
    transliteration: 'Hā́idēs',
    partOfSpeech: 'Özel İsim (Eril, 1. Çekim)',
    category: 'Tarih & Mitoloji',
    frequency: 4,
    meanings_tr: [
      'Hades (Yunan mitolojisinde yeraltı ve ölüler dünyasının tanrısı; aynı zamanda ölüler diyarı)'
    ],
    meanings_en: ['Hades (god of the underworld, the underworld)'],
    etymology: 'ἀ- (olumsuzluk ön eki) + ἰδεῖν (görmek). "Görünmeyen, görünmez olan" demektir.',
    derivatives: ['Hades'],
    grammar: {
      declension: '1. Çekim (Eril -ης)',
      nominative: 'ὁ Ἅιδης',
      genitive: 'τοῦ Ἅιδου',
      dative: 'τῷ Ἅιδῃ',
      accusative: 'τὸν Ἅιδην'
    },
    examples: [
      {
        greek: 'εἰς Ἅιδου βαδίζει.',
        tr: "Hades'e (ölüler diyarına) gidiyor."
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Özel İsimler: Hades (Haidēs - Yeraltı tanrısı ve ölüler diyarı; 1. çekim eril isim: ὁ Ἅιδης).'
  },
  {
    id: 'filiz_kyros',
    word: 'Κῦρος',
    lemma: 'ὁ Κῦρος, τοῦ Κύρου',
    transliteration: 'Kỹros',
    partOfSpeech: 'Özel İsim (Eril, 2. Çekim)',
    category: 'Tarih & Mitoloji',
    frequency: 4,
    meanings_tr: [
      'Kyros (Pers kralı Büyük Kyros veya Genç Kyros; Ksenophon\'un Anabasis ve Kyrou Paideia eserlerinin kahramanı)'
    ],
    meanings_en: ['Cyrus (Cyrus the Great or Cyrus the Younger, Persian prince/king)'],
    etymology: 'Eski Farsça Kūruš adının Grekçeleşmiş biçimi.',
    derivatives: ['Kyrou Paideia (Kyros\'un Eğitimi)'],
    grammar: {
      declension: '2. Çekim (Eril)',
      nominative: 'ὁ Κῦρος',
      genitive: 'τοῦ Κύρου',
      dative: 'τῷ Κύρῳ',
      accusative: 'τὸν Κῦρον'
    },
    examples: [
      {
        greek: 'ὁ δὲ Κῦρος ἐπορεύετο διὰ τῆς χώρας.',
        tr: 'Kyros ise ülke boyunca ilerliyordu.',
        author: 'Ksenophon',
        work: 'Anabasis'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Özel İsimler: Kyros (gen: Κύρου; Ksenophon\'un metinlerinde sıkça geçen Pers önderi).'
  },
  {
    id: 'filiz_homeros',
    word: 'Ὅμηρος',
    lemma: 'ὁ Ὅμηρος, τοῦ Ὁμήρου',
    transliteration: 'Hómēros',
    partOfSpeech: 'Özel İsim (Eril, 2. Çekim)',
    category: 'Edebiyat & Sanat',
    frequency: 5,
    meanings_tr: [
      'Homeros (İlyada ve Odysseia destanlarının efsanevi ozanı)'
    ],
    meanings_en: ['Homer (epic poet, author of the Iliad and Odyssey)'],
    etymology: 'ὁμηρέω (birlikte olmak, rehin/teminat vermek) veya dize örmek kökünden.',
    derivatives: ['Homerik'],
    grammar: {
      declension: '2. Çekim (Eril)',
      nominative: 'ὁ Ὅμηρος',
      genitive: 'τοῦ Ὁμήρου',
      dative: 'τῷ Ὁμήρῳ',
      accusative: 'τὸν Ὅμηρον'
    },
    examples: [
      {
        greek: 'Ὅμηρος ὁ τῶν ποιητῶν ἄριστος.',
        tr: 'Homeros şairlerin en iyisidir.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Özel İsimler: Homeros (Homēros - İlyada ve Odysseia\'nın büyük ozanı).'
  },

  // --- 3. Sıfatlar ve Sayılar ---
  {
    id: 'filiz_atonos',
    word: 'ἄτονος',
    lemma: 'ἄτονος, -ον',
    transliteration: 'átonos',
    partOfSpeech: 'Sıfat (2 Takılı)',
    category: 'Gramer & Zamirler',
    frequency: 3,
    meanings_tr: [
      'Tonsuz, vurgusuz (dilbilgisinde üzerinde vurgu bulunmayan sözcükler: proklitica ve enklitica)',
      'Gevşek, gerilimsiz (tıpta tonus kaybı)'
    ],
    meanings_en: ['unaccented, without tone, unstressed (grammar); limp, lacking tone'],
    etymology: 'ἀ- (olumsuzluk eki: alpha privativum) + τόνος (ton, ses perdesi, vurgu, gerilim).',
    derivatives: ['atoni (tıpta kas gerilimsizliği)'],
    grammar: {
      masculine_feminine: 'ἄτονος',
      neuter: 'ἄτονον'
    },
    examples: [
      {
        greek: 'αἱ ἄτονοι λέξεις οὐκ ἔχουσι τόνον.',
        tr: 'Tonsuz / vurgusuz sözcüklerin vurgusu yoktur.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Dilbilgisi Terimi: Tonsuz, vurgusuz (üzerinde vurgu işareti taşımayan sözcükler: proklitica ve enklitica).'
  },
  {
    id: 'filiz_dikaios',
    word: 'δίκαιος',
    lemma: 'δίκαιος, -α, -ον',
    transliteration: 'díkaios',
    partOfSpeech: 'Sıfat (3 Takılı)',
    category: 'Felsefe',
    frequency: 5,
    meanings_tr: [
      'Adil, hakkaniyetli, doğru, dürüst, yasalara uygun davranan (dat. pl: τοῖς δικαίοις)'
    ],
    meanings_en: ['just, righteous, lawful, fair'],
    etymology: 'δίκη (hak, adalet, yasa) isminden türetilmiştir. Δικαιόπολις adının ilk bileşenidir.',
    derivatives: ['teodise (tanrı adaleti: theos + dike)'],
    grammar: {
      masculine: 'δίκαιος',
      feminine: 'δικαία',
      neuter: 'δίκαιον',
      dat_pl: 'τοῖς δικαίοις'
    },
    examples: [
      {
        greek: 'ὁ δίκαιος ἄνθρωπος εὐδαίμων ἐστίν.',
        tr: 'Adil insan mutludur.',
        author: 'Platon'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sıfatlar: Adil, hakkaniyetli (dat. pl: τοῖς δικαίοις; Δικαιόπολις [Adil Yurttaş] adının kökü; derste telaffuz örneği olarak da geçer).'
  },
  {
    id: 'filiz_hen',
    word: 'ἕν',
    lemma: 'εἷς, μία, ἕν',
    transliteration: 'hén',
    partOfSpeech: 'Sayı Sıfatı (Nötr)',
    category: 'Gramer & Zamirler',
    frequency: 5,
    meanings_tr: [
      'Bir (sayı sıfatı - nötr formu ἕν; eril εἷς, dişil μία; edat olan ἐν [içinde] ile soluk işareti farkına dikkat edilmelidir: ἕν sert soluk, ἐν yumuşak soluk)'
    ],
    meanings_en: ['one (neuter numeral: heis, mia, hen)'],
    etymology: 'Hint-Avrupa *sem- / *sm- (bir, tek; krş. Latince semel, simplex, İngilizce same).',
    derivatives: ['henoteizm (tek tanrıcılık)', 'hendiadys (iki sözcükle tek mana verme)'],
    grammar: {
      masculine: 'εἷς',
      feminine: 'μία',
      neuter: 'ἕν',
      genitive: 'ἑνός'
    },
    examples: [
      {
        greek: 'ἓν μέτρον πάντων.',
        tr: 'Her şeyin tek bir ölçüsü.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sayılar: Bir (sayı; nötr formu ἕν; eril εἷς, dişil μία; edat olan ἐν [içinde] ile soluk işareti farkına dikkat edilmelidir: ἕν sert soluk, ἐν yumuşak soluk).'
  },
  {
    id: 'filiz_thermos_adj',
    word: 'θερμός',
    lemma: 'θερμός, -ή, -όν',
    transliteration: 'thermós',
    partOfSpeech: 'Sıfat (3 Takılı)',
    category: 'Tarım & Doğa',
    frequency: 4,
    meanings_tr: [
      'Sıcak, ılık, hararetli, ateşli'
    ],
    meanings_en: ['warm, hot, fervent'],
    etymology: 'Hint-Avrupa *gʷʰer- (sıcak olmak; krş. İngilizce warm, Latince formus).',
    derivatives: ['termometre', 'termik', 'termostat', 'termal', 'hipotermi'],
    grammar: {
      masculine: 'θερμός',
      feminine: 'θερμή',
      neuter: 'θερμόν'
    },
    examples: [
      {
        greek: 'ὁ ἥλιος θερμός ἐστιν.',
        tr: 'Güneş sıcaktır.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sıfatlar: Sıcak (ὁ ἥλιος θερμός ἐστιν = Güneş sıcaktır; bileşik türevler: termometre, termal).'
  },
  {
    id: 'filiz_moros',
    word: 'μῶρος',
    lemma: 'μῶρος, -α, -ον',
    transliteration: 'mõros',
    partOfSpeech: 'Sıfat (3 Takılı)',
    category: 'Felsefe',
    frequency: 3,
    meanings_tr: [
      'Aptal, ahmak, budala, akılsız'
    ],
    meanings_en: ['dull, sluggish, foolish, stupid, silly'],
    etymology: 'Grekçe mōros (ahmak, budala).',
    derivatives: ['moron (ahmak)', 'oksimoron (keskin-aptallık tezadı: oxys + moros)'],
    grammar: {
      masculine: 'μῶρος',
      feminine: 'μώρα',
      neuter: 'μῶρον'
    },
    examples: [
      {
        greek: 'ὁ μῶρος οὐ γιγνώσκει τὸν λόγον.',
        tr: 'Aptal olan mantığı / sözü kavrayamaz.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sıfatlar: Aptal, ahmak (moron ve oksimoron kelimelerinin kökenidir).'
  },
  {
    id: 'filiz_pistos',
    word: 'πιστός',
    lemma: 'πιστός, -ή, -όν',
    transliteration: 'pistós',
    partOfSpeech: 'Sıfat (3 Takılı)',
    category: 'Felsefe',
    frequency: 4,
    meanings_tr: [
      'Sadık, güvenilir, vefalı, inanılır'
    ],
    meanings_en: ['faithful, trustworthy, reliable, loyal'],
    etymology: 'πείθω (ikna etmek, inandırmak) fiilinden; πίστις (inanç, güven) kökü.',
    derivatives: ['epistemoloji (episteme üzerinden felsefe)'],
    grammar: {
      masculine: 'πιστός',
      feminine: 'πιστή',
      neuter: 'πιστόν'
    },
    examples: [
      {
        greek: 'ὁ δοῦλος πιστός ἐστιν τῷ δεσπότῃ.',
        tr: 'Köle efendisine sadıktır.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sıfatlar: Sadık, güvenilir (ὁ πιστὸς δοῦλος = sadık köle).'
  },
  {
    id: 'filiz_hypekoos',
    word: 'ὑπήκοος',
    lemma: 'ὑπήκοος, -ον',
    transliteration: 'hypḗkoos',
    partOfSpeech: 'Sıfat (2 Takılı)',
    category: 'Politika & Toplum',
    frequency: 3,
    meanings_tr: [
      'Bağımlı, tebaa, söz dinleyen, boyun eğen'
    ],
    meanings_en: ['obedient, subject to, tributary, submissive'],
    etymology: 'ὑπό (altında) + ἀκούω (işitmek, dinlemek). "Emri altında dinleyen / söz dinleyen" demektir.',
    derivatives: [],
    grammar: {
      masculine_feminine: 'ὑπήκοος',
      neuter: 'ὑπήκοον'
    },
    examples: [
      {
        greek: 'οἱ ὑπήκοοι ἄνθρωποι τῷ τυράννῳ πείθονται.',
        tr: 'Bağımlı insanlar tirana boyun eğerler.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Sıfatlar: Bağımlı, tebaa (söz dinleyen, boyun eğen; kök: ὑπό + ἀκούω).'
  },

  // --- Zarflar, Edatlar, Ön Ekler ---
  {
    id: 'filiz_kalos_adv',
    word: 'καλῶς',
    lemma: 'καλῶς',
    transliteration: 'kalõs',
    partOfSpeech: 'Zarf',
    category: 'Zarflar & Edatlar',
    frequency: 4,
    meanings_tr: [
      'Güzel bir biçimde, iyi şekilde, layıkıyla, hakkıyla'
    ],
    meanings_en: ['well, beautifully, properly, rightly'],
    etymology: 'καλός (güzel, iyi) sıfatının düzenli zarf hali (-ως ekiyle).',
    derivatives: [],
    grammar: {
      type: 'Niteleme Zarfı'
    },
    examples: [
      {
        greek: 'καλῶς ποιεῖς.',
        tr: 'İyi yapıyorsun (aferin).'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Zarflar: Güzel bir biçimde, iyi şekilde (καλός sıfatından -ως ekiyle türetilmiş niteleme zarfı).'
  },
  {
    id: 'filiz_hos',
    word: 'ὡς',
    lemma: 'ὡς / ὥς',
    transliteration: 'hōs',
    partOfSpeech: 'Zarf / Bağlaç',
    category: 'Zarflar & Edatlar',
    frequency: 5,
    meanings_tr: [
      'Gibi, olarak, nasıl ki, -dığı gibi; telaffuz örneği (hōs); zira, çünkü, -dığı için'
    ],
    meanings_en: ['as, like, how, that, because'],
    etymology: 'İlgi zamirinden türetilmiş modal zarf.',
    derivatives: [],
    grammar: {
      type: 'Zarf / Bağlaç'
    },
    examples: [
      {
        greek: 'ὡς λέγει ὁ Ὅμηρος.',
        tr: 'Homeros\'un dediği gibi.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Zarflar: Gibi, olarak; metinde telaffuz örneği olarak (hōs) geçmektedir.'
  },
  {
    id: 'filiz_ge',
    word: 'γέ',
    lemma: 'γέ',
    transliteration: 'gé',
    partOfSpeech: 'Edat (Enklitik Parçacık)',
    category: 'Edatlar & Bağlaçlar',
    frequency: 4,
    meanings_tr: [
      'Şüphesiz, en azından, gerçekten, hele, bilhassa (kendinden önceki sözcüğü vurgulayan enklitik edat)'
    ],
    meanings_en: ['at least, at any rate, indeed, truly (enclitic emphasizing particle)'],
    etymology: 'Hint-Avrupa pekiştirme parçacığı *ge.',
    derivatives: [],
    grammar: {
      type: 'Enklitik Parçacık (Postpositivum)'
    },
    examples: [
      {
        greek: 'ἔγωγε.',
        tr: 'Ben şahsen / bana gelince (ἐγώ + γε).'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Edatlar: Şüphesiz, en azından, doğrusu (enklitik vurgu edatı; kendinden önceki sözcüğe dayanır).'
  },
  {
    id: 'filiz_alpha_privativum',
    word: 'ἀ- / ἀν-',
    lemma: 'ἀ- / ἀν- (alpha privativum)',
    transliteration: 'a- / an-',
    partOfSpeech: 'Ön Ek (Yoksunluk / Olumsuzluk Eki)',
    category: 'Gramer & Zamirler',
    frequency: 5,
    meanings_tr: [
      'Alpha privativum: Başına eklendiği sözcüğe olumsuzluk, yoksunluk katan ön ek (Türkçe -siz/-siz eki, İngilizce un- / a-); ünsüzlerden önce ἀ-, ünlülerden önce ἀν- gelir'
    ],
    meanings_en: ['alpha privative: negative/privative prefix (un-, non-, without)'],
    etymology: 'Hint-Avrupa *n̥- (olumsuzluk ön eki; krş. Latince in-, İngilizce un-).',
    derivatives: ['ateizm (a + theos)', 'anarşi (an + arche)', 'asimetri (a + symmetria)', 'amoral'],
    grammar: {
      rule: 'Ünsüzlerden önce ἀ- (örn. ἄ-οκνος, ἄ-τονος), ünlülerden önce ἀν- (örn. ἀν-αρχία).'
    },
    examples: [
      {
        greek: 'ἄ-οκνος (tembellik etmeyen = enerjik), ἄ-τονος (vurgusuz).',
        tr: 'Alpha privativum ile türetilmiş sözcükler.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Dilbilgisi: Alpha privativum (ἀ- / ἀν-). Başına eklendiği sözcüğe olumsuzluk katan ön ek (krş. ἄ-οκνος enerjik, ἄ-τονος vurgusuz).'
  },

  // --- 4. Metinlerde Geçen Önemli Kalıplar ve İfadeler ---
  {
    id: 'filiz_en_to_agro',
    word: 'ἐν τῷ ἀγρῷ',
    lemma: 'ἐν τῷ ἀγρῷ',
    transliteration: 'en tõi agrõi',
    partOfSpeech: 'Edatlı Öbek (Yer Tümleci)',
    category: 'Tarım & Doğa',
    frequency: 4,
    meanings_tr: [
      'Tarlada, arazide (tekil yer tümleci: ἐν + dativus singularis)'
    ],
    meanings_en: ['in the field, on the land'],
    etymology: 'ἐν (içinde, -de) + τῷ ἀγρῷ (tarlada).',
    derivatives: [],
    grammar: {
      case: 'Dativus Loci',
      structure: 'ἐν + dativus singularis'
    },
    examples: [
      {
        greek: 'ὁ Δικαιόπολις πονεῖ ἐν τῷ ἀγρῷ.',
        tr: 'Dikaiopolis tarlada çalışıyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Tarlada, arazide (ἐν τῷ ἀγρῷ - tekil yer bildiren edatlı öbek).'
  },
  {
    id: 'filiz_ek_tou_agrou',
    word: 'ἐκ τοῦ ἀγροῦ',
    lemma: 'ἐκ τοῦ ἀγροῦ',
    transliteration: 'ek toũ agroũ',
    partOfSpeech: 'Edatlı Öbek (Çıkış Tümleci)',
    category: 'Tarım & Doğa',
    frequency: 4,
    meanings_tr: [
      'Tarladan, araziden (-den çıkış bildiren öbek: ἐκ + genitivus)'
    ],
    meanings_en: ['out of the field, from the land'],
    etymology: 'ἐκ (içinden, -den) + τοῦ ἀγροῦ (tarlanın).',
    derivatives: [],
    grammar: {
      case: 'Ablativus / Genitivus Separationis',
      structure: 'ἐκ + genitivus'
    },
    examples: [
      {
        greek: 'βαδίζει ἐκ τοῦ ἀγροῦ οἴκαδε.',
        tr: 'Tarladan eve doğru yürüyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Tarladan (ἐκ τοῦ ἀγροῦ - çıkış/ayrılma bildiren edatlı öbek: ἐκ + genitivus).'
  },
  {
    id: 'filiz_hypo_to_dendro',
    word: 'ὑπὸ τῷ δένδρῳ',
    lemma: 'ὑπὸ τῷ δένδρῳ',
    transliteration: 'hypò tõi déndrōi',
    partOfSpeech: 'Edatlı Öbek (Yer Tümleci)',
    category: 'Tarım & Doğa',
    frequency: 4,
    meanings_tr: [
      'Ağacın altında (durağan durum/konum bildiren öbek: ὑπό + dativus)'
    ],
    meanings_en: ['under the tree'],
    etymology: 'ὑπό (altında) + τῷ δένδρῳ (ağacın).',
    derivatives: [],
    grammar: {
      case: 'Dativus Loci',
      structure: 'ὑπό + dativus'
    },
    examples: [
      {
        greek: 'ὁ γεωργὸς καθίζει ὑπὸ τῷ δένδρῳ.',
        tr: 'Çiftçi ağacın altında oturuyor.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Ağacın altında (ὑπὸ τῷ δένδρῳ - durağan konum bildiren öbek: ὑπό + dativus).'
  },
  {
    id: 'filiz_ton_eniauton',
    word: 'τὸν ἐνιαυτόν',
    lemma: 'τὸν ἐνιαυτόν (kalıp)',
    transliteration: 'tòn eniautón',
    partOfSpeech: 'Zaman Zarfı / Kalıp İfade',
    category: 'Gramer & Zamirler',
    frequency: 4,
    meanings_tr: [
      'Yıl boyunca, bütün bir yıl (accusativus temporis / zaman akusatifi)'
    ],
    meanings_en: ['throughout the year, for a year (accusative of duration of time)'],
    etymology: 'τὸν (articulus acc.) + ἐνιαυτόν (yıl). Süreç bildiren akusatif kuralı.',
    derivatives: [],
    grammar: {
      case: 'Accusativus Temporis',
      function: 'Eylemin ne kadar süre boyunca sürdüğünü belirtir.'
    },
    examples: [
      {
        greek: 'τὸν ἐνιαυτὸν μάλα κάμνει.',
        tr: 'Yıl boyunca çok yorulur.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Yıl boyunca (accusativus temporis - süreyi bildiren accusativus yapısı: τὸν ἐνιαυτόν).'
  },
  {
    id: 'filiz_polyn_chronon',
    word: 'πολὺν χρόνον',
    lemma: 'πολὺν χρόνον (kalıp)',
    transliteration: 'polỳn chrónon',
    partOfSpeech: 'Zaman Zarfı / Kalıp İfade',
    category: 'Gramer & Zamirler',
    frequency: 4,
    meanings_tr: [
      'Uzun süre, uzun zaman boyunca (accusativus temporis)'
    ],
    meanings_en: ['for a long time (accusative of duration of time)'],
    etymology: 'πολύν (çok, acc.) + χρόνον (zaman, acc.).',
    derivatives: [],
    grammar: {
      case: 'Accusativus Temporis'
    },
    examples: [
      {
        greek: 'πολὺν χρόνον ἡσυχάζει.',
        tr: 'Uzun süre dinlenir.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Uzun süre (accusativus temporis: πολὺν χρόνον).'
  },
  {
    id: 'filiz_ou_polyn_chronon',
    word: 'οὐ πολὺν χρόνον',
    lemma: 'οὐ πολὺν χρόνον (kalıp)',
    transliteration: 'ou polỳn chrónon',
    partOfSpeech: 'Zaman Zarfı / Kalıp İfade',
    category: 'Gramer & Zamirler',
    frequency: 4,
    meanings_tr: [
      'Kısa süre, çok uzun olmayan bir süre, az bir zaman (accusativus temporis)'
    ],
    meanings_en: ['for not a long time, for a short while'],
    etymology: 'οὐ (değil) + πολὺν χρόνον (uzun süre).',
    derivatives: [],
    grammar: {
      case: 'Accusativus Temporis'
    },
    examples: [
      {
        greek: 'οὐ πολὺν χρόνον ἡσυχάζει ὁ γεωργός.',
        tr: 'Çiftçi uzun süre değil (kısa süre) dinlenir.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Kısa süre, çok uzun olmayan bir süre (accusativus temporis: οὐ πολὺν χρόνον).'
  },
  {
    id: 'filiz_mala_kamnei',
    word: 'μάλα κάμνει',
    lemma: 'μάλα κάμνει (kalıp)',
    transliteration: 'mála kámnei',
    partOfSpeech: 'Kalıp İfade / Deyim',
    category: 'Temel Fiiller',
    frequency: 4,
    meanings_tr: [
      'Çok yorulur, pek yorulur, takatten düşer'
    ],
    meanings_en: ['he/she is very weary, becomes exceedingly tired'],
    etymology: 'μάλα (çok) + κάμνει (yoruluyor).',
    derivatives: [],
    grammar: {
      structure: 'Zarf + 3. tekil etken fiil'
    },
    examples: [
      {
        greek: 'ὁ γὰρ πόνος πολὺς ἐστιν, καὶ μάλα κάμνει.',
        tr: 'Çünkü zahmet çoktur ve çok yorulur.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Çok yorulur (μάλα κάμνει).'
  },
  {
    id: 'filiz_epairei_heauton',
    word: 'ἐπαίρει ἑαυτόν',
    lemma: 'ἐπαίρει ἑαυτόν (kalıp)',
    transliteration: 'epaírei heautón',
    partOfSpeech: 'Kalıp İfade / Deyim',
    category: 'Temel Fiiller',
    frequency: 4,
    meanings_tr: [
      'Kendini kaldırıyor, ayağa kalkıyor, doğruluyor'
    ],
    meanings_en: ['he lifts himself up, rises, gets up'],
    etymology: 'ἐπαίρω (yükseltmek, kaldırmak) + ἑαυτόν (kendini).',
    derivatives: [],
    grammar: {
      structure: 'Fiil + Dönüşlü Zamir'
    },
    examples: [
      {
        greek: 'τέλος δὲ ἐπαίρει ἑαυτὸν καὶ βαδίζει.',
        tr: 'Sonunda kendini kaldırır (ayağa kalkar) ve yürür.'
      }
    ],
    isFilizHoca: true,
    tags: ['filiz_hoca'],
    filiz_notes: 'Filiz Hoca Metin Kalıpları: Kendini kaldırıyor / ayağa kalkıyor (ἐπαίρει ἑαυτόν).'
  }
];

// Append new entries (checking for duplicate ID first)
let addedCount = 0;
newEntries.forEach(ne => {
  const existingIdx = dict.findIndex(d => d.id === ne.id);
  if (existingIdx !== -1) {
    dict[existingIdx] = ne; // overwrite if already exists
    console.log('Overwrote existing entry with id:', ne.id);
  } else {
    dict.push(ne);
    addedCount++;
  }
});

console.log('Added new entries count:', addedCount);
console.log('Final dictionary entries count:', dict.length);

const finalFiliz = dict.filter(d => d.isFilizHoca || (d.tags && d.tags.includes('filiz_hoca')));
console.log('Final Filiz Hoca entries count:', finalFiliz.length);

// 5. Serialize back to data/dictionary.js
const outputCode = 'window.ANCIENT_GREEK_DICTIONARY = ' + JSON.stringify(dict, null, 2) + ';\n';
fs.writeFileSync(dictPath, outputCode, 'utf8');
console.log('Successfully written to data/dictionary.js');
