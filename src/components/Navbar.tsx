"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-base sm:text-lg"
          >
            <span className="inline-flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-black text-white text-xs sm:text-sm font-bold">
              SM
            </span>
            SkripsiMate
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 mx-3 lg:mx-4">
            <div className="relative max-w-2xl">
              <Input
                placeholder="Cari layanan… (olah data, proofreading, PPT sidang)"
                className="pr-24 text-sm"
              />
              <Link
                href="/search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg lg:rounded-xl bg-black px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-white"
              >
                Cari
              </Link>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Dashboard
            </Link>
            <Link
              href="/chat/1"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Chat
            </Link>
            <Link href="/auth/login" asChild>
              <Button>Masuk</Button>
            </Link>
          </nav>

          {/* Mobile menu toggle - Hamburger Icon */}
          <button
            className="md:hidden shrink-0 flex flex-col gap-1.5"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* ✅ Mobile Search (SELALU tampil di mobile) */}
        <div className="md:hidden pb-2">
          <div className="relative">
            <Input
              placeholder="Cari layanan…"
              className="pr-20 text-xs"
            />
            <Link
              href="/search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-black px-2 py-1.5 text-xs font-semibold text-white"
            >
              Cari
            </Link>
          </div>
        </div>

        {/* Category chips (scrollable) */}
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 pb-2 sm:pb-3">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/search?cat=${encodeURIComponent(c)}`}
                className="shrink-0 rounded-full border px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-black/70 hover:bg-black/5"
              >
                {c}
              </Link>
            ))}
          </div>
          {/* scroll hint */}
          <div className="mt-1 text-[10px] sm:text-[11px] text-black/45 md:hidden">
            Geser untuk lihat kategori lainnya →
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-3">
            <div className="rounded-xl sm:rounded-2xl border bg-white p-2 sm:p-3">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="h-9 sm:h-11 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-sm font-semibold hover:bg-black/5"
                >
                  Dashboard
                </Link>
                <Link
                  href="/chat/1"
                  onClick={() => setOpen(false)}
                  className="h-9 sm:h-11 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-sm font-semibold hover:bg-black/5"
                >
                  Chat
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="col-span-2 h-9 sm:h-11 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-sm font-semibold hover:bg-black/5"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="col-span-2 h-9 sm:h-11 bg-black rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-semibold text-white hover:bg-black/80"
                >
                  Daftar
                </Link>
              </div>

              <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-black/50 leading-relaxed">
                Layanan fokus pendampingan & perbaikan naskah milikmu (bukan
                pembuatan tugas untuk diserahkan sebagai karya sendiri).
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
