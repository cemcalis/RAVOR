#!/bin/bash

echo "🚀 Netlify Deploy Hazırlığı Başlıyor..."

# Bağımlılıkları yükle
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# Build işlemi
echo "🔨 Build işlemi başlıyor..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build başarılı!"
    echo "📤 Artık Netlify'ye deploy edebilirsiniz."
    echo ""
    echo "Netlify'ye deploy etmek için:"
    echo "1. https://app.netlify.com/ adresine gidin"
    echo "2. 'Add new site' > 'Deploy manually' seçin"
    echo "3. .next klasörünü sürükle-bırak yapın"
    echo ""
    echo "VEYA"
    echo ""
    echo "GitHub üzerinden otomatik deploy için:"
    echo "1. Projeyi GitHub'a push edin"
    echo "2. Netlify'de 'Import from Git' seçin"
    echo "3. Repository'nizi seçin"
else
    echo "❌ Build başarısız!"
    echo "Lütfen hataları kontrol edin ve düzeltin."
    exit 1
fi
