import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import Image from "next/image";
import Section from "@/components/Section";

const collections = [
  {
    title: "Elbiseler",
    href: "/koleksiyon/elbiseler",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
  },
  {
    title: "Üstler",
    href: "/koleksiyon/ustler",
    image: "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800",
  },
  {
    title: "Aksesuarlar",
    href: "/koleksiyon/aksesuarlar",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <Section title="Koleksiyonlar" className="bg-white/60 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group relative h-72 overflow-hidden rounded-xl shadow-sm"
            >
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={collection.href === collections[0].href}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,20,17,0.6)] via-transparent to-transparent transition-colors group-hover:from-[rgba(31,20,17,0.7)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-semibold text-champagne-100 drop-shadow-lg">{collection.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <ProductGrid title="Yeni Gelenler" filter="new" limit={8} />

      <Newsletter />
    </>
  );
}
