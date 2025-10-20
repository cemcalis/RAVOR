'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart } from 'lucide-react';

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
  id,
  name,
  slug,
  price,
  compare_price,
  image_url,
  stock_status,
  is_new,
}: ProductCardProps) {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const discount = compare_price
    ? Math.round(((compare_price - price) / compare_price) * 100)
    : 0;

  const isProductFavorite = isFavorite(id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      window.location.href = '/giris';
      return;
    }

    setIsAddingToFavorites(true);

    try {
      if (isProductFavorite) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div className="group relative">
      <Link href={`/urun/${slug}`} className="block">
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

          {/* Favori butonu */}
          <button
            onClick={handleFavoriteClick}
            disabled={isAddingToFavorites}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isProductFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            } ${isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              size={16}
              className={`transition-all duration-200 ${
                isProductFavorite ? 'fill-current' : ''
              }`}
            />
          </button>
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
    </div>
  );
}
