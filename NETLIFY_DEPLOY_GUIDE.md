# 🚀 Netlify'a Deploy Rehberi

Bu proje **tam stack** bir e-ticaret uygulamasıdır ve Netlify'a deploy edilmeye hazırdır.

## 📋 İçerik

- ✅ Frontend: Next.js 15 + React 19
- ✅ Backend: Netlify Functions (Serverless)
- ✅ Database: Netlify Blobs (NoSQL Storage)
- ✅ Authentication: JWT + bcrypt
- ✅ API: RESTful endpoints

## 🎯 Hızlı Deploy (3 Adım)

### 1️⃣ Netlify'a Giriş Yap

1. [Netlify](https://app.netlify.com) sitesine git
2. GitHub, GitLab veya Email ile giriş yap

### 2️⃣ Projeyi Yükle

**Seçenek A: Git ile (Önerilen)**
```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit"

# GitHub'a push et
git remote add origin https://github.com/kullanici-adi/repo-adi.git
git push -u origin main
```

Netlify Dashboard'da:
- "Add new site" > "Import an existing project"
- GitHub repository'nizi seçin

**Seçenek B: Manuel Upload (Drag & Drop)**
- Netlify Dashboard'da "Add new site" > "Deploy manually"
- `istek` klasörünü sürükle-bırak

### 3️⃣ Environment Variables Ekle

Netlify Dashboard'da:
1. Site Settings > Environment Variables
2. Şu değişkeni ekle:

```
JWT_SECRET = your-super-secret-jwt-key-min-32-characters-long
```

**Önemli:** Production için güçlü bir secret kullanın!

## ✅ Deploy Tamamlandı!

Netlify otomatik olarak:
- ✅ Frontend'i build edecek
- ✅ Netlify Functions'ı deploy edecek
- ✅ Database'i initialize edecek
- ✅ SSL sertifikası ekleyecek
- ✅ CDN'e dağıtacak

Site URL'niz: `https://your-site-name.netlify.app`

## 🔧 Build Ayarları (Otomatik)

Netlify `netlify.toml` dosyasından otomatik okur:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[functions]
  directory = "netlify/functions"
```

## 📡 API Endpoints

Deploy sonrası API'ler şu adreste çalışır:

```
https://your-site-name.netlify.app/.netlify/functions/
```

### Mevcut Endpoints:

**Products**
- `GET /.netlify/functions/products` - Tüm ürünler
- `GET /.netlify/functions/products/:slug` - Tek ürün
- `POST /.netlify/functions/products` - Yeni ürün

**Categories**
- `GET /.netlify/functions/categories` - Tüm kategoriler
- `GET /.netlify/functions/categories/:slug` - Tek kategori

**Cart**
- `GET /.netlify/functions/cart/:sessionId` - Sepeti getir
- `POST /.netlify/functions/cart/:sessionId/add` - Sepete ekle
- `DELETE /.netlify/functions/cart/:sessionId/remove/:productId` - Sepetten çıkar

**Orders**
- `POST /.netlify/functions/orders` - Sipariş oluştur
- `GET /.netlify/functions/orders/:id` - Sipariş detayı
- `GET /.netlify/functions/orders?email=xxx` - Kullanıcı siparişleri

**Auth**
- `POST /.netlify/functions/auth/register` - Kayıt ol
- `POST /.netlify/functions/auth/login` - Giriş yap
- `POST /.netlify/functions/auth/verify` - Token doğrula

## 🗄️ Database (Netlify Blobs)

Database otomatik olarak initialize edilir ve şu verileri içerir:

- **Categories**: 5 kategori (Elbiseler, Üstler, Altlar, Dış Giyim, Aksesuarlar)
- **Products**: 4 örnek ürün
- **Carts**: Boş sepetler objesi
- **Orders**: Boş siparişler array'i
- **Users**: Boş kullanıcılar array'i

İlk API çağrısında otomatik seed data eklenir.

## 🔄 Otomatik Deploy

Her git push'ta Netlify otomatik deploy eder:

```bash
git add .
git commit -m "Update"
git push
```

## 🐛 Sorun Giderme

### Build Hatası
1. Netlify Dashboard > Deploys > Deploy log'ları kontrol et
2. `netlify/functions/package.json` dependencies kontrol et

### API Çalışmıyor
1. Functions log'larını kontrol et: Dashboard > Functions
2. Environment variables doğru mu kontrol et

### Database Boş
- İlk API çağrısı yapıldığında otomatik seed edilir
- Tarayıcıda: `https://your-site.netlify.app/.netlify/functions/products`

## 📊 Monitoring

Netlify Dashboard'da:
- **Analytics**: Ziyaretçi istatistikleri
- **Functions**: API çağrı sayıları ve hatalar
- **Bandwidth**: Veri kullanımı

## 💰 Maliyet

**Netlify Free Tier:**
- ✅ 100 GB bandwidth/ay
- ✅ 125,000 function invocations/ay
- ✅ Sınırsız site
- ✅ SSL sertifikası
- ✅ CDN

Bu proje için Free tier yeterlidir!

## 🎨 Custom Domain (Opsiyonel)

1. Netlify Dashboard > Domain Settings
2. "Add custom domain" tıkla
3. DNS ayarlarını güncelle

## 🔐 Güvenlik

✅ **Yapılanlar:**
- HTTPS (SSL) otomatik
- JWT authentication
- Password hashing (bcrypt)
- CORS yapılandırması
- Environment variables

⚠️ **Öneriler:**
- JWT_SECRET'ı güçlü yapın (min 32 karakter)
- Rate limiting ekleyin (production için)
- Input validation güçlendirin

## 📚 Ek Kaynaklar

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Blobs](https://docs.netlify.com/blobs/overview/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)

## 🆘 Destek

Sorun yaşarsanız:
1. Netlify Community: https://answers.netlify.com
2. Netlify Support: https://www.netlify.com/support/

---

**🎉 Tebrikler! Siteniz artık canlıda!**

Site URL: `https://your-site-name.netlify.app`
