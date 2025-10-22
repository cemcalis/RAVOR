import Link from "next/link";
import { FiInstagram, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-champagne-contrast via-[#2b1e19] to-[#1a110f] text-champagne-100 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marka */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-champagne-peach">
              AURA
            </h3>
            <p className="text-sm text-[rgba(255,240,232,0.85)] leading-relaxed">
              Zamansız tasarımlar, sürdürülebilir moda. Her parça özenle
              seçilmiş, stilinize değer katan koleksiyonlar.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="mailto:info@aura.com"
                className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
                aria-label="E-posta"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Alışveriş */}
          <div>
            <h4 className="font-semibold mb-4 text-champagne-peach">
              Alışveriş
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/koleksiyon/elbiseler"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Elbiseler
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksiyon/ustler"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Üstler
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksiyon/altlar"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Altlar
                </Link>
              </li>
              <li>
                <Link
                  href="/yeni-gelenler"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Yeni Gelenler
                </Link>
              </li>
              <li>
                <Link
                  href="/indirim"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  İndirim
                </Link>
              </li>
            </ul>
          </div>

          {/* Bilgi */}
          <div>
            <h4 className="font-semibold mb-4 text-champagne-peach">
              Bilgi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link
                  href="/kargo-iade"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Kargo & İade
                </Link>
              </li>
              <li>
                <Link
                  href="/gizlilik"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/kullanim-kosullari"
                  className="text-[rgba(255,240,232,0.85)] hover:text-accent transition-colors"
                >
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-champagne-peach">
              Bülten
            </h4>
            <p className="text-sm text-[rgba(255,240,232,0.85)] mb-4">
              Yeni koleksiyonlar ve özel fırsatlardan haberdar olun.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="px-4 py-2 border border-[rgba(239,214,203,0.5)] bg-white/10 text-champagne-100 placeholder:text-[rgba(255,240,232,0.6)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(242,205,191,0.6)] text-sm"
              />
              <button
                type="submit"
                className="bg-accent text-champagne-contrast px-4 py-2 rounded-md hover:bg-champagne-200 transition-colors text-sm font-medium"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-[rgba(255,240,232,0.6)]">
          <p>&copy; {new Date().getFullYear()} AURA. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
