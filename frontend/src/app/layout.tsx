import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AURA - Zamansız Tasarımlar",
  description: "Minimal ve şık kadın giyim koleksiyonu. Elbise, üst, alt giyim ve aksesuarlar. Premium kalite, ücretsiz kargo.",
  keywords: "kadın giyim, elbise, moda, alışveriş, online alışveriş, tasarım",
  authors: [{ name: "AURA" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body className="font-body antialiased bg-background text-foreground">
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
