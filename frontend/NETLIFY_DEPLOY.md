# Netlify'ye Deploy Etme Rehberi

## Hazırlık Adımları

### 1. Netlify Hesabı Oluşturun
- [Netlify](https://www.netlify.com/) sitesine gidin
- GitHub hesabınızla giriş yapın

### 2. Projeyi GitHub'a Push Edin
```bash
cd frontend
git add .
git commit -m "Netlify deployment hazırlığı"
git push origin main
```

### 3. Netlify'de Yeni Site Oluşturun

#### Otomatik Deploy (Önerilen)
1. Netlify Dashboard'a gidin
2. "Add new site" > "Import an existing project" seçin
3. GitHub'ı seçin ve repository'nizi bulun
4. Build ayarları otomatik algılanacak:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

#### Manuel Deploy
1. Terminal'de frontend klasöründe:
```bash
npm run build
```

2. Netlify Dashboard'da:
   - "Add new site" > "Deploy manually"
   - `.next` klasörünü sürükle-bırak

## Önemli Notlar

### Environment Variables
Eğer backend API'niz varsa, Netlify'de environment variable ekleyin:
- Site Settings > Environment Variables
- `NEXT_PUBLIC_API_URL` gibi değişkenler ekleyin

### Build Ayarları
`netlify.toml` dosyası zaten yapılandırılmış:
- Node.js version: 22.20.0 (`.nvmrc` dosyasında belirtildi)
- Build command: `npm run build`
- Publish directory: `.next`

### TypeScript ve ESLint
- Tüm TypeScript hataları düzeltildi
- ESLint kuralları optimize edildi
- Build sırasında tip kontrolü yapılıyor

## Sorun Giderme

### Build Hatası Alırsanız
1. Lokal'de test edin:
```bash
npm run build
```

2. Netlify build log'larını kontrol edin
3. Environment variable'ları kontrol edin

### API Bağlantı Sorunları
- Backend URL'lerini environment variable olarak ayarlayın
- CORS ayarlarını kontrol edin
- Netlify Functions kullanmayı düşünün

## Deploy Sonrası
- Site URL'nizi alacaksınız (örn: `your-site.netlify.app`)
- Custom domain ekleyebilirsiniz
- HTTPS otomatik aktif olacak
- Her push'ta otomatik deploy olacak

## Faydalı Linkler
- [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
