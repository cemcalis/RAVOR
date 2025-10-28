"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Heart } from "lucide-react";

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
      window.location.href = "/giris";
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
      console.error("Favori işlemi başarısız:", error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const [imageError, setImageError] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visibleAnimated, setVisibleAnimated] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleAnimated(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`group relative ${
        visibleAnimated ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <Link href={`/urun/${slug}`} className="block">
        <div className="relative aspect-[3/4] bg-champagne-100 overflow-hidden rounded-xl mb-3 shadow-sm">
          {!imageError ? (
            <Image
              src={image_url}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-champagne-100 to-champagne-200 flex items-center justify-center">
              <div className="text-center text-foreground/50">
                <div className="text-4xl mb-2">👗</div>
                <div className="text-sm font-medium">Loading Image</div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {is_new && (
              <span className="bg-primary text-champagne-100 text-xs px-3 py-1 rounded-full font-medium shadow">
                YENİ
              </span>
            )}
            {discount > 0 && (
              <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium shadow">
                %{discount}
              </span>
            )}
            {stock_status === "out_of_stock" && (
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
                ? "bg-secondary text-white hover:bg-secondary/80"
                : "bg-[rgba(251,241,238,0.70)] text-champagne-contrast hover:bg-champagne-peach hover:text-champagne-contrast"
            } ${isAddingToFavorites ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart
              size={16}
              className={`transition-all duration-200 ${
                isProductFavorite ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        <div className="px-1">
          <h3 className="font-medium mb-1 text-champagne-contrast group-hover:text-secondary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-champagne-contrast">
              {price.toLocaleString("tr-TR")} TL
            </span>
            {compare_price && (
              <span className="text-sm text-champagne-contrast opacity-60 line-through">
                {compare_price.toLocaleString("tr-TR")} TL
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
