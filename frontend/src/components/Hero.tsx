import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] bg-champagne-100 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
        alt="Hero"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(31,20,17,0.7)] via-[rgba(139,94,75,0.6)] to-transparent" />

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-xl text-champagne-100">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-xl">
            Yeni Sezon
            <br />
            Koleksiyonu
          </h1>
          <p className="text-lg md:text-xl mb-8 text-champagne-100 opacity-90">
            Zamansız tasarımlar, minimal şıklık. Her parça özenle seçildi.
          </p>
          <div className="flex gap-4">
            <Link
              href="/koleksiyon/elbiseler"
              className="bg-champagne-peach text-champagne-contrast px-8 py-3 rounded-full font-medium shadow-[0_12px_30px_rgba(31,20,17,0.18)] hover:bg-champagne-200 transition-colors"
            >
              Koleksiyonu Keşfet
            </Link>
            <Link
              href="/yeni-gelenler"
              className="border-2 border-champagne-peach text-champagne-100 px-8 py-3 rounded-full font-medium hover:bg-[rgba(242,205,191,0.1)] transition-colors"
            >
              Yeni Gelenler
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
