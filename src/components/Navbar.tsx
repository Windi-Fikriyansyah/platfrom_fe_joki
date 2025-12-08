"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import { Bell, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false); // FIX utama anti-flash
  const [open, setOpen] = useState(false); // mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // account dropdown
  const accountRef = useRef<HTMLDivElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);

    const syncAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.success) {
          setIsLoggedIn(true);
          setUserName(data.data.name);
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    syncAuth();
  }, []);

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!accountOpen) return;
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountOpen]);

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setIsLoggedIn(false);
    setUserName("");
    setAccountOpen(false);
    setOpen(false);

    showToast("Berhasil keluar", "success");
    router.push("/");
  }

  // 🚀 FIX HYDRATION: Tahan render auth sampai mounted = true
  if (!mounted) {
    return <header className="h-14 sm:h-16 bg-white border-b" />;
  }

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
            {/* <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Dashboard
            </Link> */}
            <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Jobboard
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Layanan
            </Link>
            <Link
              href="/chat/1"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
            >
              <MessageCircle
                className="w-6 h-6 text-foreground"
                strokeWidth={2}
              />
            </Link>

            <Link
              href="/notifications"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
            >
              <Bell className="w-6 h-6 text-foreground" strokeWidth={2} />
            </Link>
            <Link
              href="/freelancer/register"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Daftar Freelancer
            </Link>

            {/* LOGIN / AKUN */}
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                    {(userName?.trim()?.[0] || "U").toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{userName}</span>
                  <span className="text-black/60">▾</span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg">
                    <div className="px-3 py-2 border-b">
                      <p className="text-xs text-black/50">Masuk sebagai</p>
                      <p className="text-sm font-semibold truncate">
                        {userName}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-sm hover:bg-black/5"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>

                    <Link
                      href="/freelancer/register"
                      className="block px-3 py-2 text-sm hover:bg-black/5"
                    >
                      Daftar Freelancer
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                  Sign in
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden shrink-0 flex flex-col gap-1.5"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-2">
          <div className="relative">
            <Input placeholder="Cari layanan…" className="pr-20 text-xs" />
            <Link
              href="/search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-black px-2 py-1.5 text-xs font-semibold text-white"
            >
              Cari
            </Link>
          </div>
        </div>

        {/* Category Chips */}
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 pb-2 sm:pb-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
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
          <div className="mt-1 text-[10px] sm:text-[11px] text-black/45 md:hidden">
            Geser untuk lihat kategori lainnya →
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-3">
            <div className="rounded-xl border bg-white p-2 sm:p-3">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="btn-mobile"
                >
                  Dashboard
                </Link>
                <Link
                  href="/chat/1"
                  onClick={() => setOpen(false)}
                  className="btn-mobile"
                >
                  Chat
                </Link>

                <Link
                  href="/freelancer/register"
                  onClick={() => setOpen(false)}
                  className="col-span-2 btn-mobile"
                >
                  Daftar Freelancer
                </Link>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="col-span-2 h-9 sm:h-11 rounded-lg bg-red-600 text-white text-xs sm:text-sm font-semibold hover:bg-red-700"
                  >
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="btn-mobile col-span-2"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="btn-mobile col-span-2 bg-black text-white"
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
