"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import {
  Bell,
  MessageCircle,
  LayoutDashboard,
  Briefcase,
  Grid3X3,
  User,
  UserPlus,
  LogOut,
  ChevronDown,
  Settings,
  Store,
} from "lucide-react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [open, setOpen] = useState(false); // mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // account dropdown
  const accountRef = useRef<HTMLDivElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);

    const ac = new AbortController();

    const syncAuth = async () => {
      setAuthLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
          credentials: "include",
          cache: "no-store",
          signal: ac.signal,
        });

        // kalau 401/403 anggap guest (hindari json error)
        if (res.status === 401 || res.status === 403) {
          setIsLoggedIn(false);
          setUserName("");
          setUserRole(null);
          return;
        }

        const data = await res.json().catch(() => null);

        if (data?.success) {
          setIsLoggedIn(true);
          setUserName(data.data?.name ?? "");
          setUserRole((data.data?.role ?? "").toLowerCase() || null);
          setUnreadCount(data.data?.unread_count ?? 0);
        } else {
          setIsLoggedIn(false);
          setUserName("");
          setUserRole(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserName("");
        setUserRole(null);
      } finally {
        setAuthLoading(false);
      }
    };

    syncAuth();
    return () => ac.abort();
  }, []);

  // Sync unread count from custom event (from useChat.ts)
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (typeof e.detail === "number") {
        setUnreadCount(e.detail);
      }
    };
    window.addEventListener("chat-unread-count-update", handleUpdate);
    return () =>
      window.removeEventListener("chat-unread-count-update", handleUpdate);
  }, []);

  // Periodic refresh for unread count (every 60s)
  useEffect(() => {
    if (!isLoggedIn || authLoading) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/unread-count`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.data);
        }
      } catch (err) {
        console.error("Failed to refresh unread count:", err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn, authLoading]);

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
    } catch { }

    setIsLoggedIn(false);
    setUserName("");
    setAccountOpen(false);
    setOpen(false);

    showToast("Berhasil keluar", "success");
    router.push("/");
  }

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
            <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Jobboard
            </Link>
            <Link
              href="/search"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
            >
              Layanan
            </Link>

            <Link
              href="/chat"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
            >
              <MessageCircle
                className="w-6 h-6 text-foreground"
                strokeWidth={2}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/notifications"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5"
            >
              <Bell className="w-6 h-6 text-foreground" strokeWidth={2} />
            </Link>

            {userRole === "client" && (
              <button
                onClick={() => {
                  if (isLoggedIn) router.push("/start-selling");
                  else
                    router.push(
                      `/auth/login?next=${encodeURIComponent("/start-selling")}`
                    );
                }}
                className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
              >
                Daftar Freelancer
              </button>
            )}

            {/* LOGIN / AKUN */}
            {/* LOGIN / AKUN */}
            {authLoading ? (
              // Skeleton biar gak “kedip” Sign in
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-black/5 animate-pulse" />
                <div className="h-9 w-28 rounded-xl bg-black/5 animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-black/5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                    {(userName?.trim()?.[0] || "U").toUpperCase()}
                  </span>
                  <span className="max-w-[140px] truncate">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-black/60" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border bg-white shadow-xl">
                    {/* Header dropdown */}
                    <div className="px-4 py-3 border-b bg-gradient-to-b from-black/[0.02] to-transparent">
                      <p className="text-xs text-black/50">Masuk sebagai</p>
                      <p className="text-sm font-semibold truncate">
                        {userName}
                      </p>

                      {userRole && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold text-black/70">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/60" />
                          {userRole}
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="p-2">
                      {userRole === "freelancer" && (
                        <Link
                          href="/freelancer/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                        >
                          <Briefcase className="w-5 h-5 text-black/70" />
                          <span>Dashboard Freelancer</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                      >
                        <Settings className="w-5 h-5 text-black/70" />
                        <span>Pengaturan</span>
                      </Link>

                      <Link
                        href="/chat"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                      >
                        <div className="relative">
                          <MessageCircle className="w-5 h-5 text-black/70" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-white">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                        <span>Kotak Pesan dan Order</span>
                      </Link>

                      <Link
                        href="/notifications"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                      >
                        <Bell className="w-5 h-5 text-black/70" />
                        <span>Notifikasi</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                      >
                        <User className="w-5 h-5 text-black/70" />
                        <span>Profil Saya</span>
                      </Link>

                      {/* Biar gak kedip juga, hanya tampil setelah authLoading=false (sudah) */}
                      {userRole === "client" && (
                        <button
                          onClick={() => {
                            router.push("/start-selling");
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                        >
                          <UserPlus className="w-5 h-5 text-black/70" />
                          <span>Daftar Freelancer</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
                      >
                        <LogOut className="w-5 h-5" />
                        Keluar
                      </button>
                    </div>
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
              className={`w-6 h-0.5 bg-black transition-all ${open ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${open ? "opacity-0" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${open ? "-rotate-45 -translate-y-2" : ""
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

        {/* Mobile dropdown (dibesarkan + icon + nama) */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-3">
            <div className="rounded-2xl border bg-white p-3">
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border px-3 text-sm font-semibold hover:bg-black/5 flex items-center gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 text-black/70" />
                  Dashboard
                </Link>

                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border px-3 text-sm font-semibold hover:bg-black/5 flex items-center gap-3"
                >
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-black/70" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  Chat
                </Link>

                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border px-3 text-sm font-semibold hover:bg-black/5 flex items-center gap-3"
                >
                  <Bell className="w-5 h-5 text-black/70" />
                  Notifikasi
                </Link>

                {!authLoading && userRole === "client" && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      if (isLoggedIn) router.push("/start-selling");
                      else
                        router.push(
                          `/auth/login?next=${encodeURIComponent(
                            "/start-selling"
                          )}`
                        );
                    }}
                    className="h-11 rounded-xl border px-3 text-sm font-semibold hover:bg-black/5 flex items-center gap-3"
                  >
                    <UserPlus className="w-5 h-5 text-black/70" />
                    Daftar Freelancer
                  </button>
                )}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="h-11 rounded-xl border px-3 text-sm font-semibold hover:bg-black/5 flex items-center gap-3"
                    >
                      <User className="w-5 h-5 text-black/70" />
                      Masuk
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="h-11 rounded-xl bg-black text-white px-3 text-sm font-semibold hover:bg-black/90 flex items-center gap-3"
                    >
                      <UserPlus className="w-5 h-5 text-white/90" />
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
