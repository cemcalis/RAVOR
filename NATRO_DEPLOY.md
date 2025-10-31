# Natro Deployment Rehberi

## Proje Yapısı

Bu proje full-stack bir e-ticaret uygulamasıdır:

- **Frontend**: Next.js (React/TypeScript)
- **Backend**: Node.js + Express
- **Database**: SQLite

## Natro Deployment Adımları

### 1. Natro Hesabı ve Hosting Kurulumu

1. [Natro.com](https://www.natro.com)'a üye olun
2. **"Hosting Paketleri"** bölümünden uygun bir paket satın alın
3. cPanel'e giriş yapın

### 2. Backend Deployment (Node.js)

#### Dosya Yükleme:

1. cPanel'de **"Dosya Yöneticisi"**'ne gidin
2. `public_html` klasörüne gidin (veya alt domain için klasör oluşturun)
3. `backend/` klasöründeki tüm dosyaları yükleyin:
   - `server.js`
   - `package.json`
   - `db.js`
   - `routes/` klasörü
   - `middleware/` klasörü
   - `lib/` klasörü
   - `migrations/` klasörü

#### Node.js Kurulumu:

1. cPanel'de **"Node.js Seçicisi"**'ne gidin
2. **"Node.js Sürümü"**'nden 22.20.0'ı seçin
3. **"Uygulama Kök Dizini"**: `/home/username/public_html/backend`
4. **"Uygulama URL'si"**: `https://siteniz.natro.com/api`
5. **"Başlatma Dosyası"**: `server.js`
6. **"Paket Yöneticisi"**: npm
7. **"Çalıştır"** butonuna tıklayın

#### Environment Variables:

1. cPanel'de **"Node.js Seçicisi"**'nde uygulamanızı seçin
2. **"Environment Variables"** bölümüne aşağıdaki değişkenleri ekleyin:
   ```
   PORT=5001
   JWT_SECRET=53e34c40b481bafb28560c81ffdaebd77b66cc0a00f4a48b670416a66536677e
   ADMIN_EMAIL=admin@aura.com
   ADMIN_PASSWORD=RdLZbWB3tciFPf5J
   FRONTEND_URL=https://siteniz.natro.com
   NODE_ENV=production
   ```

### 3. Veritabanı Kurulumu

#### SQLite için:

1. cPanel'de **"Dosya Yöneticisi"**'ne gidin
2. `backend/` klasörüne `database/` klasörünü yükleyin
3. Veritabanı dosyasının yazılabilir olduğundan emin olun (755 izin)

#### Alternatif: MySQL (Önerilen):

Natro'nun MySQL veritabanını kullanmak için:

1. cPanel'de **"MySQL Veritabanları"**'na gidin
2. Yeni veritabanı ve kullanıcı oluşturun
3. `backend/db.js` dosyasını MySQL kullanacak şekilde düzenleyin

### 4. Frontend Deployment (Next.js - Node.js Uygulaması)

#### Build Hazırlığı:

```bash
cd frontend
npm run build
```

#### Dosya Yükleme:

1. cPanel'de **"Dosya Yöneticisi"**'ne gidin
2. `public_html` klasörüne `frontend/` klasörünü yükleyin (backend'den ayrı)
3. Build sonrası oluşan `.next/` klasörü ve diğer dosyaları yükleyin

#### Next.js Node.js Kurulumu:

1. cPanel'de **"Node.js Seçicisi"**'ne gidin (ikinci bir uygulama olarak)
2. **"Node.js Sürümü"**'nden 22.20.0'ı seçin
3. **"Uygulama Kök Dizini"**: `/home/username/public_html/frontend`
4. **"Uygulama URL'si"**: `https://siteniz.natro.com`
5. **"Başlatma Dosyası"**: `node_modules/.bin/next start`
6. **"Paket Yöneticisi"**: npm
7. **"Çalıştır"** butonuna tıklayın

#### Frontend Environment Variables:

```
NEXT_PUBLIC_API_URL=https://siteniz.natro.com/api
NODE_ENV=production
```

### 5. Domain ve SSL Kurulumu

1. cPanel'de **"Domain Yönetimi"**'ne gidin
2. Domain'inizi ekleyin
3. **"SSL/TLS"** bölümünden Let's Encrypt SSL sertifikası alın

### 6. Test ve Doğrulama

1. Siteye gidin: `https://siteniz.natro.com`
2. Admin paneline giriş yapın: `https://siteniz.natro.com/admin/giris`
3. API endpoint'lerini test edin: `https://siteniz.natro.com/api/admin/stats`

## Önemli Notlar

- **SQLite vs MySQL**: Production'da MySQL kullanmanız önerilir
- **Backup**: Düzenli olarak veritabanınızı yedekleyin
- **Security**: Admin şifresini production'da değiştirin
- **Performance**: Resimler için CDN kullanmayı değerlendirin

## Sorun Giderme

### Backend Çalışmıyorsa:

1. cPanel Node.js logs'larını kontrol edin
2. Environment variables'ların doğru ayarlandığından emin olun
3. Package.json dependencies'lerinin yüklendiğini kontrol edin

### Frontend Çalışmıyorsa:

1. Build dosyalarının doğru yere yüklendiğini kontrol edin
2. API URL'lerinin doğru olduğunu kontrol edin

### CORS Hataları:

1. `FRONTEND_URL` değişkeninin doğru ayarlandığından emin olun
2. Backend CORS ayarlarını kontrol edin
