import Link from 'next/link';
import { FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marka */}
          <div>
            <h3 className="text-xl font-bold mb-4">AURA</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Zamansız tasarımlar, sürdürülebilir moda. Her parça özenle seçilmiş, 
              stilinize değer katan koleksiyonlar.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="mailto:info@aura.com"
                className="p-2 hover:bg-white rounded-full transition-colors"
                aria-label="E-posta"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Alışveriş */}
          <div>
            <h4 className="font-semibold mb-4">Alışveriş</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/koleksiyon/elbiseler" className="hover:text-secondary transition-colors">
                  Elbiseler
                </Link>
              </li>
              <li>
                <Link href="/koleksiyon/ustler" className="hover:text-secondary transition-colors">
                  Üstler
                </Link>
              </li>
              <li>
                <Link href="/koleksiyon/altlar" className="hover:text-secondary transition-colors">
                  Altlar
                </Link>
              </li>
              <li>
                <Link href="/yeni-gelenler" className="hover:text-secondary transition-colors">
                  Yeni Gelenler
                </Link>
              </li>
              <li>
                <Link href="/indirim" className="hover:text-secondary transition-colors">
                  İndirim
                </Link>
              </li>
            </ul>
          </div>

          {/* Bilgi */}
          <div>
            <h4 className="font-semibold mb-4">Bilgi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hakkimizda" className="hover:text-secondary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-secondary transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kargo-iade" className="hover:text-secondary transition-colors">
                  Kargo & İade
                </Link>
              </li>
              <li>
                <Link href="/gizlilik" className="hover:text-secondary transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="hover:text-secondary transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Bülten</h4>
            <p className="text-sm text-foreground/70 mb-4">
              Yeni koleksiyonlar ve özel fırsatlardan haberdar olun.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} AURA. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
