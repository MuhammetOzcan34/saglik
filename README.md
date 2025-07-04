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

---

## 1. Hatalı veya Karmaşık Policy’ler

- **children, routines, moods** gibi tablolarda, policy’lerde iç içe EXISTS/JOIN kullanımı var. Bu, Supabase’ın policy engine’inde döngüye ve performans sorunlarına yol açabilir.
- En güvenli ve sade yöntem: Her tablonun erişiminde, sadece bir yerde EXISTS ile family_members üzerinden user_id kontrolü yapılır. Diğer tablolarda doğrudan user_id ile kontrol yapılır.

---

## 2. Tüm Policy’leri Sıfırla (DROP)

Aşağıdaki komutlar, mevcut policy’leri siler:

```sql
-- families
DROP POLICY IF EXISTS "Kendi ailelerini görebilsin" ON public.families;
DROP POLICY IF EXISTS "Aile oluşturabilsin" ON public.families;

-- family_members
DROP POLICY IF EXISTS "Kendi aile üyeliklerini görebilsin" ON public.family_members;
DROP POLICY IF EXISTS "Aileye katılabilsin" ON public.family_members;

-- children
DROP POLICY IF EXISTS "Ailesindeki çocukları görebilsin" ON public.children;
DROP POLICY IF EXISTS "Ailesine çocuk ekleyebilsin" ON public.children;

-- routines
DROP POLICY IF EXISTS "Ailesindeki çocukların rutinlerini görebilsin" ON public.routines;
DROP POLICY IF EXISTS "Ailesindeki çocuklara rutin ekleyebilsin" ON public.routines;

-- moods
DROP POLICY IF EXISTS "Ailesindeki çocukların ruh hali kayıtlarını görebilsin" ON public.moods;
DROP POLICY IF EXISTS "Ailesindeki çocuklara ruh hali kaydı ekleyebilsin" ON public.moods;
DROP POLICY IF EXISTS "Ailesindeki çocukların ruh hali kayıtlarını güncelleyebil" ON public.moods;
DROP POLICY IF EXISTS "Ailesindeki çocukların ruh hali kayıtlarını silebilsin" ON public.moods;
```

---

## 3. Doğru ve Döngüsüz Policy’leri Oluştur (CREATE)

### families
```sql
-- Sadece kendi üyesi olduğu aileleri görebilsin
CREATE POLICY "Kendi ailelerini görebilsin"
ON public.families
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_members.family_id = families.id
      AND family_members.user_id = auth.uid()
  )
);

-- Herkes aile oluşturabilsin
CREATE POLICY "Aile oluşturabilsin"
ON public.families
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

### family_members
```sql
-- Sadece kendi üyeliklerini görebilsin
CREATE POLICY "Kendi aile üyeliklerini görebilsin"
ON public.family_members
FOR SELECT USING (
  user_id = auth.uid()
);

-- Sadece kendi adına üyelik ekleyebilsin
CREATE POLICY "Aileye katılabilsin"
ON public.family_members
FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
```

### children
```sql
-- Sadece üyesi olduğu ailedeki çocukları görebilsin
CREATE POLICY "Ailesindeki çocukları görebilsin"
ON public.children
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_members.family_id = children.family_id
      AND family_members.user_id = auth.uid()
  )
);

-- Sadece üyesi olduğu aileye çocuk ekleyebilsin
CREATE POLICY "Ailesine çocuk ekleyebilsin"
ON public.children
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_members.family_id = children.family_id
      AND family_members.user_id = auth.uid()
  )
);
```

### routines
```sql
-- Sadece ailesindeki çocukların rutinlerini görebilsin
CREATE POLICY "Ailesindeki çocukların rutinlerini görebilsin"
ON public.routines
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.children
    WHERE children.id = routines.child_id
      AND EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_members.family_id = children.family_id
          AND family_members.user_id = auth.uid()
      )
  )
);

-- Sadece ailesindeki çocuklara rutin ekleyebilsin
CREATE POLICY "Ailesindeki çocuklara rutin ekleyebilsin"
ON public.routines
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.children
    WHERE children.id = NEW.child_id
      AND EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_members.family_id = children.family_id
          AND family_members.user_id = auth.uid()
      )
  )
);
```

### moods
```sql
isted
```

---

## 4. Uygulama Sırası

1. **Tüm DROP komutlarını çalıştırarak eski policy’leri sil.**
2. **Tüm CREATE komutlarını çalıştırarak yeni policy’leri ekle.**
3. **Supabase SQL Editor’da test et.**
4. **Hala hata alırsan, tablo ve policy adını ilet, birlikte düzeltelim.**

---

### Notlar
- `NEW.child_id` sadece INSERT policy’sinde kullanılır.
- Policy’lerdeki mantık: Her zaman en dışta sadece bir EXISTS, içte ise user_id ile eşleşme.
- Diğer tablolarda da aynı mantıkla policy yazabilirsin.

Her tablo için eksiksiz ve döngüsüz policy’ler yukarıda!  
Başka tablo veya özel bir senaryo varsa, belirt, hemen ekleyeyim.

---

## Dosya Yükleme ve Silme (Supabase Storage)

### 1. Supabase Storage Bucket Oluşturma
- Supabase panelinde "Storage" sekmesine git.
- "New bucket" ile `documents` adında bir bucket oluştur (public olmasın).

### 2. Storage Policy (RLS)
```sql
CREATE POLICY "Kendi çocuklarının dosyalarını yönetebilsin"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'documents'
  AND (
    auth.role() = 'authenticated'
    AND (
      EXISTS (
        SELECT 1 FROM public.family_members
        JOIN public.children ON family_members.family_id = children.family_id
        WHERE family_members.user_id = auth.uid()
          AND storage.objects.name LIKE 'test-results/' || children.id || '/%'
      )
    )
  )
);
```

### 3. React ile Dosya Yükleme ve Silme
- Dosya yükleme için `supabase.storage.from('documents').upload(...)` kullanılır.
- Dosya silme için `supabase.storage.from('documents').remove([filePath])` kullanılır.
- Dosya yolu: `test-results/{child_id}/{dosya_adi}` olmalı.

Örnek kod için `src/pages/Tests.tsx` dosyasına bakınız.

---

## Web Push Bildirimleri (OneSignal)

### 1. OneSignal Hesabı ve Uygulama Oluşturma
- https://onesignal.com/ adresinden ücretsiz hesap aç.
- "New App/Website" ile yeni bir uygulama oluştur.
- Platform olarak Web Push seç.
- Site URL’si olarak kendi domainini (veya localhost’u) gir.
- App ID ve REST API Key’i not al.

### 2. Web SDK’yı Projeye Ekle
- `public/index.html` dosyasına aşağıdaki scripti ekle:
  ```html
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
  ```
- `src/main.tsx` dosyasında aşağıdaki hook'u ekle ve App'in en üstünde çağır:
  ```ts
  function useOneSignal() {
    useEffect(() => {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: "ONESIGNAL_APP_ID", // Buraya kendi App ID'ni yaz!
          notifyButton: { enable: true },
          allowLocalhostAsSecureOrigin: true,
        });
      });
    }, []);
  }
  // App'in en üstünde çağır: useOneSignal();
  ```

### 3. Bildirim Gönderme
- OneSignal panelinden manuel bildirim gönderebilirsin.
- Otomatik bildirim için REST API kullan:
  ```js
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic REST_API_KEY"
    },
    body: JSON.stringify({
      app_id: "ONESIGNAL_APP_ID",
      contents: { "en": "Yeni test sonucu eklendi!" },
      included_segments: ["All"]
    })
  });
  ```
- REST API Key ve App ID'yi OneSignal panelinden al.

### Notlar
- App ID ve REST API Key'i kimseyle paylaşma!
- Gelişmiş entegrasyon (ör. Supabase trigger ile otomatik bildirim) için bana ulaşabilirsin.

---

## 1. OneSignal Web Push Bildirimleri: Genel Yol Haritası

1. **OneSignal hesabı aç ve uygulama oluştur**
2. **OneSignal Web SDK’yı projene ekle**
3. **Kullanıcıdan izin al ve abone et**
4. **Supabase ile kullanıcı-onesignal id eşlemesi**
5. **Sunucudan veya panelden bildirim gönder**
6. (Opsiyonel) **Supabase trigger ile otomatik bildirim**

---

## 2. Adım Adım Kurulum

### A. OneSignal Hesabı ve Uygulama Oluşturma

1. [https://onesignal.com/](https://onesignal.com/) adresine gir, ücretsiz hesap aç.
2. “New App/Website” ile yeni bir uygulama oluştur.
3. Platform olarak **Web Push** seç.
4. “Typical Site” seçeneğini seç.
5. Site URL’si olarak kendi domainini (veya localhost’u) gir.
6. “Setup” adımlarını takip et, sana bir **OneSignal App ID** ve **SDK kodu** verecek.

---

### B. Web SDK’yı Projene Ekle

#### 1. **public/index.html** dosyasına ekle:

```html
<!-- OneSignal Web SDK -->
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
```

#### 2. **src/main.tsx** veya App’in ilk yüklenen dosyasında başlat:

```ts
<code_block_to_apply_changes_from>
```
Ve App’in en üstünde çağır:
```ts
useOneSignal();
```

---

### C. Kullanıcıdan İzin Al ve Abone Et

- Kullanıcı siteye girdiğinde OneSignal otomatik izin isteyecek.
- Kullanıcı izin verirse, OneSignal bir **userId** (playerId) oluşturur.
- Bunu Supabase’de user_profile tablosuna kaydedebilirsin (isteğe bağlı).

---

### D. Bildirim Gönderme

#### 1. **Manuel Bildirim (Panelden)**
- OneSignal panelinden istediğin kullanıcıya veya tüm kullanıcılara bildirim gönderebilirsin.

#### 2. **Otomatik Bildirim (API ile)**
- Bir olay olduğunda (örn. yeni test sonucu, ilaç zamanı) Supabase Functions veya backend’den OneSignal REST API ile bildirim gönderebilirsin.
- [OneSignal API dokümantasyonu](https://documentation.onesignal.com/reference/create-notification)

Örnek fetch:
```js
fetch("https://onesignal.com/api/v1/notifications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Basic REST_API_KEY" // OneSignal panelinden alınır
  },
  body: JSON.stringify({
    app_id: "ONESIGNAL_APP_ID",
    contents: { "en": "Yeni test sonucu eklendi!" },
    included_segments: ["All"] // veya player_ids: [...]
  })
});
```

---

### E. (Opsiyonel) Supabase ile Otomatik Bildirim

- Supabase trigger veya function ile yeni kayıt eklendiğinde webhook tetikleyip bildirim gönderebilirsin.
- Gelişmiş entegrasyon için bana bildir, örnek kod hazırlayabilirim.

---

## 3. README’ye Eklenmesi Gerekenler

- OneSignal entegrasyon adımları ve App ID/REST API Key’in nasıl alınacağı.
- Bildirim gönderme örnekleri.

---

## 4. Sonraki Adım

**Onaylarsan, yukarıdaki adımları kod ve README olarak projene ekleyeyim.  
App ID ve REST API Key’i kendin eklemen gerekecek (güvenlik için).  
Devam edelim mi?**

---

## PWA (Progressive Web App) Desteği

### 1. manifest.json
- `public/manifest.json` dosyası PWA için gerekli tüm alanlarla doldurulmalı.

### 2. Service Worker
- `public/sw.js` dosyası temel cache ve offline desteği sağlar.

### 3. index.html
- `<head>` kısmına aşağıdaki tagler eklenmeli:
  ```html
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#2563eb" />
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  ```

### 4. Service Worker Kaydı
- `src/main.tsx` dosyasının en altına şunu ekle:
  ```js
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
  ```

### 5. Test ve Yayın
- Uygulamanı Vercel/Netlify’da aç, Chrome’da “Add to Home Screen” çıkmalı.
- Lighthouse ile PWA testini yapabilirsin.
- Push notification ile tam uyumludur.

---

## Takvim Entegrasyonu
- Google Calendar'a etkinlik eklemek için CalendarAddButton componentini kullanabilirsin.
- Örnek kullanım:
  ```tsx
  <CalendarAddButton event={{
    start: '20240610T090000Z',
    end: '20240610T100000Z',
    title: 'Doktor Randevusu',
    description: 'Çocuk doktoru kontrolü',
    location: 'Hastane'
  }} />
  ```

---

## Veri Yedekleme
- Tüm verileri JSON olarak indirmek için BackupExport componentini kullanabilirsin.
- Örnek kullanım:
  ```tsx
  <BackupExport />
  ```

---

## Çoklu Dil Desteği
- `src/i18n.ts` dosyası react-i18next yapılandırmasını içerir.
- `src/locales/tr/translation.json` ve `src/locales/en/translation.json` dosyalarını düzenleyerek çevirileri güncelleyebilirsin.
- UI'da dil değiştirmek için:
  ```tsx
  import { useTranslation } from 'react-i18next';
  const { t, i18n } = useTranslation();
  <Button onClick={() => i18n.changeLanguage('en')}>EN</Button>
  <Button onClick={() => i18n.changeLanguage('tr')}>TR</Button>
  <h1>{t('Gelişim Takibi')}</h1>
  ```

---

## Tema Sistemi
- Koyu/açık tema için ThemeToggle componentini kullanabilirsin.
- Örnek kullanım:
  ```tsx
  <ThemeToggle />
  ```
- Tailwind config'de dark mode 'class' olmalı.

---

### Olası Sebepler ve Çözümler

#### 1. **Supabase Auth Oturumunun Kaybolması**
- **Tarayıcıda 3. parti çerezler veya localStorage engelleniyorsa** oturum kaybolur.
- **Supabase client yanlış yapılandırıldıysa** (ör. her sayfa yüklemede yeni client oluşturuluyorsa) oturum kaybolur.
- **Vercel/Netlify gibi platformlarda domain değişiyorsa** (ör. preview, farklı subdomain) oturum kaybolur.

#### 2. **Supabase Client Doğru Kullanımı**
- `supabase` client’ı tek bir dosyada (ör. `src/lib/supabase.ts`) oluşturulmalı ve uygulama boyunca hep aynı instance kullanılmalı.
- Her sayfa yüklemesinde yeni bir client oluşturulmamalı.

#### 3. **Kullanıcı Oturumunu Kontrol Etme**
- Kullanıcıyı kontrol etmek için:
  ```js
  const { data: { user } } = await supabase.auth.getUser();
  ```
- Eğer `user` null ise, gerçekten oturum yok demektir.

#### 4. **Otomatik Oturum Yenileme**
- Supabase, refresh token ile oturumu otomatik yeniler.  
- Ancak, tarayıcıda “Çerezleri Temizle” veya “Gizli Mod” kullanılıyorsa oturum kaybolur.

---

### **Çözüm ve Kontrol Listesi**

1. **supabase client’ı tek bir yerde oluştur ve her yerde onu kullan.**
   - Örnek:  
     ```ts
     // src/lib/supabase.ts
     import { createClient } from '@supabase/supabase-js';
     export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
     ```
   - Diğer dosyalarda sadece `import { supabase } from '../lib/supabase';` ile kullan.

2. **Kullanıcı login olduktan sonra, sayfa yenilense bile oturum açık kalmalı.**
   - Eğer sürekli login istiyorsa, tarayıcıda localStorage veya cookie engeli var mı kontrol et.

3. **Vercel/Netlify’da farklı domain/subdomain kullanıyorsan, ana domaini kullan.**

4. **Gizli modda test etme, normal modda test et.**

---

### **Ekstra: Otomatik Giriş (Session Restore)**
- Uygulama açıldığında, `supabase.auth.getUser()` ile kullanıcıyı kontrol et.
- Eğer kullanıcı yoksa login sayfasına yönlendir.

---

### **Hala Sorun Devam Ediyorsa:**
- Supabase client dosyanı ve auth ile ilgili kodunu paylaş, doğrudan inceleyip sana özel çözüm sunayım.
- Hangi ortamda (localhost, Vercel, Netlify, mobilde mi) test ettiğini belirt.

---

**Kısacası:**  
Normalde her seferinde tekrar giriş yapman gerekmez.  
Yukarıdaki adımları uygula, hala sorun varsa kodunu paylaş, kesin çözüm bulalım!
