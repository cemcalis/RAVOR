import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  image_url: string;
  stock_status: string;
  is_new?: boolean;
}

export default function ProductCard({
  name,
  slug,
  price,
  compare_price,
  image_url,
  stock_status,
  is_new,
}: ProductCardProps) {
  const discount = compare_price
    ? Math.round(((compare_price - price) / compare_price) * 100)
    : 0;

  return (
    <Link href={`/urun/${slug}`} className="group">
      <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-lg mb-3">
        <Image
          src={image_url}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {is_new && (
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
              YENİ
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              %{discount}
            </span>
          )}
          {stock_status === 'out_of_stock' && (
            <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              TÜKENDİ
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-1 group-hover:text-secondary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{price.toLocaleString('tr-TR')} TL</span>
          {compare_price && (
            <span className="text-sm text-foreground/50 line-through">
              {compare_price.toLocaleString('tr-TR')} TL
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
