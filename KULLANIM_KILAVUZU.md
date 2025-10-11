# 📖 AURA E-Ticaret - Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Backend'i Başlatma

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle (ilk seferinde)
npm install

# Veritabanını oluştur ve örnek ürünleri ekle
npm run seed

# Sunucuyu başlat
npm start
```

✅ Backend `http://localhost:5000` adresinde çalışacak.

### 2. Frontend'i Başlatma

```bash
# Yeni bir terminal aç ve frontend klasörüne git
cd frontend

# Bağımlılıkları yükle (ilk seferinde)
npm install

# Development server'ı başlat
npm run dev
```

✅ Frontend `http://localhost:3000` adresinde çalışacak.

### 3. Siteyi Görüntüleme

Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 📦 Ürün Yönetimi

### Mevcut Ürünleri Görüntüleme

API üzerinden tüm ürünleri görmek için:
```
http://localhost:5000/api/products
```

Tarayıcınızda veya Postman'de açabilirsiniz.

### Yeni Ürün Ekleme (Manuel)

**Postman veya cURL ile:**

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yeni Ürün",
    "slug": "yeni-urun",
    "description": "Ürün açıklaması",
    "price": 1500,
    "compare_price": 2000,
    "category_id": 1,
    "image_url": "https://images.unsplash.com/photo-example.jpg",
    "images": ["https://images.unsplash.com/photo-1.jpg", "https://images.unsplash.com/photo-2.jpg"],
    "stock_status": "in_stock",
    "is_featured": 1,
    "is_new": 1
  }'
```

### CSV ile Toplu Ürün Ekleme

1. **CSV dosyasını hazırlayın:**

`products-template.csv` dosyasını örnek alın:

```csv
name,slug,description,price,compare_price,category_slug,image_url,images,stock_status,is_featured,is_new
"Yeni Elbise",yeni-elbise,"Açıklama",1250,1650,elbiseler,https://example.com/img.jpg,"img1.jpg|img2.jpg",in_stock,1,1
```

2. **CSV'yi import edin:**

```bash
cd backend
npm run import products.csv
```

veya

```bash
node import-csv.js yol/dosya.csv
```

---

## 🎨 Tasarım Özelleştirme

### Renkleri Değiştirme

`frontend/src/app/globals.css` dosyasını açın:

```css
:root {
  --background: #ffffff;      /* Arka plan rengi */
  --foreground: #1a1a1a;      /* Metin rengi */
  --primary: #2d2d2d;         /* Ana renk (butonlar) */
  --secondary: #8b7355;       /* İkincil renk (hover) */
  --accent: #d4c5b9;          /* Vurgu rengi */
  --muted: #f5f5f5;           /* Soluk arka plan */
  --border: #e5e5e5;          /* Kenarlık rengi */
}
```

### Logo Değiştirme

`frontend/src/components/Header.tsx` dosyasında:

```tsx
<Link href="/" className="text-2xl font-bold tracking-tight">
  AURA  {/* Buraya kendi logo/marka adınızı yazın */}
</Link>
```

Veya bir logo görseli eklemek için:

```tsx
<Link href="/">
  <Image src="/logo.png" alt="Logo" width={120} height={40} />
</Link>
```

### Hero Banner Görseli Değiştirme

`frontend/src/components/Hero.tsx` dosyasında:

```tsx
<Image
  src="https://images.unsplash.com/photo-YOUR-IMAGE.jpg"  // Kendi görselinizi ekleyin
  alt="Hero"
  fill
  className="object-cover"
  priority
/>
```

---

## 📂 Kategori Yönetimi

### Mevcut Kategoriler

Varsayılan olarak şu kategoriler var:
- Elbiseler (`elbiseler`)
- Üstler (`ustler`)
- Altlar (`altlar`)
- Dış Giyim (`dis-giyim`)
- Aksesuarlar (`aksesuarlar`)

### Yeni Kategori Ekleme

**API ile:**

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ayakkabı",
    "slug": "ayakkabi",
    "description": "Ayakkabı koleksiyonu"
  }'
```

**Veya doğrudan veritabanına:**

```sql
INSERT INTO categories (name, slug, description) 
VALUES ('Ayakkabı', 'ayakkabi', 'Ayakkabı koleksiyonu');
```

### Header Menüsüne Kategori Ekleme

`frontend/src/components/Header.tsx` dosyasında:

```tsx
const categories = [
  { name: 'Elbiseler', href: '/koleksiyon/elbiseler' },
  { name: 'Üstler', href: '/koleksiyon/ustler' },
  { name: 'Ayakkabı', href: '/koleksiyon/ayakkabi' },  // Yeni kategori
  // ...
];
```

---

## 🖼️ Görsel Yönetimi

### Unsplash Görselleri (Placeholder)

Şu an placeholder olarak Unsplash görselleri kullanılıyor. Bunlar ücretsiz ve telif hakkı sorunu yok.

### Kendi Görsellerinizi Kullanma

1. **Görselleri yükleyin:**
   - `frontend/public/images/` klasörüne koyun
   - Örnek: `frontend/public/images/urunler/elbise-1.jpg`

2. **Veritabanında günceleyin:**

```sql
UPDATE products 
SET image_url = '/images/urunler/elbise-1.jpg',
    images = '["/images/urunler/elbise-1.jpg", "/images/urunler/elbise-2.jpg"]'
WHERE slug = 'minimal-siyah-elbise';
```

3. **Veya CSV ile toplu yükleyin:**

```csv
name,slug,...,image_url,images,...
"Elbise",elbise,...,/images/urunler/elbise-1.jpg,"/images/urunler/elbise-1.jpg|/images/urunler/elbise-2.jpg",...
```

---

## 🛒 Sepet ve Sipariş

### Sepet Sistemi

Sepet şu an **session-based** çalışıyor (in-memory). Gerçek projede:
- Cookie/LocalStorage kullanın
- Veya kullanıcı girişi ile veritabanına kaydedin

### Sipariş Oluşturma

Sipariş API'si hazır:

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Ahmet Yılmaz",
    "customer_email": "ahmet@example.com",
    "customer_phone": "05551234567",
    "shipping_address": "İstanbul, Türkiye",
    "total_amount": 2500,
    "items": [
      {
        "product_id": 1,
        "variant_id": 1,
        "quantity": 2,
        "price": 1250
      }
    ]
  }'
```

---

## 🔧 Sorun Giderme

### Backend çalışmıyor

1. Port 5000 kullanımda mı kontrol edin:
   ```bash
   netstat -ano | findstr :5000
   ```

2. Veritabanı oluşturuldu mu kontrol edin:
   ```bash
   cd backend
   npm run seed
   ```

### Frontend çalışmıyor

1. Bağımlılıklar yüklü mü:
   ```bash
   cd frontend
   npm install
   ```

2. Port 3000 kullanımda mı:
   ```bash
   netstat -ano | findstr :3000
   ```

### Görseller yüklenmiyor

`frontend/next.config.ts` dosyasında domain ekli mi kontrol edin:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'sizin-domain.com',  // Kendi domain'inizi ekleyin
    },
  ],
},
```

### API'ye erişilemiyor

Frontend'de API URL'i doğru mu:

```typescript
const response = await fetch('http://localhost:5000/api/products');
```

Production'da:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/products`);
```

---

## 📊 Veritabanı Yönetimi

### SQLite Veritabanını Görüntüleme

**DB Browser for SQLite** kullanın (ücretsiz):
1. İndirin: https://sqlitebrowser.org/
2. `database/store.db` dosyasını açın
3. Tabloları görüntüleyin ve düzenleyin

### Veritabanını Sıfırlama

```bash
# Veritabanı dosyasını silin
rm database/store.db

# Yeniden oluşturun
cd backend
npm run seed
```

---

## 🌐 Canlıya Alma (Production)

### Backend (Render, Railway, Heroku)

1. **PostgreSQL'e geçin** (SQLite production için uygun değil)
2. Environment variables ekleyin:
   ```
   DATABASE_URL=postgresql://...
   PORT=5000
   ```

### Frontend (Vercel, Netlify)

1. **Build edin:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api.yoursite.com
   ```

3. **Deploy edin:**
   ```bash
   vercel deploy
   ```

---

## 📞 Destek

Sorun yaşarsanız:
1. `README.md` dosyasını okuyun
2. Terminal'deki hata mesajlarını kontrol edin
3. Browser console'u kontrol edin (F12)

---

## ✅ Checklist

- [ ] Backend çalışıyor (`http://localhost:5000`)
- [ ] Frontend çalışıyor (`http://localhost:3000`)
- [ ] Seed data eklendi (8 ürün var)
- [ ] Anasayfa açılıyor
- [ ] Ürünler listeleniyor
- [ ] Ürün detay sayfası çalışıyor
- [ ] Sepete ekleme çalışıyor
- [ ] Kategoriler çalışıyor

Hepsi ✅ ise projeniz hazır! 🎉
