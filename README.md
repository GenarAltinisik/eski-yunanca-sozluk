# 🏛️ Genar's Master Ancient Greek (Eski Yunanca Sözlük & Filoloji Portalı)

Kapsamlı, politeknik Grekçe destekli, interaktif sanal klavyeli ve dil bilgisi referanslı **Eski Yunanca Sözlük ve Öğrenme Portalı**.

🌐 **Canlı Web Sitesi (GitHub Pages):** [https://GenarAltinisik.github.io/eski-yunanca-sozluk/](https://GenarAltinisik.github.io/eski-yunanca-sozluk/)

---

## ✨ Temel Özellikler

- **📖 Kapsamlı Sözlük Veritabanı (267+ Kelime):**
  - **Athenaze: Book I (Bölüm 1α – 3β) Tüm Kelimeleri:** 159 kelimelik tam ders kitabı sözlüğü; metinde geçen çekim ve emir formları, gramer notları ve okuma parçalarıyla zenginleştirilmiştir.
  - **Özel Athenaze Filtresi:** Tek tıkla sadece Athenaze kitabında geçen kelimeleri listeleme ve çalışma olanağı.
  - **Klasik Felsefe & Edebiyat Sözlüğü:** Platon, Homeros, Aristoteles, Sophokles, Herodotos, Thukydides ve Ksenophon metinlerinden alıntılar ve tam politeknik lemmalar (`λόγος, -ου, ὁ`).
  - **Etimoloji ve Türkçe Türevler:** Kelimelerin Proto-Hint-Avrupa kökenleri ve günümüz Türkçesi ile dünya dillerindeki türevleri (*felsefe*, *tarih*, *demokrasi*, *biyoloji*, *psikoloji*, *arkeoloji*, *kriz*, *monarşi*, vb.).

- **🔍 Çok Yönlü Akıllı Arama:**
  - Grekçe arama (vurgulu veya vurgusuz: `λόγος` ya da `λογος`).
  - **Beta Code Desteği:** Standart Perseus / TLG Beta Code girişi (örn: `lo/gos` ➔ `λόγος`, `a)/nqrwpos` ➔ `ἄνθρωπος`).
  - Latin harfli fonetik arama (`logos`, `anthropos`, `psyche`).
  - Türkçe ve İngilizce anlam üzerinden arama (`akıl`, `ruh`, `adalet`, `reason`).
  - Modern türev kelimeye göre arama (`biyoloji`, `felsefe`, `demokrasi`).

- **⌨️ İnteraktif Politeknik Sanal Klavye:**
  - Grek alfabesi ve aksan değiştiricileri (akut `´`, gravis `` ` ``, sirkümfleks `῀`, sert soluk `῾`, yumuşak soluk `᾿`, alt iota `ͺ`, trema `¨`).
  - Herhangi bir özel klavye yüklemeye gerek kalmadan tek tıkla arama kutusuna harf ekleme imkanı.

- **🔊 Sesli Telaffuz (Web Speech API):**
  - Kelimelerin doğru sesletimini dinleyebileceğiniz ses motoru.

- **🔤 Alfabe ve Fonetik Rehberi:**
  - 24 harfin tümü, büyük/küçük yazılışları, IPA fonetik simgeleri.
  - **Erasmian** ve **Yeniden Yapılandırılmış Klasik Attika** telaffuz farkları.
  - Çift ünlüler (diftonlar) ve vurgu sisteminin detaylı izahatı.

- **🏛️ Gramer ve Büküm Tabloları:**
  - Belirteç çekimleri (ὁ, ἡ, τό).
  - 1., 2. ve 3. isim bükümleri (nominativ, genitiv, dativ, accusativ, vocativ).
  - Düzenli fiil çekimleri (`λύω`) ve düzensiz yardımcı fiil (`εἰμί`).

- **🗂️ 3D Kelime Kartları (Flashcards / Spaced Learning):**
  - Çevrilebilir 3D kartlar ile kelime ezberleme ve çalışma modu.
  - Kategoriye göre filtreleme ve öğrenilen kelime sayacı.

- **🌓 Çift Tema Desteği:**
  - **Antik Parşömen Modu** (sıcak papirüs rengi) ve **Gece Mermeri Modu** (koyu tema).
  - Yerel depolama (LocalStorage) ile favori kelimeler listesi.

---

## 🚀 Kurulum ve Yerel Çalıştırma

Bu proje tamamen sıfır bağımlılıklı (zero-dependency) modern statik web mimarisine sahiptir. Herhangi bir derleme (build) veya sunucu kurulumu gerektirmez.

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/GenarAltinisik/eski-yunanca-sozluk.git
   cd eski-yunanca-sozluk
   ```

2. `index.html` dosyasını herhangi bir modern tarayıcıda doğrudan açın veya yerel bir HTTP sunucusu başlatın:
   ```bash
   # Python ile
   python -m http.server 8000
   ```
   Tarayıcınızda `http://localhost:8000` adresine gidin.

---

## 🏛️ Kaynakça ve Filolojik Referanslar

- **LSJ:** Liddell, H. G., Scott, R., & Jones, H. S., *A Greek-English Lexicon*, Oxford University Press.
- **Bailly:** Bailly, A., *Dictionnaire Grec-Français*, Hachette.
- **Smyth:** Smyth, H. W., *Greek Grammar*, Harvard University Press.
- **Chantraine:** Chantraine, P., *Dictionnaire étymologique de la langue grecque*, Klincksieck.

---

## 📜 Lisans

Bu proje açık kaynaklıdır ve klasik filoloji öğrenen ve araştıran herkesin kullanımına açıktır.
