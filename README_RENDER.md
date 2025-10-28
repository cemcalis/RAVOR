README: Render'a hızlı deploy (Türkçe)

## Amaç

Bu proje için Render üstünde hem frontend (Next.js) hem backend (Express) servisini hızlıca açman için hazır `render.yaml` ve talimatlar sağladım. Ben doğrudan sana yerine deploy yapamam (hesap, API anahtarı ve kullanıcı yetkisi gerekiyor). Ancak aşağıdaki adımları izlersen tek tıkla deploy edebilirsin.

## Hızlı yol (en az uğraş)

1. Bu repo'yu Render'a bağla (Render → New → Import from GitHub) — repo zaten bağlıysa devam et.
2. `render.yaml` dosyası repo köküne eklendi. Render genelde repo taramasında bu dosyayı bulur ve otomatik kurulum önerir.
   - Render otomatik algılamazsa, "New → Web Service" seç ve aşağıdaki alanları manuel gir (buna dair hazır bloklar aşağıda var).
3. Backend servisini oluştur (Render UI sana bir domain verecek, örn: `ravor-backend.onrender.com`).
4. Frontend servis ayarlarına dön ve `NEXT_PUBLIC_API_URL` değerini backend'in verdiği URL ile güncelle (ör: https://ravor-backend.onrender.com/api).
5. Deploy'u başlat ve logları izle.

## Manuel doldurma blokları (kopyala yapıştır)

Frontend (Render New Web Service):

- Name: RAVOR-frontend
- Root Directory: frontend
- Build Command: npm ci && npm run build
- Start Command: npm run start
- Env:
  - NEXT_PUBLIC_API_URL = https://<backend-url>/api (backend'i oluşturduktan sonra güncelle)
  - NODE_ENV = production

Backend (Render New Web Service):

- Name: RAVOR-backend
- Root Directory: backend
- Build Command: npm ci
- Start Command: npm start
- Health Check Path: /api/health
- Env:
  - JWT_SECRET = (Render UI'da "Generate" ile güçlü bir gizli değer oluştur)
  - BASE_URL = https://<backend-url>
  - NODE_ENV = production

## Önemli notlar

- SQLite + uploads klasörleri: Render'ın instance diski kalıcı olmayabilir. Eğer veritabanı ve yüklenen dosyaların kalıcı olmasını istiyorsan:
  - Backend servisini oluştururken "Persistent Disk" seç (Render ücretli planlarda mevcut olabilir); veya
  - Ürün/ürün görsellerini doğrudan S3'e yükleyecek şekilde backend'i değiştir (ben yardımcı olabilirim).
- Güvenlik: `JWT_SECRET` kesinlikle repo'ya koyma. Render UI'da environment variable olarak ekle.

Eğer istersen ben şunları yaparım (bana izin verirsen):

- `render.yaml`'ı geliştirebilirim (S3/Postgres seçenekleri ile) ve GitHub Actions ekleyerek Render API anahtarı eklediğinde otomatik servis oluşturulmasını sağlayabilirim. Bunun için senin Render API Key (GITHUB secrets içine) eklemen gerekir — bu adım sadece bir kez gerekli olur.

Ne yapayım şimdi?

- "Render'a otomatik deploy et" diyorsan: bana GitHub repo'ya push yetkim yok; ama ben bir GitHub Action hazırlayıp ekleyebilirim. Sen sadece GitHub Secrets -> RENDER_API_KEY ekleyeceksin, sonra Action otomatik kurulum/döndürme yapar.
- "Ben kendim yaparım, sadece UI değerleri ver" diyorsan: üstteki blokları kullan.

Yardım istersen adım adım ekran paylaş ya da "otomatik action" isteğini belirt — ona göre GitHub Action ve ek talimatları oluştururum.
