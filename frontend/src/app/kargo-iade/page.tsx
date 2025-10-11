export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Kargo & İade</h1>

        {/* Kargo Bilgileri */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🚚 Kargo Bilgileri</h2>
          
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Kargo Ücreti</h3>
              <ul className="space-y-2 text-foreground/70">
                <li>• 2.000 TL ve üzeri alışverişlerde <strong className="text-green-600">ücretsiz kargo</strong></li>
                <li>• 2.000 TL altı alışverişlerde kargo ücreti: <strong>49,90 TL</strong></li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Teslimat Süresi</h3>
              <ul className="space-y-2 text-foreground/70">
                <li>• Siparişiniz onaylandıktan sonra <strong>1-2 iş günü</strong> içinde kargoya verilir</li>
                <li>• Kargo teslimat süresi: <strong>2-3 iş günü</strong></li>
                <li>• Toplam teslimat süresi: <strong>3-5 iş günü</strong></li>
                <li>• Hafta sonları ve resmi tatil günleri teslimat yapılmaz</li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Kargo Firmaları</h3>
              <p className="text-foreground/70 mb-2">
                Siparişleriniz aşağıdaki kargo firmaları ile gönderilmektedir:
              </p>
              <ul className="space-y-1 text-foreground/70">
                <li>• Yurtiçi Kargo</li>
                <li>• Aras Kargo</li>
                <li>• MNG Kargo</li>
              </ul>
            </div>

            <div className="bg-accent/20 p-6 rounded-lg border-l-4 border-secondary">
              <h3 className="font-semibold mb-2">📦 Kargo Takibi</h3>
              <p className="text-sm text-foreground/70">
                Siparişiniz kargoya verildikten sonra e-posta adresinize kargo takip numarası gönderilecektir.
                Bu numara ile kargo firmasının web sitesinden gönderinizi takip edebilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* İade ve Değişim */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🔄 İade ve Değişim</h2>
          
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">İade Koşulları</h3>
              <ul className="space-y-2 text-foreground/70">
                <li>• Ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde iade edebilirsiniz</li>
                <li>• Ürün kullanılmamış, yıkanmamış ve etiketleri sökülmemiş olmalıdır</li>
                <li>• Hijyen gerekliliği olan ürünler (iç giyim, mayo, bikini) <strong>iade edilemez</strong></li>
                <li>• İndirimli ürünler iade edilebilir</li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">İade Süreci</h3>
              <ol className="space-y-3 text-foreground/70">
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">1.</span>
                  <span>İade talebinizi <strong>info@aura.com</strong> adresine veya müşteri hizmetlerimize iletin</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Size iade kargo kodu gönderilecektir (iade kargo ücretsizdir)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Ürünü orijinal ambalajında kargo ile gönderin</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Ürün depomıza ulaştıktan sonra <strong>3-5 iş günü</strong> içinde ödemeniz iade edilir</span>
                </li>
              </ol>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Değişim</h3>
              <p className="text-foreground/70 mb-3">
                Beden veya renk değişimi yapmak istiyorsanız:
              </p>
              <ul className="space-y-2 text-foreground/70">
                <li>• Mevcut ürünü iade edin</li>
                <li>• İstediğiniz yeni ürün için yeni sipariş oluşturun</li>
                <li>• Veya müşteri hizmetlerimizle iletişime geçin, size yardımcı olalım</li>
              </ul>
            </div>

            <div className="bg-accent/20 p-6 rounded-lg border-l-4 border-secondary">
              <h3 className="font-semibold mb-2">💳 İade Ödemesi</h3>
              <p className="text-sm text-foreground/70">
                İade onaylandıktan sonra ödemeniz, satın alma sırasında kullandığınız ödeme yöntemine 
                (kredi kartı, banka kartı) <strong>5-7 iş günü</strong> içinde iade edilir.
              </p>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section>
          <h2 className="text-2xl font-bold mb-6">❓ Sık Sorulan Sorular</h2>
          
          <div className="space-y-4">
            <details className="bg-muted p-6 rounded-lg cursor-pointer">
              <summary className="font-semibold">Siparişimi nasıl takip edebilirim?</summary>
              <p className="mt-3 text-foreground/70 text-sm">
                Siparişiniz kargoya verildikten sonra e-posta adresinize kargo takip numarası gönderilir. 
                Bu numara ile kargo firmasının web sitesinden takip yapabilirsiniz.
              </p>
            </details>

            <details className="bg-muted p-6 rounded-lg cursor-pointer">
              <summary className="font-semibold">İade kargo ücreti kim tarafından ödenir?</summary>
              <p className="mt-3 text-foreground/70 text-sm">
                İade kargo ücreti tarafımızca karşılanmaktadır. Size ücretsiz iade kargo kodu gönderilir.
              </p>
            </details>

            <details className="bg-muted p-6 rounded-lg cursor-pointer">
              <summary className="font-semibold">Hangi ürünler iade edilemez?</summary>
              <p className="mt-3 text-foreground/70 text-sm">
                Hijyen gerekliliği olan ürünler (iç giyim, mayo, bikini) ve kullanılmış, yıkanmış veya 
                etiketi sökülmüş ürünler iade edilemez.
              </p>
            </details>

            <details className="bg-muted p-6 rounded-lg cursor-pointer">
              <summary className="font-semibold">İade param ne zaman hesabıma geçer?</summary>
              <p className="mt-3 text-foreground/70 text-sm">
                İade onaylandıktan sonra ödemeniz 5-7 iş günü içinde kredi kartınıza veya banka hesabınıza 
                iade edilir. Bankanıza göre bu süre değişiklik gösterebilir.
              </p>
            </details>

            <details className="bg-muted p-6 rounded-lg cursor-pointer">
              <summary className="font-semibold">Yurtdışına kargo yapıyor musunuz?</summary>
              <p className="mt-3 text-foreground/70 text-sm">
                Şu anda sadece Türkiye içi teslimat yapıyoruz. Uluslararası kargo için 
                info@aura.com adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </details>
          </div>
        </section>

        {/* İletişim */}
        <div className="mt-12 bg-primary text-white p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">Başka Sorunuz mu Var?</h3>
          <p className="mb-4">
            Müşteri hizmetlerimiz size yardımcı olmak için burada!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@aura.com"
              className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              E-posta Gönder
            </a>
            <a
              href="/iletisim"
              className="border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              İletişim Formu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
