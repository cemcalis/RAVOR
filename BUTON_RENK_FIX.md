# 🎨 Ürün Sayfası Buton Renk Düzeltmesi

## 🐛 Sorun:
Ürün detay sayfasında beden seçimi, adet artırma/azaltma ve favorilere ekle butonları görünmüyordu. Butonların text renkleri açık arka planla aynı renkte olduğu için içerikleri (S, M, L, XL, +, -, ♥) görünmüyordu.

---

## ✅ Düzeltmeler:

### 1. **Beden Seçim Butonları (S, M, L, XL)**
```diff
- border-border hover:border-primary
+ border-gray-300 hover:border-primary text-gray-900 bg-white
```
- ✅ Beyaz arka plan
- ✅ Koyu gri text
- ✅ Gri kenarlık

### 2. **Adet Artırma/Azaltma Butonları (+ / -)**
```diff
- border border-border rounded-md hover:bg-muted
+ border border-gray-300 rounded-md hover:bg-gray-100 bg-white text-gray-900 font-semibold text-lg
```
- ✅ Beyaz arka plan
- ✅ Koyu gri text
- ✅ Daha büyük ve kalın + / - sembolleri
- ✅ Hover'da açık gri arka plan

### 3. **Favorilere Ekle Butonu (♥)**
```diff
- border border-border rounded-md hover:bg-muted
+ border border-gray-300 rounded-md hover:bg-gray-100 bg-white text-gray-900
```
- ✅ Beyaz arka plan
- ✅ Koyu gri kalp ikonu
- ✅ Hover'da açık gri arka plan

---

## 🎯 Sonuç:

Artık tüm butonlar açık arka planlarda bile net görünüyor:
- ✅ Beden butonları (S, M, L, XL) okunabilir
- ✅ Adet butonları (+ / -) net görünüyor
- ✅ Favorilere ekle kalp ikonu görünüyor

---

## 🚀 Test Et:

1. Frontend çalışıyorsa sayfayı yenile (Ctrl+F5)
2. Herhangi bir ürün sayfasına git (örn: http://localhost:3000/urun/kahverengi-uzun-hirka)
3. **Butonlar artık net görünecek!** ✨

---

**Dosya:** `frontend/src/app/urun/[slug]/page.tsx`
**Değişiklik:** Satır 259-290, 306
