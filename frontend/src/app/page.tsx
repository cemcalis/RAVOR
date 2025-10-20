import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import Image from "next/image";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Minimal hero with centered logo on champagne background */}
      <div className="w-full py-24" style={{ backgroundColor: "#F2CDBF" }}>
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/logo-ravor.png"
            alt="Ravor"
            width={240}
            height={120}
            className="mx-auto"
          />
        </div>
      </div>

      <Section title="Koleksiyonlar" className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/koleksiyon/elbiseler"
            className="group relative h-72 overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
              alt="Elbiseler"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">Elbiseler</h3>
            </div>
          </Link>

          <Link
            href="/koleksiyon/ustler"
            className="group relative h-72 overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800"
              alt="Üstler"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">Üstler</h3>
            </div>
          </Link>

          <Link
            href="/koleksiyon/aksesuarlar"
            className="group relative h-72 overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
              alt="Aksesuarlar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">Aksesuarlar</h3>
            </div>
          </Link>
        </div>
      </Section>

      <ProductGrid title="Yeni Gelenler" filter="new" limit={8} />

      <Newsletter />
      {/* Footer */}
      <Footer />
    </>
  );
}
