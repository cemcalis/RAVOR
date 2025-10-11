import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] bg-muted overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Yeni Sezon
            <br />
            Koleksiyonu
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Zamansız tasarımlar, minimal şıklık. Her parça özenle seçildi.
          </p>
          <div className="flex gap-4">
            <Link
              href="/koleksiyon/elbiseler"
              className="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              Koleksiyonu Keşfet
            </Link>
            <Link
              href="/yeni-gelenler"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Yeni Gelenler
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
