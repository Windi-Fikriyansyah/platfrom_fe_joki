"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import {
  Bell,
  MessageCircle,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  Wallet,
  Briefcase,
  ArrowLeft,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

function isActive(pathname: string, href: string) {
  if (href === "/freelancer/dashboard") {
    return pathname === "/freelancer" || pathname === "/freelancer/dashboard";
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export default function FreelancerNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        href: "/freelancer/dashboard",
        label: "Ringkasan",
        icon: LayoutDashboard,
      },
      { href: "/freelancer/orders", label: "Orders", icon: ClipboardList },
      {
        href: "/freelancer/dashboard/product",
        label: "Layanan Saya",
        icon: Briefcase,
      },
      { href: "/freelancer/earnings", label: "Pendapatan", icon: Wallet },
      { href: "/freelancer/settings", label: "Pengaturan", icon: Settings },
    ],
    []
  );

  const toastRef = useRef(showToast);
  useEffect(() => {
    toastRef.current = showToast;
  }, [showToast]);
  useEffect(() => {
    setMounted(true);

    const ac = new AbortController();

    const syncAuth = async () => {
      setAuthLoading(true);

      try {
        const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const res = await fetch(`${api}/me`, {
          credentials: "include",
          cache: "no-store",
          signal: ac.signal,
        });

        if (ac.signal.aborted) return;

        if (res.status === 401 || res.status === 403) {
          setIsLoggedIn(false);
          setUserName("");
          setUserRole(null);
          return;
        }

        const data = await res.json().catch(() => null);
        if (ac.signal.aborted) return;

        if (data?.success) {
          const role = String(data.data?.role ?? "").toLowerCase();

          setIsLoggedIn(true);
          setUserName(data.data?.name ?? "");
          setUserRole(role || null);

          if (role !== "freelancer") {
            toastRef.current?.(
              "Akses ditolak. Halaman ini khusus freelancer.",
              "error"
            );
            router.replace("/");
            return;
          }
        } else {
          setIsLoggedIn(false);
          setUserName("");
          setUserRole(null);
        }
      } catch (err: any) {
        if (ac.signal.aborted || err?.name === "AbortError") return;

        setIsLoggedIn(false);
        setUserName("");
        setUserRole(null);
      } finally {
        if (ac.signal.aborted) return;
        setAuthLoading(false);
      }
    };

    syncAuth();
    return () => ac.abort();

    // penting: jangan depend ke showToast (biar gak rerun terus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // auto close sidebar on route change (mobile)
    setSidebarOpen(false);
    setAccountOpen(false);
  }, [pathname]);

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
    setUserRole(null);
    setAccountOpen(false);
    showToast("Berhasil keluar", "success");
    router.push("/");
  }

  const SidebarContent = (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="px-4 py-4 border-b">
        <Link href="/freelancer/dashboard" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white text-xs font-bold">
            SM
          </span>
          <div className="min-w-0">
            <div className="text-sm font-extrabold leading-tight truncate">
              Freelancer
            </div>
            <div className="text-[11px] text-black/50 leading-tight truncate">
              Kelola layanan & order
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <div className="p-2">
        {navItems.map((it) => {
          const active = isActive(pathname, it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-black text-white"
                  : "hover:bg-black/5 text-black/80",
              ].join(" ")}
            >
              <Icon
                className={
                  active ? "w-5 h-5 text-white" : "w-5 h-5 text-black/60"
                }
              />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5 text-black/80"
        >
          <ArrowLeft className="w-5 h-5 text-black/60" />
          <span>Kembali ke Marketplace</span>
        </Link>
      </div>
    </div>
  );

  if (!mounted) {
    return <div className="min-h-screen bg-[#fafafa]" />;
  }

  const hideSidebar =
    pathname.startsWith("/freelancer/dashboard/product/basic") ||
    (pathname.startsWith("/freelancer/dashboard/product/") &&
      pathname.endsWith("/edit"));

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        {!hideSidebar && (
          <aside className="hidden lg:block w-72 shrink-0 border-r bg-white sticky top-0 h-screen">
            {SidebarContent}
          </aside>
        )}

        {/* Mobile drawer */}
        {sidebarOpen && !hideSidebar && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[86%] max-w-xs bg-white border-r shadow-xl">
              <div className="h-16 flex items-center justify-between px-4 border-b">
                <div className="text-sm font-extrabold">Menu</div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="h-10 w-10 rounded-xl hover:bg-black/5 flex items-center justify-center"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5 text-black/70" />
                </button>
              </div>
              <div className="h-[calc(100%-64px)]">{SidebarContent}</div>
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
            <div className="h-16 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
              {/* Left */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden h-10 w-10 rounded-xl hover:bg-black/5 flex items-center justify-center"
                  aria-label="Buka menu"
                >
                  <Menu className="w-5 h-5 text-black/70" />
                </button>

                <Link
                  href="/freelancer/dashboard"
                  className="flex items-center gap-2 min-w-0"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white text-xs font-bold lg:hidden">
                    SM
                  </span>
                </Link>
              </div>

              {/* Search (desktop) */}
              <div className="hidden md:block flex-1 px-4"></div>

              {/* Right actions */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Link
                  href="/freelancer/product/new"
                  className="hidden sm:inline-flex"
                >
                  <Button className="rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Layanan
                  </Button>
                </Link>

                {/* Account dropdown (desktop) */}
                {mounted && authLoading ? (
                  // Skeleton biar Sign in gak pernah “kedip”
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-black/5 animate-pulse" />
                    <div className="h-10 w-28 rounded-xl bg-black/5 animate-pulse hidden sm:block" />
                  </div>
                ) : isLoggedIn ? (
                  <div className="relative" ref={accountRef}>
                    <button
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-black/5"
                      aria-haspopup="menu"
                      aria-expanded={accountOpen}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                        {(userName?.trim()?.[0] || "U").toUpperCase()}
                      </span>

                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-semibold leading-tight max-w-[140px] truncate">
                          {userName || "User"}
                        </div>
                        <div className="text-[11px] text-black/50 leading-tight">
                          {userRole ?? "user"}
                        </div>
                      </div>

                      <ChevronDown className="w-4 h-4 text-black/60 hidden sm:block" />
                    </button>

                    {accountOpen && (
                      <div
                        className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border bg-white shadow-xl"
                        role="menu"
                      >
                        <div className="p-2">
                          <Link
                            href="/freelancer/settings"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                            role="menuitem"
                          >
                            <Settings className="w-5 h-5 text-black/70" />
                            <span>Pengaturan</span>
                          </Link>

                          <Link
                            href="/"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
                            role="menuitem"
                          >
                            <ArrowLeft className="w-5 h-5 text-black/70" />
                            <span>Kembali ke Marketplace</span>
                          </Link>
                        </div>

                        <div className="border-t p-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
                            role="menuitem"
                          >
                            <LogOut className="w-5 h-5" />
                            Keluar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Sign in baru tampil kalau benar-benar sudah tidak loading
                  <Link href="/auth/login">
                    <Button className="rounded-xl">Sign in</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile search */}
            <div className="md:hidden pb-3 px-4 sm:px-6">
              <div className="relative">
                <Input
                  placeholder="Cari order / layanan…"
                  className="pr-20 text-sm"
                />
                <Link
                  href="/freelancer/orders"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-black px-2.5 py-1.5 text-xs font-semibold text-white"
                >
                  Cari
                </Link>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
