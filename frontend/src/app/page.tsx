import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Newsletter from '@/components/Newsletter';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Hero />

      {/* Öne Çıkan Ürünler */}
      <ProductGrid title="Öne Çıkanlar" filter="featured" limit={8} />

      {/* Kategori Showcase */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Koleksiyonlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/koleksiyon/elbiseler" className="group relative h-96 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
                alt="Elbiseler"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">Elbiseler</h3>
              </div>
            </Link>

            <Link href="/koleksiyon/ustler" className="group relative h-96 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800"
                alt="Üstler"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">Üstler</h3>
              </div>
            </Link>

            <Link href="/koleksiyon/aksesuarlar" className="group relative h-96 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
                alt="Aksesuarlar"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">Aksesuarlar</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Yeni Gelenler */}
      <ProductGrid title="Yeni Gelenler" filter="new" limit={8} />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
