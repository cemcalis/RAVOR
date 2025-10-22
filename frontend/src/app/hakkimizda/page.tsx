import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Hakkımızda</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
              alt="AURA Store"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">AURA</h2>
            <p className="text-foreground/70 mb-4 leading-relaxed">
              2025 yılında kurulan AURA, zamansız tasarımlar ve sürdürülebilir
              moda anlayışıyla kadınların gardıroplarına değer katan parçalar
              sunuyor.
            </p>
            <p className="text-foreground/70 mb-4 leading-relaxed">
              Her koleksiyonumuz, minimal estetiği modern kesimlerle
              birleştirerek günlük hayatın her anında rahatlıkla giyebileceğiniz
              şık parçalar yaratıyor.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Kaliteli kumaşlar, özenli işçilik ve zamansız tasarımlarla,
              trendlerin ötesinde bir stil anlayışı sunuyoruz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-muted rounded-lg">
            <div className="text-4xl font-bold text-secondary mb-2">100+</div>
            <p className="text-foreground/60">Benzersiz Tasarım</p>
          </div>
          <div className="text-center p-6 bg-muted rounded-lg">
            <div className="text-4xl font-bold text-secondary mb-2">5000+</div>
            <p className="text-foreground/60">Mutlu Müşteri</p>
          </div>
          <div className="text-center p-6 bg-muted rounded-lg">
            <div className="text-4xl font-bold text-secondary mb-2">%100</div>
            <p className="text-foreground/60">Müşteri Memnuniyeti</p>
          </div>
        </div>

        <div className="bg-accent/20 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Değerlerimiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🌿 Sürdürülebilirlik</h4>
              <p className="text-sm text-foreground/70">
                Çevre dostu üretim süreçleri ve kaliteli malzemelerle uzun
                ömürlü ürünler.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✨ Kalite</h4>
              <p className="text-sm text-foreground/70">
                Her detayda mükemmellik arayışı ve titiz işçilik.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎨 Tasarım</h4>
              <p className="text-sm text-foreground/70">
                Zamansız, minimal ve şık tasarımlar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💝 Müşteri Odaklılık</h4>
              <p className="text-sm text-foreground/70">
                Mükemmel alışveriş deneyimi ve müşteri memnuniyeti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
