'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  size: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Demo sepet - gerçek uygulamada context/state management kullanılır
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Minimal Siyah Elbise',
      slug: 'minimal-siyah-elbise',
      price: 1250,
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      size: 'M',
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 49.90;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      router.push('/giris?redirect=/sepet');
    } else {
      router.push('/odeme');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiShoppingBag size={64} className="mx-auto mb-4 text-foreground/30" />
        <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-foreground/60 mb-8">
          Henüz sepetinize ürün eklemediniz.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <Link href={`/urun/${item.slug}`} className="relative w-24 h-32 flex-shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </Link>

                <div className="flex-1">
                  <Link href={`/urun/${item.slug}`} className="font-medium hover:text-secondary">
                    {item.name}
                  </Link>
                  <p className="text-sm text-foreground/60 mt-1">Beden: {item.size}</p>
                  <p className="font-semibold mt-2">{item.price.toLocaleString('tr-TR')} TL</p>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-2 border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                      aria-label="Ürünü kaldır"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Ara Toplam</span>
                <span className="font-medium">{subtotal.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Kargo</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Ücretsiz</span>
                  ) : (
                    `${shipping.toLocaleString('tr-TR')} TL`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Toplam</span>
              <span>{total.toLocaleString('tr-TR')} TL</span>
            </div>

            {subtotal < 2000 && (
              <p className="text-sm text-foreground/60 mb-4 p-3 bg-accent/20 rounded-md">
                🚚 {(2000 - subtotal).toLocaleString('tr-TR')} TL daha alışveriş yapın, 
                kargo ücretsiz olsun!
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="block w-full bg-primary text-white text-center px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors mb-3"
            >
              {user ? 'Ödemeye Geç' : 'Giriş Yapın'}
            </button>
            
            {!user && (
              <p className="text-xs text-center text-foreground/60 mb-3">
                Ödeme yapmak için giriş yapmanız gerekmektedir
              </p>
            )}

            <Link
              href="/"
              className="block w-full text-center px-6 py-3 rounded-md font-medium border border-border hover:bg-muted transition-colors"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
