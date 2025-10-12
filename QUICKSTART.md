# ⚡ Hızlı Başlangıç - Vercel Deploy

## 🎯 3 Adımda Deploy Et

### 1. Vercel'e Git
👉 https://vercel.com

### 2. GitHub Repo'yu Import Et

**Git ile Push:**
```bash
git add .
git commit -m "Ready for Vercel"
git push
```

**Vercel'de:**
- "Add New Project" > "Import Git Repository"
- GitHub repo'nuzu seçin (cemcalis/AURA)
- Framework Preset: **Next.js** otomatik algılanacak
- Root Directory: **frontend**
- Build Command: `npm run build` (otomatik)
- Output Directory: `.next` (otomatik)

### 3. Deploy Et

- "Deploy" butonuna tıkla
- Vercel otomatik build edip deploy edecek

## ✅ Bitti!

Site URL'niz: `https://your-project-name.vercel.app`

---

## 🔧 Önemli Notlar

- Vercel Next.js için optimize edilmiştir
- Her push otomatik deploy tetikler
- Environment variables Vercel dashboard'dan eklenebilir
- Edge Functions otomatik çalışır
