git push# ⚡ Hızlı Başlangıç - Netlify Deploy

## 🎯 3 Adımda Deploy Et

### 1. Netlify'a Git
👉 https://app.netlify.com

### 2. Projeyi Yükle

**Drag & Drop ile:**
- "Add new site" > "Deploy manually"
- `istek` klasörünü sürükle-bırak

**veya Git ile:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```
Sonra Netlify'da "Import from Git" seç.

### 3. Environment Variable Ekle

Site Settings > Environment Variables:
```
JWT_SECRET = your-super-secret-key-min-32-chars
```

## ✅ Bitti!

Site URL'niz: `https://your-site-name.netlify.app`

---

📖 Detaylı rehber: `NETLIFY_DEPLOY_GUIDE.md`
