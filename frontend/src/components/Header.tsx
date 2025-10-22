"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import HamburgerMenu from "./HamburgerMenu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

  const categories = [
    { name: "Elbiseler", href: "/koleksiyon/elbiseler" },
    { name: "Üstler", href: "/koleksiyon/ustler" },
    { name: "Altlar", href: "/koleksiyon/altlar" },
    { name: "Dış Giyim", href: "/koleksiyon/dis-giyim" },
    { name: "Aksesuarlar", href: "/koleksiyon/aksesuarlar" },
    { name: "Yeni Gelenler", href: "/yeni-gelenler" },
    { name: "İndirim", href: "/indirim" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      {/* Top bar - Ücretsiz kargo banner */}
      <div className="bg-champagne-peach text-black text-center py-2 text-sm">
        <p>2.000 TL ve üzeri alışverişlerde ücretsiz kargo 🚚</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-champagne-100 rounded-md transition-colors"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="AURA anasayfa">
            <Image
              src="/logo-aura.svg"
              alt="AURA"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="sr-only">AURA</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-sm font-medium hover:text-champagne-contrast transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-champagne-100 rounded-md transition-colors"
              aria-label="Ara"
            >
              <FiSearch size={20} />
            </button>

            {/* User menu */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                  aria-label="Hesabım"
                >
                  <FiUser size={20} />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-md shadow-lg py-2">
                    <Link
                      href="/hesap"
                      className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Hesabım
                    </Link>
                    <Link
                      href="/siparislerim"
                      className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Siparişlerim
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-red-600"
                    >
                      <FiLogOut size={16} />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/giris"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <FiUser size={18} />
                Giriş Yap
              </Link>
            )}

            <Link
              href="/favoriler"
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Favoriler"
            >
              <FiHeart size={20} />
              {user && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length > 99 ? "99+" : favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/sepet"
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Sepet"
            >
              <FiShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-4 border-t border-border animate-in slide-in-from-top">
            <input
              type="search"
              placeholder="Ürün ara..."
              className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              autoFocus
            />
          </div>
        )}
      </div>

      <HamburgerMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}
