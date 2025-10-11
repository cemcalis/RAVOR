# Authentication Sistemi - Değişiklik Özeti

## ✅ Tamamlanan İşlemler

### Backend Değişiklikleri

#### 1. Database Güncellemeleri (`backend/db.js`)
- ✅ `users` tablosu eklendi (email, password, name, phone, address)
- ✅ `orders` tablosuna `user_id` foreign key eklendi

#### 2. Authentication Route'ları (`backend/routes/auth.js`)
- ✅ `/api/auth/register` - Yeni kullanıcı kaydı (bcrypt ile şifre hashleme)
- ✅ `/api/auth/login` - Kullanıcı girişi (JWT token döndürür)
- ✅ `/api/auth/me` - Kullanıcı bilgilerini getir/güncelle
- ✅ `authenticateToken` middleware - JWT doğrulama

#### 3. Orders Route Güncellemesi (`backend/routes/orders.js`)
- ✅ Sipariş oluşturma endpoint'i artık authentication gerektiriyor
- ✅ Kullanıcının tüm siparişlerini listeleme endpoint'i eklendi
- ✅ Sipariş detayı endpoint'i authentication gerektiriyor

#### 4. Server Güncellemesi (`backend/server.js`)
- ✅ Auth route'ları eklendi (`/api/auth`)

#### 5. Package.json Güncellemesi
- ✅ `bcrypt` - Şifre hashleme
- ✅ `jsonwebtoken` - JWT token yönetimi
- ✅ `cookie-parser` - Cookie desteği

### Frontend Değişiklikleri

#### 1. Authentication Context (`frontend/src/contexts/AuthContext.tsx`)
- ✅ Global authentication state yönetimi
- ✅ `login()` - Giriş fonksiyonu
- ✅ `register()` - Kayıt fonksiyonu
- ✅ `logout()` - Çıkış fonksiyonu
- ✅ LocalStorage ile token ve user bilgisi saklama

#### 2. Layout Güncellemesi (`frontend/src/app/layout.tsx`)
- ✅ AuthProvider ile tüm uygulama sarmalandı

#### 3. Header Güncellemesi (`frontend/src/components/Header.tsx`)
- ✅ Kullanıcı giriş yapmışsa isim gösteriliyor
- ✅ Dropdown menü (Hesabım, Siparişlerim, Çıkış Yap)
- ✅ Giriş yapmamışsa "Giriş Yap" butonu

#### 4. Yeni Sayfalar

**Giriş Sayfası** (`/giris`)
- ✅ Email ve şifre ile giriş
- ✅ Redirect parametresi desteği
- ✅ Kayıt sayfasına link

**Kayıt Sayfası** (`/kayit`)
- ✅ Ad Soyad, Email, Telefon, Adres, Şifre
- ✅ Şifre doğrulama
- ✅ Otomatik giriş yapma

**Ödeme Sayfası** (`/odeme`)
- ✅ Authentication kontrolü (giriş yapılmamışsa yönlendirme)
- ✅ Kullanıcı bilgileri otomatik doldurulur
- ✅ Sipariş oluşturma (JWT token ile)

**Sipariş Başarılı** (`/siparis-basarili`)
- ✅ Sipariş onay sayfası
- ✅ Sipariş numarası gösterimi

**Siparişlerim** (`/siparislerim`)
- ✅ Kullanıcının tüm siparişlerini listeler
- ✅ Authentication kontrolü
- ✅ Sipariş durumu gösterimi

**Hesabım** (`/hesap`)
- ✅ Kullanıcı bilgilerini görüntüleme
- ✅ Bilgileri düzenleme
- ✅ Authentication kontrolü

#### 5. Sepet Sayfası Güncellemesi (`/sepet`)
- ✅ Giriş yapılmadan ödemeye geçiş engellendi
- ✅ "Giriş Yapın" butonu eklendi
- ✅ Giriş yapmamış kullanıcılar için uyarı mesajı

##  Güvenlik Özellikleri

- ✅ Şifreler bcrypt ile hashlenip saklanıyor
- ✅ JWT token ile session yönetimi (7 gün geçerlilik)
- ✅ Token localStorage'da saklanıyor
- ✅ Protected route'lar (middleware ile kontrol)
- ✅ Email uniqueness kontrolü

##  Kullanım

### Backend Başlatma
```bash
cd backend
npm install
npm start
```

### Frontend Başlatma
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Kullanıcı bilgilerini getir (Token gerekli)
- `PUT /api/auth/me` - Kullanıcı bilgilerini güncelle (Token gerekli)

### Orders
- `POST /api/orders` - Sipariş oluştur (Token gerekli)
- `GET /api/orders` - Kullanıcının siparişlerini listele (Token gerekli)
- `GET /api/orders/:id` - Sipariş detayı (Token gerekli)

## 🔄 Kullanıcı Akışı

1. **Yeni Kullanıcı:**
   - Kayıt sayfasına git (`/kayit`)
   - Bilgileri doldur
   - Otomatik giriş yapılır
   - Ana sayfaya yönlendirilir

2. **Mevcut Kullanıcı:**
   - Giriş sayfasına git (`/giris`)
   - Email ve şifre ile giriş yap
   - Ana sayfaya veya redirect URL'e yönlendirilir

3. **Alışveriş:**
   - Ürünleri sepete ekle
   - Sepete git
   - "Ödemeye Geç" butonuna tıkla
   - Giriş yapılmamışsa giriş sayfasına yönlendirilir
   - Giriş yaptıktan sonra ödeme sayfasına dön
   - Siparişi tamamla

4. **Sipariş Takibi:**
   - Header'dan "Siparişlerim" menüsüne tıkla
   - Tüm siparişleri görüntüle
   - Sipariş detaylarını incele

##  Önemli Notlar

- JWT_SECRET production'da mutlaka değiştirilmeli (şu an: 'your-secret-key-change-in-production')
- LocalStorage kullanıldığı için XSS saldırılarına karşı dikkatli olunmalı
- Production'da HTTPS kullanılmalı
- CORS ayarları production için düzenlenmeli


