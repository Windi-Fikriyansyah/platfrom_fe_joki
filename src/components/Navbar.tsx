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
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/80 backdrop-blur-xl transition-all">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary w-full" />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-base sm:text-lg group"
          >
            <span className="inline-flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              SM
            </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkripsiMate
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 mx-3 lg:mx-4">
            <div className="relative max-w-2xl group">
              <form onSubmit={(e) => {
                e.preventDefault();
                // @ts-ignore
                const val = e.target.elements.q.value;
                router.push(`/search?q=${encodeURIComponent(val)}`);
              }}>
                <Input
                  name="q"
                  placeholder="Cari layanan… (olah data, proofreading, PPT sidang)"
                  className="pr-24 text-sm border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all rounded-xl"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg lg:rounded-xl bg-primary px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Jobboard
            </Link>
            <Link
              href="/search"
              className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Layanan
            </Link>

            <Link
              href="/chat"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <MessageCircle
                className="w-5 h-5"
                strokeWidth={2}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/notifications"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Bell className="w-5 h-5" strokeWidth={2} />
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
                className="rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors"
              >
                Daftar Freelancer
              </button>
            )}

            {/* LOGIN / AKUN */}
            {authLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/5 animate-pulse" />
                <div className="h-9 w-28 rounded-xl bg-primary/5 animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold hover:bg-primary/5 transition-colors"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold shadow-sm">
                    {(userName?.trim()?.[0] || "U").toUpperCase()}
                  </span>
                  <span className="max-w-[140px] truncate">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-black/60" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header dropdown */}
                    <div className="px-4 py-3 border-b border-primary/10 bg-gradient-to-b from-primary/[0.03] to-transparent">
                      <p className="text-xs text-primary/50">Masuk sebagai</p>
                      <p className="text-sm font-semibold truncate">
                        {userName}
                      </p>

                      {userRole && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
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
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <Briefcase className="w-5 h-5 text-primary/70" />
                          <span>Dashboard Freelancer</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Settings className="w-5 h-5 text-primary/70" />
                        <span>Pengaturan</span>
                      </Link>

                      <Link
                        href="/chat"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <div className="relative">
                          <MessageCircle className="w-5 h-5 text-primary/70" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white ring-1 ring-white">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                        <span>Kotak Pesan dan Order</span>
                      </Link>

                      <Link
                        href="/notifications"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Bell className="w-5 h-5 text-primary/70" />
                        <span>Notifikasi</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <User className="w-5 h-5 text-primary/70" />
                        <span>Profil Saya</span>
                      </Link>

                      {userRole === "client" && (
                        <button
                          onClick={() => {
                            router.push("/start-selling");
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary/5 hover:text-secondary transition-colors"
                        >
                          <UserPlus className="w-5 h-5 text-secondary/70" />
                          <span>Daftar Freelancer</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-primary/10 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
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
                <Button className="cursor-pointer bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 rounded-xl px-6">
                  Sign in
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden shrink-0 flex flex-col gap-1.5 p-2 rounded-lg hover:bg-primary/5 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`w-6 h-0.5 bg-primary transition-all ${open ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-primary transition-all ${open ? "opacity-0" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-primary transition-all ${open ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-2 px-1">
          <form onSubmit={(e) => {
            e.preventDefault();
            // @ts-ignore
            const val = e.target.elements.qMobile.value;
            router.push(`/search?q=${encodeURIComponent(val)}`);
          }}>
            <div className="relative group">
              <Input
                name="qMobile"
                placeholder="Cari layanan…"
                className="pr-20 text-xs border-primary/10 focus:border-primary/40 focus:ring-primary/20 rounded-xl"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
              >
                Cari
              </button>
            </div>
          </form>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-3 animate-in slide-in-from-top-4 duration-300">
            <div className="rounded-2xl border border-primary/10 bg-white p-3 shadow-xl">
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border border-primary/5 px-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-primary/70" />
                  Dashboard
                </Link>

                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border border-primary/5 px-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors"
                >
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-primary/70" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white ring-1 ring-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  Chat
                </Link>

                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-xl border border-primary/5 px-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors"
                >
                  <Bell className="w-5 h-5 text-primary/70" />
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
                    className="h-11 rounded-xl border border-secondary/10 px-3 text-sm font-semibold hover:bg-secondary/5 text-secondary flex items-center gap-3 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Daftar Freelancer
                  </button>
                )}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 transition-all active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="h-11 rounded-xl border border-primary/10 px-3 text-sm font-semibold hover:bg-primary/5 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-5 h-5 text-primary/70" />
                      Masuk
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="h-11 rounded-xl bg-gradient-to-r from-primary to-secondary text-white px-3 text-sm font-semibold hover:opacity-90 flex items-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
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
