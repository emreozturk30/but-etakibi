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
banka senkronizasyonu, yatırım takibi. Bunlar "gelecek fikirler" bölümünde
ayrıca not edilecek.

## 2. Temel Kavramlar (Veri Modeli Taslağı)

- **İşlem (Transaction):** tutar, tür (gelir/gider), kategori, tarih, açıklama/not.
- **Kategori (Category):** isim, tür (gelir/gider), ikon/renk (opsiyonel).
- **Bütçe/Hedef (Budget)** *(ileri aşama)*: kategori bazlı aylık limit.
- **Kullanıcı (User)** *(ileri aşama, çoklu kullanıcı gerekirse)*.

## 3. Karar Bekleyen Noktalar

Aşağıdaki kararlar henüz netleşmedi, geliştirmeye başlamadan önce birlikte
netleştirilmeli:

- **Platform:** Web mi, mobil mi, masaüstü mü, yoksa hepsi mi?
- **Teknoloji yığını:** Örn. web için React/Next.js + bir backend (Node/Express,
  Python/FastAPI vb.) ya da tamamen frontend + local storage ile basit bir
  MVP mi?
- **Veri saklama:** Yerel (tarayıcı/localStorage, SQLite) mi, uzak bir
  veritabanı (Postgres, MongoDB vb.) mı?
- **Kullanıcı yönetimi:** Tek kullanıcılık kişisel bir araç mı, yoksa
  giriş/kayıt sistemi olan çok kullanıcılı bir uygulama mı?
- **Çevrimdışı kullanım gerekiyor mu?**

Bu kararlar netleştikçe bu doküman güncellenecek.

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
- [ ] Platform ve teknoloji yığını kararının netleştirilmesi.

### Aşama 1 — MVP (Temel İşlevsellik)
- [ ] Gelir/gider işlemi ekleme (tutar, kategori, tarih, açıklama).
- [ ] İşlemleri listeleme (tarihe göre sıralı).
- [ ] İşlem silme/düzenleme.
- [ ] Toplam bakiye (gelir - gider) gösterimi.
- [ ] Basit kategori listesi (sabit/önceden tanımlı kategoriler).

### Aşama 2 — Kullanılabilirlik ve Raporlama
- [ ] Kategoriye göre filtreleme.
- [ ] Tarih aralığına göre filtreleme (bu ay, geçen ay, özel aralık).
- [ ] Kategori bazlı harcama özeti (ör. pasta/çubuk grafik).
- [ ] Aylık gelir/gider trend grafiği.
- [ ] Verilerin kalıcı olarak saklanması (seçilen veri saklama yöntemine göre).

### Aşama 3 — Gelişmiş Özellikler
- [ ] Kullanıcı tanımlı kategori ekleme/düzenleme.
- [ ] Aylık bütçe hedefleri belirleme ve limit aşımı uyarısı.
- [ ] Tekrarlayan işlemler (ör. her ay otomatik kira gideri).
- [ ] Veri dışa aktarma (CSV/Excel).
- [ ] (Varsa) çoklu kullanıcı desteği / giriş sistemi.

### Aşama 4 — Cilalama
- [ ] Mobil uyumlu/duyarlı tasarım.
- [ ] Karanlık mod.
- [ ] Performans ve kullanılabilirlik iyileştirmeleri.

## 6. Gelecek Fikirler (Şimdilik Kapsam Dışı)

- Banka hesabı otomatik senkronizasyonu.
- Yatırım/portföy takibi.
- Çoklu para birimi desteği.
- Ortak bütçe / aile hesabı paylaşımı.

---

*Bu doküman yaşayan bir belgedir; kararlar netleştikçe ve proje ilerledikçe
güncellenecektir.*
