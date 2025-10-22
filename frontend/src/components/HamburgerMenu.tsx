"use client";

import Link from "next/link";
import Image from "next/image";
import { FiX } from "react-icons/fi";

export default function HamburgerMenu({ open, onClose, categories = [] }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-8 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <Image src="/logo-aura.svg" alt="AURA" width={120} height={60} style={{ width: 'auto', height: 'auto' }} priority />
          <button onClick={onClose} className="p-2">
            <FiX size={28} />
          </button>
        </div>

        <nav className="mt-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {categories.map((c: any) => (
            <Link
              key={c.href}
              href={c.href}
              className="text-2xl font-medium text-foreground py-3"
              onClick={onClose}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="py-6 border-t border-border">
          <div className="flex gap-4">
            <a href="#" className="text-sm">
              İletişim
            </a>
            <a href="#" className="text-sm">
              Teslimat
            </a>
            <a href="#" className="text-sm">
              KVKK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
