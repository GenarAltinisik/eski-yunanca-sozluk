const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dictPath = path.join(__dirname, '..', 'data', 'dictionary.js');
const rawCode = fs.readFileSync(dictPath, 'utf8');

const sandbox = { window: {} };
vm.runInNewContext(rawCode, sandbox);
let dict = sandbox.window.ANCIENT_GREEK_DICTIONARY;

console.log('Initial dict length:', dict.length);

// 1. Remove the redundant phrase/idiom entries that duplicate base words
const idsToRemove = [
  'filiz_en_to_agro',
  'filiz_ek_tou_agrou',
  'filiz_hypo_to_dendro',
  'filiz_ton_eniauton',
  'filiz_polyn_chronon',
  'filiz_ou_polyn_chronon',
  'filiz_mala_kamnei',
  'filiz_epairei_heauton',
  'filiz_en_tais_athenais',
  'filiz_en_tois_agrois'
];

dict = dict.filter(d => !idsToRemove.includes(d.id));
console.log('After removing phrase cards:', dict.length);

// 2. Enrich parent/base words with how the patterns work

// (A) ἐνιαυτός (Accusativus Temporis)
const eniautos = dict.find(d => d.id === 'filiz_eniautos');
if (eniautos) {
  eniautos.meanings_tr = [
    'Yıl, sene',
    'Accusativus Temporis kalıbı (τὸν ἐνιαυτόν): Bütün bir yıl boyunca'
  ];
  eniautos.filiz_notes = 'Filiz Hoca İsimler: Yıl (acc: τὸν ἐνιαυτόν). 📐 Gramer Kalıbı — Accusativus Temporis: Bir eylemin ne kadar süre boyunca sürdüğünü bildirmek için edatsız akusatif kullanılır: τὸν ἐνιαυτόν = bütün bir yıl boyunca (Athenaze: τὸν ἐνιαυτὸν μάλα κάμνει).';
  if (!eniautos.examples) eniautos.examples = [];
  if (!eniautos.examples.some(e => e.greek.includes('τὸν ἐνιαυτὸν'))) {
    eniautos.examples.unshift({
      greek: 'τὸν ἐνιαυτὸν ἅπαντα πονεῖ ὁ αὐτουργός.',
      tr: 'Çiftçi bütün bir yıl boyunca çalışır (Accusativus Temporis kalıbı).'
    });
  }
}

// (B) χρόνος (Accusativus Temporis)
const chronos = dict.find(d => d.id === 'chronos');
if (chronos) {
  if (!chronos.meanings_tr.some(m => m.includes('Accusativus Temporis'))) {
    chronos.meanings_tr.push('Accusativus Temporis kalıpları: πολὺν χρόνον (uzun süre boyunca), οὐ πολὺν χρόνον (kısa süre boyunca / çok uzun sürmeden)');
  }
  chronos.filiz_notes = 'Filiz Hoca Eril İsimler: Zaman (acc: χρόνον). 📐 Gramer Kalıbı — Accusativus Temporis: Eylemin süresini bildiren edatsız akusatif yapısı: πολὺν χρόνον = uzun süre boyunca; οὐ πολὺν χρόνον = kısa süre / uzun olmayan bir süre boyunca.';
  if (!chronos.examples) chronos.examples = [];
  chronos.examples.unshift(
    {
      greek: 'πολὺν χρόνον ἡσυχάζει ὁ γεωργός.',
      tr: 'Çiftçi uzun süre dinlenir (Accusativus Temporis kalıbı).'
    },
    {
      greek: 'οὐ πολὺν χρόνον κάμνει.',
      tr: 'Kısa süre yorulur (uzun süre değil).'
    }
  );
}

// (C) πολύς
const polys = dict.find(d => d.id === 'ath_pols');
if (polys) {
  polys.filiz_notes = 'Filiz Hoca Sıfatlar: Çok, birçok (acc: πολύν). 📐 Süreç Kalıbı: πολὺν χρόνον = uzun süre boyunca (accusativus temporis).';
}

// (D) ἀγρός (Edat kalıpları: ἐν, ἐκ)
const agros = dict.find(d => d.id === 'ath_agrs');
if (agros) {
  if (!agros.meanings_tr.some(m => m.includes('Edat kalıpları'))) {
    agros.meanings_tr.push('Edat kalıpları: ἐν τῷ ἀγρῷ (tarlada - tekil yer dativi), ἐκ τοῦ ἀγροῦ (tarladan - ayrılma/çıkış), ἐν τοῖς ἀγροῖς (kırda / tarlalarda - çoğul)');
  }
  agros.filiz_notes = 'Filiz Hoca Eril İsimler: Çiftlik, tarla, kır (acc: τὸν ἀγρόν). 📐 Edat ve Hâl Kalıpları: ἐν τῷ ἀγρῷ = tarlada (tekil yer dativi: ἐν + dativus); ἐκ τοῦ ἀγροῦ = tarladan (ayrılma/çıkış: ἐκ + genitivus); ἐν τοῖς ἀγροῖς = kırsalda, tarlalarda (çoğul yer dativi).';
  if (!agros.examples) agros.examples = [];
  agros.examples.unshift({
    greek: 'ὁ Δικαιόπολις πονεῖ ἐν τῷ ἀγρῷ, ἔπειτα δὲ βαδίζει ἐκ τοῦ ἀγροῦ οἴκαδε.',
    tr: 'Dikaiopolis tarlada çalışır, sonra da tarladan eve doğru yürür.'
  });
}

// (E) δένδρον (ὑπὸ τῷ δένδρῳ)
const dendron = dict.find(d => d.id === 'ath_dndron');
if (dendron) {
  dendron.filiz_notes = 'Filiz Hoca Cinssiz (Nötr) İsimler: Ağaç (dat: τῷ δένδρῳ). 📐 Edat Kalıbı: ὑπὸ τῷ δένδρῳ = ağacın altında (durağan konum: ὑπό + dativus; örn: ὁ γεωργὸς καθίζει ὑπὸ τῷ δένδρῳ).';
  if (!dendron.examples) dendron.examples = [];
  dendron.examples.unshift({
    greek: 'ὁ γεωργὸς καθίζει ὑπὸ τῷ δένδρῳ.',
    tr: 'Çiftçi ağacın altında oturuyor (ὑπό + dativus durağan yer kalıbı).'
  });
}

// (F) Ἀθῆναι (ἐν ταῖς Ἀθήναις)
const athenai = dict.find(d => d.id === 'ath_athnai');
if (athenai) {
  athenai.filiz_notes = "Filiz Hoca Özel İsimler: Atina (çoğul dişil: αἱ Ἀθῆναι, dat. pl: ταῖς Ἀθήναις). 📐 Edat Kalıbı: ἐν ταῖς Ἀθήναις = Atina'da (şehir isimlerinde yer bildirme: ἐν + dativus pluralis).";
  if (!athenai.examples) athenai.examples = [];
  athenai.examples.unshift({
    greek: 'ὁ Δικαιόπολις οὐκ οἰκεῖ ἐν ταῖς Ἀθήναις, ἀλλ\' ἐν τοῖς ἀγροῖς.',
    tr: "Dikaiopolis Atina'da değil, kırsalda (tarlalarda) yaşar."
  });
}

// (G) ἐν edatı
const en = dict.find(d => d.id === 'en');
if (en) {
  en.filiz_notes = 'Filiz Hoca Edatlar: İçinde, -de/-da (+ Dativus: bulunma / Dativus Loci bildirir). 📐 Metin Kalıpları: ἐν τῷ ἀγρῷ (tarlada), ἐν τοῖς ἀγροῖς (kırsalda), ἐν ταῖς Ἀθήναις (Atina\'da).';
}

// (H) ἐκ edatı
const ek = dict.find(d => d.id === 'ek');
if (ek) {
  ek.filiz_notes = 'Filiz Hoca Edatlar: -den, -dan (+ Genitivus: içinden çıkış / ayrılma bildirir). 📐 Metin Kalıbı: ἐκ τοῦ ἀγροῦ (tarladan eve doğru).';
}

// (I) ὑπό edatı
const hypo = dict.find(d => d.id === 'ath_hyp');
if (hypo) {
  hypo.filiz_notes = 'Filiz Hoca Edatlar: Altında (+ Dativus: durağan konum bildirir; + Accusativus: altına doğru yönelme). 📐 Metin Kalıbı: ὑπὸ τῷ δένδρῳ (ağacın altında).';
}

// (J) ἐπαίρω & ἑαυτόν (Dönüşlü kalıp)
const epairo = dict.find(d => d.id === 'ath_epar');
if (epairo) {
  epairo.filiz_notes = 'Filiz Hoca Fiiller: Yukarı kaldırıyorum, yükseltiyorum (3. tekil: ἐπαίρει). 📐 Dönüşlü Fiil Kalıbı: ἐπαίρει ἑαυτόν = kendini kaldırıyor / ayağa kalkıyor (fiil + dönüşlü zamir; Athenaze: τέλος δὲ ἐπαίρει ἑαυτόν).';
  if (!epairo.examples) epairo.examples = [];
  epairo.examples.unshift({
    greek: 'τέλος δὲ ἐπαίρει ἑαυτὸν καὶ βαδίζει.',
    tr: 'Sonunda kendini kaldırır (ayağa kalkar) ve yürür.'
  });
}

const heauton = dict.find(d => d.id === 'ath_heautn');
if (heauton) {
  heauton.filiz_notes = 'Filiz Hoca Zamirler: Kendini, kendi kendini (3. şahıs dönüşlü zamir). 📐 Dönüşlü Kalıp: ἐπαίρει ἑαυτόν = kendini kaldırıyor / ayağa kalkıyor.';
}

// (K) κάμνω & μάλα (Pekiştirme kalıbı)
const kamno = dict.find(d => d.id === 'ath_kmn');
if (kamno) {
  kamno.filiz_notes = 'Filiz Hoca Fiiller: Yoruluyorum, tükeniyorum (3. tekil: κάμνει). 📐 Derecelendirme Kalıbı: μάλα κάμνει = çok yorulur / son derece bitkin düşer (Athenaze: καὶ μάλα κάμνει).';
  if (!kamno.examples) kamno.examples = [];
  kamno.examples.unshift({
    greek: 'ὁ γὰρ πόνος πολὺς ἐστιν, καὶ μάλα κάμνει.',
    tr: 'Çünkü zahmet çoktur ve çok yorulur.'
  });
}

const mala = dict.find(d => d.id === 'ath_mla');
if (mala) {
  mala.filiz_notes = 'Filiz Hoca Zarflar: Çok, pek. 📐 Fiil Pekiştirme Kalıbı: μάλα κάμνει = çok yorulur / takati tükenir (zarf + fiil).';
}

// Write back
const outputCode = 'window.ANCIENT_GREEK_DICTIONARY = ' + JSON.stringify(dict, null, 2) + ';\n';
fs.writeFileSync(dictPath, outputCode, 'utf8');
console.log('Successfully updated data/dictionary.js! New length:', dict.length);
