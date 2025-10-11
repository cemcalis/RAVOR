# ✅ Netlify Deploy Kontrol Listesi

## Hazırlık Tamamlandı

### ✅ Backend (Netlify Functions)
- [x] `netlify/functions/` klasörü oluşturuldu
- [x] Database helper (Netlify Blobs) hazırlandı
- [x] API endpoints oluşturuldu:
  - [x] products.js
  - [x] categories.js
  - [x] cart.js
  - [x] orders.js
  - [x] auth.js
- [x] package.json (functions) oluşturuldu
- [x] Seed data mekanizması eklendi

### ✅ Frontend
- [x] API helper (`src/lib/api.ts`) oluşturuldu
- [x] Tüm API çağrıları güncellendi:
  - [x] AuthContext.tsx
  - [x] ProductGrid.tsx
  - [x] yeni-gelenler/page.tsx
  - [x] urun/[slug]/page.tsx
  - [x] koleksiyon/[slug]/page.tsx
  - [x] odeme/page.tsx
  - [x] siparislerim/page.tsx
- [x] Environment variables yapılandırıldı

### ✅ Yapılandırma Dosyaları
- [x] `netlify.toml` (root)
- [x] `package.json` (root)
- [x] `.gitignore` (root)
- [x] `.env.example`

### ✅ Dokümantasyon
- [x] `NETLIFY_DEPLOY_GUIDE.md` - Detaylı rehber
- [x] `QUICKSTART.md` - Hızlı başlangıç
- [x] `README.md` - Güncellendi
- [x] `DEPLOYMENT_CHECKLIST.md` - Bu dosya

## 🚀 Deploy Adımları

### 1. Netlify'a Git
👉 https://app.netlify.com

### 2. Site Oluştur

**Seçenek A: Git (Önerilen)**
```bash
git init
git add .
git commit -m "Initial commit - Ready for Netlify"
git remote add origin YOUR_REPO_URL
git push -u origin main
```
Netlify'da: "Import from Git" > Repository seç

**Seçenek B: Drag & Drop**
- "Deploy manually"
- `istek` klasörünü sürükle-bırak

### 3. Environment Variables

Site Settings > Environment Variables > Add:

```
Key: JWT_SECRET
Value: [32+ karakter güçlü secret]
```

Örnek güçlü secret oluşturma:
```bash
# Node.js ile
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Online: https://generate-secret.vercel.app/32
```

### 4. Deploy Başlat

- Netlify otomatik build başlatır
- Build logs'u takip et
- Deploy tamamlandığında site URL'i alacaksın

## 🔍 Deploy Sonrası Kontroller

### Test Edilmesi Gerekenler:

1. **Ana Sayfa**
   - [ ] Sayfa yükleniyor mu?
   - [ ] Ürünler görünüyor mu?

2. **API Endpoints**
   - [ ] `https://your-site.netlify.app/.netlify/functions/products`
   - [ ] `https://your-site.netlify.app/.netlify/functions/categories`

3. **Ürün Sayfası**
   - [ ] Ürün detayları yükleniyor mu?
   - [ ] Görseller görünüyor mu?

4. **Authentication**
   - [ ] Kayıt olma çalışıyor mu?
   - [ ] Giriş yapma çalışıyor mu?

5. **Sepet**
   - [ ] Ürün eklenebiliyor mu?
   - [ ] Miktar güncellenebiliyor mu?

6. **Sipariş**
   - [ ] Sipariş oluşturuluyor mu?
   - [ ] Sipariş listesi görünüyor mu?

## 🐛 Sorun Giderme

### Build Hatası
1. Netlify Dashboard > Deploys > Build log kontrol et
2. Hata mesajını oku
3. Genelde eksik dependency veya syntax hatası

**Çözüm:**
```bash
cd frontend
npm install
npm run build  # Local'de test et
```

### Functions Çalışmıyor
1. Dashboard > Functions > Logs kontrol et
2. Environment variables doğru mu?
3. JWT_SECRET eklenmiş mi?

### Database Boş
- İlk API çağrısında otomatik seed edilir
- Tarayıcıda: `https://your-site.netlify.app/.netlify/functions/products`
- Birkaç saniye bekle, tekrar dene

### CORS Hatası
- Functions'da CORS headers zaten eklendi
- Eğer hata alıyorsan, browser cache'i temizle

## 📊 Netlify Dashboard

### Önemli Bölümler:

1. **Site Overview**
   - Deploy status
   - Site URL
   - Son deploy zamanı

2. **Deploys**
   - Build logs
   - Deploy history
   - Rollback seçeneği

3. **Functions**
   - Function logs
   - Invocation count
   - Error tracking

4. **Site Settings**
   - Environment variables
   - Build settings
   - Domain settings

## 🎉 Deploy Başarılı!

Site URL'niz: `https://your-site-name.netlify.app`

### Sonraki Adımlar:

1. **Custom Domain** (Opsiyonel)
   - Site Settings > Domain management
   - Kendi domain'inizi bağlayın

2. **Analytics**
   - Site Settings > Analytics
   - Ziyaretçi istatistiklerini görün

3. **Form Notifications**
   - Site Settings > Forms
   - Form gönderimlerinde email al

4. **Performance**
   - Lighthouse score kontrol et
   - Optimizasyonlar yap

## 📞 Destek

Sorun yaşarsanız:
- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
- GitHub Issues: Projenizde issue açın

---

**Hazırlayan:** AI Assistant
**Tarih:** 2025
**Versiyon:** 1.0
