"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { api } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  image_url: string;
  images: string[];
  stock_status: string;
  category_name: string;
  category_slug: string;
  variants?: {
    id: number;
    size: string;
    color?: string;
    stock: number;
  }[];
}

interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
}

interface ReviewData {
  reviews: Review[];
  product: {
    name: string;
    slug: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  averageRating: number;
  totalReviews: number;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<ReviewData | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await api.getProduct(slug);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedSize(data.variants[0].size);
      }
      setLoading(false);
    } catch (error) {
      console.error("Ürün yüklenirken hata:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-8 bg-muted rounded mb-4 w-3/4" />
            <div className="h-6 bg-muted rounded mb-4 w-1/4" />
            <div className="h-24 bg-muted rounded mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Ürün bulunamadı</h1>
        <Link href="/" className="text-secondary hover:underline">
          Anasayfaya dön
        </Link>
      </div>
    );
  }

  const router = useRouter();

  const handleAddToCart = async () => {
    // Require user to be logged in before adding to cart
    if (!user) {
      // Redirect to registration page (per request)
      router.push(`/kayit?redirect=/urun/${product.slug}`);
      return;
    }

    try {
      // Use session-based cart API if you have sessionId available.
      // For now we just call the api layer if session logic exists.
      const sessionId = localStorage.getItem("sessionId") || "guest";
      await api.addToCart(sessionId, {
        product_id: product.id,
        quantity,
        size: selectedSize,
      });

      // Simple feedback for now
      alert("Ürün sepete eklendi");
    } catch (err) {
      console.error("Sepete eklenirken hata:", err);
      alert("Sepete eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  const discount = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100
      )
    : 0;

  const allImages =
    product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 text-foreground/60">
        <Link href="/" className="hover:text-foreground">
          Anasayfa
        </Link>
        <span>/</span>
        <Link
          href={`/koleksiyon/${product.category_slug}`}
          className="hover:text-foreground"
        >
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                %{discount} İNDİRİM
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">
              {product.price.toLocaleString("tr-TR")} TL
            </span>
            {product.compare_price && (
              <span className="text-xl text-foreground/50 line-through">
                {product.compare_price.toLocaleString("tr-TR")} TL
              </span>
            )}
          </div>

          <p className="text-foreground/70 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-3">Beden Seçin</label>
              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size)}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === variant.size
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    } ${
                      variant.stock === 0 ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Adet</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-border rounded-md hover:bg-muted transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-border rounded-md hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status === "out_of_stock"}
              className="flex-1 bg-primary text-white px-6 py-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiShoppingBag />
              {product.stock_status === "out_of_stock"
                ? "Stokta Yok"
                : "Sepete Ekle"}
            </button>
            <button className="w-14 h-14 border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center">
              <FiHeart size={20} />
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-border pt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Kategori:</span>
              <Link
                href={`/koleksiyon/${product.category_slug}`}
                className="font-medium hover:text-secondary"
              >
                {product.category_name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Stok Durumu:</span>
              <span
                className={
                  product.stock_status === "in_stock"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {product.stock_status === "in_stock" ? "Stokta" : "Tükendi"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Kargo:</span>
              <span className="font-medium">2-3 iş günü</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
