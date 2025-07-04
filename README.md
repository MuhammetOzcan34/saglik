# Mini Sağlık Takipçi

Çocuk sağlığı ve gelişimini takip etmek için geliştirilmiş kapsamlı bir web uygulaması.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Kullanıcı Kimlik Doğrulama**: Güvenli giriş sistemi
- **Çocuk Profili Yönetimi**: Çoklu çocuk desteği
- **Günlük Rutin Takibi**: Kategorize edilmiş aktivite takibi
- **Beslenme Takibi**: Öğün ve besin kayıtları
- **İlaç Takibi**: İlaç zamanları ve dozları
- **Ateş Ölçümü**: Sıcaklık kayıtları ve takibi
- **Gelişim Takibi**: Boy, kilo ve baş çevresi ölçümleri
- **Doktor & Randevu Yönetimi**: Doktor bilgileri ve randevular
- **Epilepsi Atak Takibi**: Atak türleri ve süreleri
- **Alerji Takibi**: Alerji türleri ve şiddet seviyeleri
- **Fiziksel Aktivite**: Egzersiz ve aktivite kayıtları
- **Test Sonuçları**: Laboratuvar sonuçları yönetimi
- **Takvim**: Etkinlik ve hatırlatıcılar
- **Raporlar**: Detaylı sağlık raporları
- **Profil Sayfası**: Kullanıcı bilgileri ve ayarlar
- **Bildirim Sistemi**: Akıllı bildirimler
- **Ayarlar**: Uygulama konfigürasyonu
- **Mobil Uyumluluk**: Responsive tasarım
- **CRUD İşlemleri**: Tüm sayfalarda ekleme, düzenleme, silme

### ❌ Eksik Kalan Özellikler
- **Supabase Entegrasyonu**: Gerçek veritabanı bağlantısı
- **Gerçek Authentication**: Supabase Auth entegrasyonu
- **Dosya Yükleme**: Test sonuçları için dosya yükleme
- **Gerçek Bildirimler**: Push notification sistemi
- **Gelişmiş Raporlama**: Detaylı grafikler ve analizler
- **Takvim Entegrasyonu**: Google/Apple Calendar entegrasyonu
- **Veri Yedekleme**: Otomatik yedekleme sistemi
- **Çoklu Dil Desteği**: İngilizce ve diğer diller
- **Tema Sistemi**: Koyu/açık tema seçenekleri

## 🛠️ Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd mini-saglik-takipci-main
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Supabase Kurulumu

#### 3.1 Supabase Projesi Oluşturun
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Proje URL'sini ve anonim anahtarını not edin

#### 3.2 Environment Variables
`env.example` dosyasını `.env` olarak kopyalayın ve Supabase bilgilerinizi ekleyin:

```bash
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3.3 Veritabanı Şemasını Yükleyin
1. Supabase Dashboard'a gidin
2. SQL Editor'ı açın
3. `supabase-schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'da çalıştırın

### 4. Uygulamayı Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📱 Kullanım

### Ana Özellikler
1. **Giriş Yapın**: E-posta ve şifre ile giriş
2. **Aile Kurulumu**: İlk kez kullanıyorsanız aile bilgilerinizi girin
3. **Çocuk Ekleme**: Çocuk profillerini oluşturun
4. **Veri Girişi**: Her sayfada ilgili verileri girin
5. **Takip**: Raporlar ve grafiklerle gelişimi izleyin

### Mobil Kullanım
- Alt navigasyon çubuğu ile hızlı erişim
- Responsive tasarım ile tüm cihazlarda uyumlu
- Dokunmatik dostu arayüz

## 🗄️ Veritabanı Yapısı

### Ana Tablolar
- `children`: Çocuk profilleri
- `user_profiles`: Kullanıcı bilgileri
- `notifications`: Bildirimler
- `daily_routines`: Günlük rutinler
- `growth_records`: Gelişim kayıtları
- `medication_records`: İlaç kayıtları
- `nutrition_records`: Beslenme kayıtları
- `temperature_records`: Ateş ölçümleri
- `seizure_records`: Epilepsi atakları
- `allergies`: Alerji bilgileri
- `doctors`: Doktor bilgileri
- `appointments`: Randevular
- `test_results`: Test sonuçları
- `physical_activities`: Fiziksel aktiviteler
- `calendar_events`: Takvim etkinlikleri

## 🔧 Teknolojiler

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite

## 📊 Özellik Detayları

### Günlük Rutin Takibi
- **Kategoriler**: Uyku, Hijyen, Aktiviteler, Ruh Hali
- **Aktiviteler**: Her kategori için özel aktiviteler
- **Zaman Takibi**: Saat ve süre kayıtları
- **Kalite Değerlendirmesi**: Uyku ve aktivite kalitesi
- **Ruh Hali**: Çocuğun günlük ruh hali takibi

### Beslenme Takibi
- **Öğün Türleri**: Kahvaltı, öğle, akşam, ara öğün
- **Besin Kayıtları**: Yenen yiyecekler ve miktarları
- **Notlar**: Özel beslenme notları

### İlaç Takibi
- **İlaç Bilgileri**: İsim, doz, sıklık
- **Zaman Takibi**: Başlangıç ve bitiş tarihleri
- **Hatırlatıcılar**: İlaç zamanı bildirimleri

### Gelişim Takibi
- **Ölçümler**: Boy, kilo, baş çevresi
- **Grafikler**: Gelişim eğrileri
- **Karşılaştırma**: Yaş grubu ortalamaları

## 🔒 Güvenlik

- **Row Level Security (RLS)**: Her kullanıcı sadece kendi verilerini görebilir
- **Authentication**: Supabase Auth ile güvenli giriş
- **Data Validation**: Zod ile form doğrulaması
- **Environment Variables**: Hassas bilgiler güvenli şekilde saklanır

## 🚧 Geliştirme Durumu

### Tamamlanan (%85)
- ✅ Tüm sayfalar ve bileşenler
- ✅ CRUD işlemleri
- ✅ Mobil uyumluluk
- ✅ Kullanıcı arayüzü
- ✅ Veri yapısı

### Devam Eden (%15)
- 🔄 Supabase entegrasyonu
- 🔄 Gerçek authentication
- 🔄 Dosya yükleme sistemi
- 🔄 Bildirim sistemi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu uygulama şu anda geliştirme aşamasındadır. Supabase entegrasyonu tamamlandıktan sonra production'a hazır olacaktır.
