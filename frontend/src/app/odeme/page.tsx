'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLoading && !user) {
      router.push('/giris?redirect=/odeme');
    }

    // Kullanıcı bilgilerini form'a doldur
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Demo sepet - gerçek uygulamada context'ten gelecek
      const cartItems = [
        {
          product_id: 1,
          variant_id: null,
          quantity: 1,
          price: 1250,
        },
      ];

      const data = await api.createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        items: cartItems,
        total: 1299.90,
      });
      router.push(`/siparis-basarili?order_id=${data.order_id}`);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect edilecek
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Teslimat Bilgileri</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Teslimat Adresi *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Ödeme Yöntemi</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="payment" value="card" defaultChecked />
                  <span className="font-medium">Kredi/Banka Kartı</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="payment" value="transfer" />
                  <span className="font-medium">Havale/EFT</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="payment" value="door" />
                  <span className="font-medium">Kapıda Ödeme</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Ara Toplam</span>
                <span className="font-medium">1.250,00 TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Kargo</span>
                <span className="font-medium">49,90 TL</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Toplam</span>
              <span>1.299,90 TL</span>
            </div>

            <Link
              href="/sepet"
              className="block w-full text-center px-6 py-3 rounded-md font-medium border border-border hover:bg-muted transition-colors"
            >
              Sepete Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
