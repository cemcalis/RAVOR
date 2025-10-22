"use client";

import Link from "next/link";
import Image from "next/image";
import { FiX } from "react-icons/fi";

export default function HamburgerMenu({ open, onClose, categories = [] }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[rgba(251,241,238,0.95)] via-white/95 to-[rgba(247,215,200,0.95)] backdrop-blur-xl">
      <div className="container mx-auto px-6 py-8 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <Image src="/logo-aura.svg" alt="AURA" width={120} height={60} style={{ width: 'auto', height: 'auto' }} priority />
          <button onClick={onClose} className="p-2 text-champagne-contrast hover:bg-champagne-200 rounded-md transition-colors">
            <FiX size={28} />
          </button>
        </div>

        <nav className="mt-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {categories.map((c: any) => (
            <Link
              key={c.href}
              href={c.href}
              className="text-2xl font-medium text-champagne-contrast py-3 hover:text-champagne-accent transition-colors"
              onClick={onClose}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="py-6 border-t border-champagne-200">
          <div className="flex gap-4 text-champagne-contrast opacity-80">
            <a href="#" className="text-sm hover:opacity-100 hover:text-champagne-contrast transition-colors">
              İletişim
            </a>
            <a href="#" className="text-sm hover:opacity-100 hover:text-champagne-contrast transition-colors">
              Teslimat
            </a>
            <a href="#" className="text-sm hover:opacity-100 hover:text-champagne-contrast transition-colors">
              KVKK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
