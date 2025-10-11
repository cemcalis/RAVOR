# AURA - E-Ticaret Platformu

Modern, minimal ve şık bir kadın giyim e-ticaret sitesi. Next.js 15, React 19, Tailwind CSS 4 ve Netlify Functions (Serverless) ile geliştirilmiştir.

## 🚀 Netlify'a Deploy

**Hızlı Deploy:** `QUICKSTART.md` dosyasına bakın (3 adım!)

**Detaylı Rehber:** `NETLIFY_DEPLOY_GUIDE.md` dosyasında tam açıklama

## 🎨 Özellikler

### Frontend
- ✅ **Modern UI/UX**: Minimal ve şık tasarım
- ✅ **Responsive**: Mobil, tablet ve desktop uyumlu
- ✅ **Anasayfa**: Hero banner, öne çıkan ürünler, yeni gelenler, koleksiyonlar
- ✅ **Koleksiyon Sayfası**: Filtreleme ve sıralama özellikleri
- ✅ **Ürün Detay**: Galeri, beden seçimi, sepete ekleme
- ✅ **Sepet**: Ürün ekleme/çıkarma, miktar güncelleme
- ✅ **Header/Footer**: Navigasyon, arama, sepet ikonu

### Backend (Netlify Functions)
- ✅ **Serverless API**: Netlify Functions ile API endpoints
- ✅ **Netlify Blobs**: NoSQL database storage
- ✅ **CRUD İşlemleri**: Ürün ve kategori yönetimi
- ✅ **Sepet Yönetimi**: Session bazlı sepet
- ✅ **Sipariş Sistemi**: Sipariş oluşturma ve takip
- ✅ **Authentication**: JWT + bcrypt ile güvenli auth

## 🚀 Kurulum ve Çalıştırma

### Netlify'a Deploy (Önerilen)

```bash
# 1. Netlify'a git: https://app.netlify.com
# 2. Projeyi yükle (drag & drop veya Git)
# 3. Environment variable ekle: JWT_SECRET
# 4. Deploy tamamlandı! 🎉
```

Detaylı rehber: `NETLIFY_DEPLOY_GUIDE.md`

### Local Development

```bash
# Frontend'i çalıştır
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

**Not:** Production'da backend Netlify Functions olarak çalışır.

## 📁 Proje Yapısı

```
istek/
├── netlify/
│   └── functions/              # Netlify Serverless Functions
│       ├── lib/
│       │   └── db.js          # Netlify Blobs database helper
│       ├── products.js        # Ürün API
│       ├── categories.js      # Kategori API
│       ├── cart.js            # Sepet API
│       ├── orders.js          # Sipariş API
│       ├── auth.js            # Authentication API
│       └── package.json       # Functions dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Anasayfa
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── koleksiyon/[slug]/    # Koleksiyon sayfası
│   │   │   ├── urun/[slug]/          # Ürün detay sayfası
│   │   │   └── sepet/                # Sepet sayfası
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx            # Site başlığı
│   │   │   ├── Footer.tsx            # Site altbilgisi
│   │   │   ├── Hero.tsx              # Ana banner
│   │   │   ├── ProductCard.tsx       # Ürün kartı
│   │   │   └── ProductGrid.tsx       # Ürün grid'i
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx       # Auth context
│   │   │
│   │   └── lib/
│   │       └── api.ts                # API helper functions
│   │
│   └── public/                       # Statik dosyalar
│
├── netlify.toml                      # Netlify yapılandırması
├── package.json                      # Root package.json
└── NETLIFY_DEPLOY_GUIDE.md          # Deploy rehberi
```

## 🎯 API Endpoints (Netlify Functions)

Production URL: `https://your-site.netlify.app/.netlify/functions/`

### Ürünler
- `GET /.netlify/functions/products` - Tüm ürünleri listele
  - Query params: `category`, `sort`, `featured`, `new_arrivals`, `search`
- `GET /.netlify/functions/products/:slug` - Tek ürün detayı
- `POST /.netlify/functions/products` - Yeni ürün ekle

### Kategoriler
- `GET /.netlify/functions/categories` - Tüm kategorileri listele
- `GET /.netlify/functions/categories/:slug` - Tek kategori detayı

### Sepet
- `GET /.netlify/functions/cart/:sessionId` - Sepeti getir
- `POST /.netlify/functions/cart/:sessionId/add` - Sepete ürün ekle
- `DELETE /.netlify/functions/cart/:sessionId/remove/:productId` - Sepetten çıkar
- `DELETE /.netlify/functions/cart/:sessionId` - Sepeti temizle

### Siparişler
- `POST /.netlify/functions/orders` - Yeni sipariş oluştur
- `GET /.netlify/functions/orders/:id` - Sipariş detayı
- `GET /.netlify/functions/orders?email=xxx` - Kullanıcı siparişleri

### Authentication
- `POST /.netlify/functions/auth/register` - Kayıt ol
- `POST /.netlify/functions/auth/login` - Giriş yap
- `POST /.netlify/functions/auth/verify` - Token doğrula

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary**: `#2d2d2d` (Koyu gri)
- **Secondary**: `#8b7355` (Toprak tonu)
- **Accent**: `#d4c5b9` (Bej)
- **Muted**: `#f5f5f5` (Açık gri)
- **Border**: `#e5e5e5` (Çok açık gri)

### Tipografi
- **Font**: Geist Sans (Google Fonts)
- **Heading**: Bold, -0.01em letter-spacing
- **Body**: Normal, -0.01em letter-spacing

## 📦 Kullanılan Teknolojiler

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Icons
- next-i18next (i18n desteği)

### Backend (Serverless)
- Netlify Functions
- Netlify Blobs (Database)
- bcrypt (Password hashing)
- jsonwebtoken (JWT Auth)
- @netlify/blobs

## 🔧 Geliştirme Notları

### Seed Data
İlk API çağrısında otomatik olarak:
- 5 kategori (Elbiseler, Üstler, Altlar, Dış Giyim, Aksesuarlar)
- 4 örnek ürün
- Boş sepetler ve siparişler

eklenir.

### Database (Netlify Blobs)
- NoSQL key-value storage
- Otomatik scaling
- Serverless yapı
- İlk çağrıda initialize edilir

### Placeholder Görseller
Şu an Unsplash'ten placeholder görseller kullanılıyor. Gerçek ürün görselleri için:
1. Görselleri `frontend/public/images/` klasörüne ekleyin
2. Database'deki `image_url` ve `images` alanlarını güncelleyin

## 📝 Yapılacaklar

- [ ] Ödeme sayfası ve entegrasyonu
- [ ] Kullanıcı hesap yönetimi
- [ ] Favori ürünler
- [ ] Ürün yorumları
- [ ] Admin paneli
- [ ] CSV ile ürün import
- [ ] E-posta bildirimleri
- [ ] Sipariş takip sistemi
- [ ] Çoklu dil desteği (TR/EN)

## 📄 Lisans

Bu proje özel kullanım içindir.

## 👨‍💻 Geliştirici

AURA E-Ticaret Platformu - 2025
