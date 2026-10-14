// Ancient Greek Grammar & Declension Tables
window.GREEK_GRAMMAR = {
  "article": {
    "title": "Belirteç Çekimi (ὁ, ἡ, τό - The Definite Article)",
    "description": "Eski Yunancada harf-i tarif (artikeller) isimlerin cinsiyetine (eril, dişil, nötr), büküm haline ve sayısına göre çekimlenir.",
    "cases": [
      "Nominativ (Yalın)",
      "Genitiv (-in / Tamlayan)",
      "Dativ (-e, -de, -ile)",
      "Accusativ (-i / Belirtme)"
    ],
    "singular": {
      "masculine": [
        "ὁ",
        "τοῦ",
        "τῷ",
        "τόν"
      ],
      "feminine": [
        "ἡ",
        "τῆς",
        "τῇ",
        "τήν"
      ],
      "neuter": [
        "τό",
        "τοῦ",
        "τῷ",
        "τό"
      ]
    },
    "plural": {
      "masculine": [
        "οἱ",
        "τῶν",
        "τοῖς",
        "τούς"
      ],
      "feminine": [
        "αἱ",
        "τῶν",
        "ταῖς",
        "τάς"
      ],
      "neuter": [
        "τά",
        "τῶν",
        "τοῖς",
        "τά"
      ]
    },
    "dual": {
      "nom_acc": [
        "τώ",
        "τώ (veya τά)",
        "τώ"
      ],
      "gen_dat": [
        "τοῖν",
        "τοῖν (veya ταῖν)",
        "τοῖν"
      ]
    }
  },
  "declension_2": {
    "title": "İkinci Çekim: Eril ve Nötr İsimler (-ος, -ον)",
    "description": "Tematik isim çekimi (o-stem). Eski Yunancanın en yaygın isim grubudur. Örnek: λόγος (söz/akıl, eril) ve δῶρον (hediye, nötr).",
    "cases": [
      "Nominativ (Yalın)",
      "Genitiv (-in)",
      "Dativ (-e/ile)",
      "Accusativ (-i)",
      "Vocativ (Hitap)"
    ],
    "logos_masc": {
      "name": "λόγος, -ου, ὁ (akıl/söz - Eril)",
      "singular": [
        "λόγος",
        "λόγου",
        "λόγῳ",
        "λόγον",
        "λόγε"
      ],
      "plural": [
        "λόγοι",
        "λόγων",
        "λόγοις",
        "λόγους",
        "λόγοι"
      ]
    },
    "doron_neut": {
      "name": "δῶρον, -ου, τό (hediye/armağan - Nötr)",
      "singular": [
        "δῶρον",
        "δῶρου",
        "δῶρῳ",
        "δῶρον",
        "δῶρον"
      ],
      "plural": [
        "δῶρα",
        "δῶρων",
        "δῶροις",
        "δῶρα",
        "δῶρα"
      ]
    }
  },
  "declension_1": {
    "title": "Birinci Çekim: Dişil İsimler (-ᾱ, -η, -ᾰ)",
    "description": "A-gövdesi (a-stem) çekimi. Genellikle dişil isimleri kapsar. Kök sonuna göre saf alfa (α), eta (η) veya karışık alfa alır.",
    "cases": [
      "Nominativ (Yalın)",
      "Genitiv (-in)",
      "Dativ (-e/ile)",
      "Accusativ (-i)",
      "Vocativ (Hitap)"
    ],
    "khora_pure_alpha": {
      "name": "χώρα, -ας, ἡ (ülke/toprak - Saf Alfa)",
      "singular": [
        "χώρᾱ",
        "χώρᾱς",
        "χώρᾳ",
        "χώρᾱν",
        "χώρᾱ"
      ],
      "plural": [
        "χῶραι",
        "χωρῶν",
        "χώραις",
        "χώρᾱς",
        "χῶραι"
      ]
    },
    "tekhne_eta": {
      "name": "τέχνη, -ης, ἡ (sanat/zanaat - Eta)",
      "singular": [
        "τέχνη",
        "τέχνης",
        "τέχνῃ",
        "τέχνην",
        "τέχνη"
      ],
      "plural": [
        "τέχναι",
        "τεχνῶν",
        "τέχναις",
        "τέχνᾱς",
        "τέχναι"
      ]
    }
  },
  "declension_3": {
    "title": "Üçüncü Çekim: Ünsüz ve Kapalı Gövdeler",
    "description": "Atematik çekim (ünsüz, i, u gövdeleri). Kelimenin gerçek gövdesi genitiv halinde ortaya çıkar. Örnek: φύλαξ (muhafız, gövde: φυλακ-).",
    "cases": [
      "Nominativ (Yalın)",
      "Genitiv (-in)",
      "Dativ (-e/ile)",
      "Accusativ (-i)",
      "Vocativ (Hitap)"
    ],
    "phylax_consonant": {
      "name": "φύλαξ, φύλακος, ὁ (muhafız/nöbetçi)",
      "singular": [
        "φύλαξ",
        "φύλακος",
        "φύλακι",
        "φύλακα",
        "φύλαξ"
      ],
      "plural": [
        "φύλακες",
        "φυλάκων",
        "φύλαξι(ν)",
        "φύλακας",
        "φύλακες"
      ]
    },
    "soma_neuter": {
      "name": "σῶμα, σώματος, τό (beden/gövde - Nötr)",
      "singular": [
        "σῶμα",
        "σώματος",
        "σώματι",
        "σῶμα",
        "σῶμα"
      ],
      "plural": [
        "σώματα",
        "σωμάτων",
        "σώμασι(ν)",
        "σώματα",
        "σώματα"
      ]
    }
  },
  "verb_luo": {
    "title": "Düzenli Fiil Çekimi: λύω (çözmek, serbest bırakmak)",
    "description": "Eski Yunancada fiiller Şahıs (1, 2, 3), Sayı (Tekil, Çoğul, İkil), Zaman (Present, Imperfect, Future, Aorist, Perfect, Pluperfect), Çatı (Aktif, Medial, Pasif) ve Kip (Bildirme/İndikativ, İstek/Konjunktiv, Dilek/Optativ, Emir/İmperativ) gösterir.",
    "present_indicative": {
      "title": "Şimdiki Zaman Bildirme Kipi (Praesens Indicativus)",
      "persons": [
        "1. Tekil (Ben)",
        "2. Tekil (Sen)",
        "3. Tekil (O)",
        "1. Çoğul (Biz)",
        "2. Çoğul (Siz)",
        "3. Çoğul (Onlar)"
      ],
      "active": [
        "λύω (çözüyorum)",
        "λύεις (çözüyorsun)",
        "λύει (çözüyor)",
        "λύομεν (çözüyoruz)",
        "λύετε (çözüyorsunuz)",
        "λύουσι(ν) (çözüyorlar)"
      ],
      "middle_passive": [
        "λύομαι (çözülüyorum / kendimi çözüyorum)",
        "λύῃ / λύει",
        "λύεται",
        "λυόμεθα",
        "λύεσθε",
        "λύονται"
      ]
    },
    "future_indicative": {
      "title": "Gelecek Zaman (Futurum)",
      "active": [
        "λύσω (çözeceğim)",
        "λύσεις",
        "λύσει",
        "λύσομεν",
        "λύσετε",
        "λύσουσι(ν)"
      ]
    },
    "aorist_indicative": {
      "title": "Aorist (Geçmiş Zaman / Noktasal)",
      "active": [
        "ἔλυσα (çözdüm)",
        "ἔλυσας",
        "ἔλυσε(ν)",
        "ἐλύσαμεν",
        "ἐλύσατε",
        "ἔλυσαν"
      ]
    }
  },
  "verb_eimi": {
    "title": "Düzensiz Yardımcı Fiil: εἰμί (olmak - to be)",
    "description": "Eski Yunancada en sık kullanılan düzensiz fiildir. Enklitiktir (vurgusunu genelde önündeki kelimeye aktarır).",
    "present": [
      {
        "person": "1. Tekil (Ben)",
        "form": "εἰμί",
        "translit": "eimi",
        "meaning": "...-ım / varım"
      },
      {
        "person": "2. Tekil (Sen)",
        "form": "εἶ",
        "translit": "ei",
        "meaning": "...-sın"
      },
      {
        "person": "3. Tekil (O)",
        "form": "ἐστί(ν)",
        "translit": "esti(n)",
        "meaning": "...-dır / vardır"
      },
      {
        "person": "1. Çoğul (Biz)",
        "form": "ἐσμέν",
        "translit": "esmen",
        "meaning": "...-ız"
      },
      {
        "person": "2. Çoğul (Siz)",
        "form": "ἐστέ",
        "translit": "este",
        "meaning": "...-sınız"
      },
      {
        "person": "3. Çoğul (Onlar)",
        "form": "εἰσί(ν)",
        "translit": "eisi(n)",
        "meaning": "...-dırlar"
      }
    ],
    "imperfect": [
      {
        "person": "1. Tekil",
        "form": "ἦ / ἦν",
        "meaning": "idim"
      },
      {
        "person": "2. Tekil",
        "form": "ἦσθα",
        "meaning": "idin"
      },
      {
        "person": "3. Tekil",
        "form": "ἦν",
        "meaning": "idi"
      },
      {
        "person": "1. Çoğul",
        "form": "ἦμεν",
        "meaning": "idik"
      },
      {
        "person": "2. Çoğul",
        "form": "ἦτε / ἦστε",
        "meaning": "idiniz"
      },
      {
        "person": "3. Çoğul",
        "form": "ἦσαν",
        "meaning": "idiler"
      }
    ]
  },
  "pronouns": {
    "title": "Şahıs Zamirleri (Personal Pronouns)",
    "first_person": {
      "singular": {
        "nom": "ἐγώ (ben)",
        "gen": "ἐμοῦ / μου (benim)",
        "dat": "ἐμοί / μοι (bana)",
        "acc": "ἐμέ / με (beni)"
      },
      "plural": {
        "nom": "ἡμεῖς (biz)",
        "gen": "ἡμῶν (bizim)",
        "dat": "ἡμῖν (bize)",
        "acc": "ἡμᾶς (bizi)"
      }
    },
    "second_person": {
      "singular": {
        "nom": "σύ (sen)",
        "gen": "σοῦ / σου (senin)",
        "dat": "σοί / σοι (sana)",
        "acc": "σέ / σε (seni)"
      },
      "plural": {
        "nom": "ὑμεῖς (siz)",
        "gen": "ὑμῶν (sizin)",
        "dat": "ὑμῖν (size)",
        "acc": "ὑμᾶς (sizi)"
      }
    },
    "third_person_autos": {
      "title": "αὐτός, αὐτή, αὐτό (o / kendisi)",
      "desc": "3. şahıs zamiri ve 'kendi' (intensive) anlamında kullanılır."
    }
  }
};
