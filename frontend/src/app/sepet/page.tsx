"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { user } = useAuth();
  const { items, total, loading, removeFromCart, clearCart } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Sepet yükleniyor...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-foreground/60 mb-8">
          Henüz sepetinize ürün eklemediniz.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 border border-border rounded-lg"
          >
            <div className="flex-grow">
              <h3 className="font-medium">{item.name}</h3>
              <p>Fiyat: {item.price.toLocaleString("tr-TR")} TL</p>
              <p>Adet: {item.quantity}</p>
              {item.size && <p>Beden: {item.size}</p>}
              {item.color && <p>Renk: {item.color}</p>}
            </div>
            <button
              onClick={() => removeFromCart(item.product_id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-card border border-border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Toplam:</span>
          <span className="text-xl font-bold">
            {total.toLocaleString("tr-TR")} TL
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Sepeti Boşalt
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
            Ödemeye Geç
          </button>
        </div>
      </div>
    </div>
  );
}
