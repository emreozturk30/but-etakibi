# Bütçe Takip Uygulaması — Proje Planı

Kişisel gelir ve giderleri takip etmeye yönelik bir uygulama. Bu doküman, projenin
kurallarını ve yol haritasını tanımlar. Şu an için sadece planlama aşamasındayız;
kod geliştirmeye bu doküman onaylandıktan sonra başlanacak.

## 1. Amaç ve Kapsam

- Kullanıcının gelirlerini ve giderlerini kaydetmesini sağlamak.
- Kategori bazlı harcama/gelir takibi yapmak (ör. market, kira, maaş, fatura).
- Belirli bir dönem (gün/hafta/ay/yıl) için özet ve raporlama sunmak.
- Bakiye/net durum hesaplamak (toplam gelir - toplam gider).
- İleride: bütçe hedefleri, tekrarlayan işlemler, grafiklerle görselleştirme.

**Kapsam dışı (ilk sürüm için):** çoklu kullanıcı/banka entegrasyonu, otomatik
banka senkronizasyonu, yatırım takibi (altın için başlandı, bkz. "Canlıya
Alma Sonrası Ek Özellik"). Bunlar "gelecek fikirler" bölümünde ayrıca not
edilecek.

## 2. Temel Kavramlar (Veri Modeli Taslağı)

- **İşlem (Transaction):** tutar, tür (gelir/gider), kategori, tarih, açıklama/not.
- **Kategori (Category):** isim, tür (gelir/gider), ikon/renk (opsiyonel).
- **Bütçe/Hedef (Budget)** *(ileri aşama)*: kategori bazlı aylık limit.
- **Kullanıcı (User)** *(ileri aşama, çoklu kullanıcı gerekirse)*.

### Sabit Kategori Listesi (MVP) + Kullanıcı Tanımlı Kategoriler (Aşama 3)

MVP'de aşağıdaki sabit liste kullanılıyor. Aşama 3 ile birlikte kullanıcı bu
listeye ek kategoriler oluşturabiliyor (ekleme/yeniden adlandırma/silme);
sabit kategoriler değiştirilemiyor/silinemiyor, bir işlemde kullanılan
kategori de silinemiyor.

- **Gider:** Market/Gıda, Kira/Konut, Faturalar, Ulaşım, Sağlık, Eğitim,
  Giyim, Eğlence/Sosyal, Abonelikler, Borç/Kredi Ödemesi, Diğer
- **Gelir:** Maaş, Ek Gelir/Serbest Çalışma, Yatırım Geliri, Hediye/Diğer

(Kod tarafında `src/constants/categories.ts` içinde tanımlıdır.)

## 3. Alınan Kararlar

- **Platform:** Web uygulaması.
- **Kullanıcı:** Tek kullanıcı (kişisel kullanım), giriş/kayıt sistemi yok.
- **Veri saklama:** Yerel (tarayıcıda, cihazdan bağımsız bir sunucuya
  gönderilmeden) — backend/veritabanı sunucusu gerekmiyor.
- **Teknoloji tercihi:** JavaScript/TypeScript ekosistemi.

### Somut Teknoloji Yığını

- **Framework:** React + TypeScript, **Vite** ile (hızlı kurulum, sade yapı,
  backend gerektirmeyen bir "single-page app").
- **Veri kalıcılığı:** Tarayıcı **localStorage** ile başlanacak; ileride veri
  büyürse veya daha karmaşık sorgulama gerekirse **IndexedDB**'ye geçilebilir.
- **Stil:** Basit bir CSS çözümü (ör. sade CSS veya Tailwind) — ihtiyaca göre
  ilerleyen aşamada netleştirilecek.
- **Grafikler (Aşama 2'de):** Recharts veya benzeri hafif bir grafik
  kütüphanesi.
- **Barındırma:** Statik bir site olduğu için Vercel/Netlify/GitHub Pages gibi
  basit statik hosting seçeneklerinden biriyle yayınlanabilir (isteğe bağlı,
  gerektiğinde konuşulacak).

Bu yığının seçilme nedeni: backend/veritabanı kurulumu gerektirmeden, tek
kullanıcı için hızlıca çalışan bir MVP üretmeye izin vermesi. İleride çoklu
cihazdan erişim veya çoklu kullanıcı ihtiyacı doğarsa (bkz. "Gelecek
Fikirler"), bir backend + gerçek veritabanına geçiş ayrı bir aşama olarak
planlanabilir.

## 4. Kurallar / Çalışma Prensipleri

- **Adım adım ilerleme:** Her adımda küçük, test edilebilir parçalar
  geliştirilecek; büyük ve tek seferlik "her şeyi yaz" adımlarından kaçınılacak.
- **Onay sonrası aksiyon:** Yeni bir aşamaya geçmeden önce (özellikle mimari
  kararlar ve teknoloji seçimi gibi geri dönüşü zor kararlarda) kullanıcıdan
  onay alınacak.
- **Basitten karmaşığa:** Önce çalışan, sade bir MVP (gelir/gider ekleme +
  liste + toplam bakiye) hedeflenecek; gelişmiş özellikler (grafik, bütçe
  hedefleri, tekrarlayan işlemler) sonraki aşamalara bırakılacak.
- **Veri güvenliği:** Finansal veriler söz konusu olduğu için giriş
  doğrulaması (ör. negatif/boş tutar engellenmesi) ve veri kaybını önleyecek
  basit önlemler (ör. kayıt öncesi doğrulama) uygulanacak.
- **Kod kalitesi:** Gereksiz karmaşıklıktan kaçınılacak, sadece o an gereken
  özellik geliştirilecek (aşırı mühendislikten kaçınma).
- **Dokümantasyon:** Önemli kararlar ve ilerleme bu tür planlama
  dosyalarında güncel tutulacak.

## 5. Yol Haritası

### Aşama 0 — Planlama (şu an buradayız)
- [x] Proje kapsamının ve kurallarının belirlenmesi (bu doküman).
- [x] Platform ve teknoloji yığını kararının netleştirilmesi.

### Aşama 1 — MVP (Temel İşlevsellik)
- [x] Gelir/gider işlemi ekleme (tutar, kategori, tarih, açıklama).
- [x] İşlemleri listeleme (tarihe göre sıralı).
- [x] İşlem silme/düzenleme.
- [x] Toplam bakiye (gelir - gider) gösterimi.
- [x] Basit kategori listesi (sabit/önceden tanımlı kategoriler).

### Aşama 2 — Kullanılabilirlik ve Raporlama
- [x] Kategoriye göre filtreleme.
- [x] Tarih aralığına göre filtreleme (bu ay, geçen ay, özel aralık).
- [x] Kategori bazlı harcama özeti (çubuk grafik).
- [x] Aylık gelir/gider trend grafiği.
- [x] Verilerin kalıcı olarak saklanması (seçilen veri saklama yöntemine göre).

### Aşama 3 — Gelişmiş Özellikler
- [x] Kullanıcı tanımlı kategori ekleme/düzenleme (silme dahil; kullanımda olan
      kategoriler silinemiyor).
- [x] Aylık bütçe hedefleri belirleme ve limit aşımı uyarısı (kategori
      başına aylık limit, harcama ilerleme çubuğu, iyi/yaklaşıyor/aşıldı
      durum uyarısı).
- [x] Tekrarlayan işlemler (ör. her ay otomatik kira gideri; kural silinse
      bile daha önce oluşturulan işlemler korunur).
- [x] Veri dışa aktarma (CSV) — uygulanan filtrelere göre indirme.
- [x] ~~(Varsa) çoklu kullanıcı desteği / giriş sistemi~~ — kapsam dışı
      bırakıldı (tek kullanıcılık kişisel araç kararı, bkz. Bölüm 3).

Aşama 3 tamamlandı.

### Aşama 4 — Cilalama
- [x] Mobil uyumlu/duyarlı tasarım (320px'e kadar test edildi, yatay taşma
      yok, dar ekranlarda kartlar satır satır düzgün sarıyor).
- [x] Karanlık mod (sistem tercihine otomatik uyum + Sistem/Açık/Koyu manuel
      geçiş, tercih kalıcı).
- [x] Performans ve kullanılabilirlik iyileştirmeleri (grafik kütüphanesi
      lazy-load edilerek ilk yüklenen JS ~587KB'den ~215KB'ye indirildi;
      kullanılmayan CSS temizlendi).

Aşama 4 tamamlandı — yol haritasındaki tüm aşamalar bitti.

### Son Gözden Geçirme — Bulunan ve Düzeltilen Hatalar

- **Saat dilimi hatası:** `toISOString()` kullanımı UTC+ saat dilimlerinde
  (ör. Türkiye/UTC+3) "bu ay/geçen ay" filtresini, aylık bütçe hesaplamasını
  ve formlardaki varsayılan tarihi yanlış hesaplıyordu; yerel tarih
  bileşenleriyle (`toLocalISODate`/`parseLocalDate`) düzeltildi.
- **Tekrarlayan işlem düzenleme hatası:** otomatik oluşturulan bir işlem
  düzenlendiğinde `recurringId` bağlantısı siliniyor, bu da o ay için ikinci
  bir kopya işlem oluşturulmasına yol açıyordu; düzeltildi.
- **Tekrarlayan işlem silme hatası:** otomatik oluşturulan bir ayın işlemi
  silindiğinde bir sonraki açılışta otomatik olarak geri geliyordu; artık
  silinen aylar "atlandı" olarak işaretleniyor ve tekrar oluşturulmuyor.

Bu düzeltmelerden sonra tüm özellikler İstanbul saat dilimi simüle edilerek
uçtan uca yeniden test edildi; konsol hatası veya davranış bozukluğu
gözlenmedi.

### Canlıya Alma Sonrası Ek Özellik

- **Net Birikim (Kümülatif) grafiği:** geçmiş ayların gelir/gider farkının
  aya aya toplanarak (kümülatif) gösterildiği yeni bir bölüm eklendi;
  birikim negatife düştüğü aylarda da sıfır referans çizgisiyle net şekilde
  görülüyor.
- **Yatırım takibi — Adım 1 (Altın):** yeni bir "Yatırımlar" paneli eklendi;
  miktar/alış fiyatı/alış tarihi girilerek altın yatırımı kaydedilebiliyor
  (sabit bir altın türü listesinden seçim yapılıyor, serbest metin yok).
  Güncel fiyat truncgil.com'un ücretsiz JSON kaynağından tek tıkla
  çekilebiliyor (10 saniyelik zaman aşımı korumalı) veya elle girilebiliyor;
  kâr/zarar otomatik hesaplanıp gösteriliyor. Diğer varlık türleri
  (kripto, döviz, vb.) kasıtlı olarak bu adıma dahil edilmedi, sonraki
  adımlarda ayrı ayrı ele alınacak.

## 6. Gelecek Fikirler (Şimdilik Kapsam Dışı)

- Banka hesabı otomatik senkronizasyonu.
- Yatırım/portföy takibi (altın dışındaki varlık türleri — kripto, döviz,
  hisse, vb. — hâlâ bekliyor; altın için ilk adım atıldı).
- Çoklu para birimi desteği.
- Ortak bütçe / aile hesabı paylaşımı.

---

*Bu doküman yaşayan bir belgedir; kararlar netleştikçe ve proje ilerledikçe
güncellenecektir.*
