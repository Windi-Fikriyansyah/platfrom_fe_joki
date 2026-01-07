"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/";

  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // optional: kalau kamu tetap butuh simpan error (tidak wajib)
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // read persisted toast (from register redirect)
    try {
      const raw = localStorage.getItem("jm_toast");
      if (raw) {
        const t = JSON.parse(raw);
        if (t?.message) showToast(t.message, t.type || "info");
        localStorage.removeItem("jm_toast");
      }
    } catch {
      // ignore
    }
  }, [showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // ⬅️ penting
        }
      );

      const payload = await res.json();

      if (!res.ok || payload?.success === false) {
        showToast(payload?.message || "Login gagal", "danger");
        return;
      }

      showToast("Berhasil masuk", "success");
      router.replace(next);
    } catch {
      showToast("Terjadi kesalahan jaringan", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white text-sm font-bold">
              JA
            </span>
            <span className="text-lg sm:text-xl font-extrabold">
              jokiaja.com
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Masuk</h1>
          <p className="mt-2 text-sm text-black/60 max-w-sm">
            Masuk untuk mengelola layanan, chat mentor, dan melihat progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" className="w-4 h-4 rounded border" />
              <span>Ingat saya</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-black/60 hover:text-black"
            >
              Lupa password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="
    w-full h-11 bg-black text-white 
    hover:bg-black/80 
    transition-all duration-200 
    active:scale-[0.98]
  "
          >
            {loading ? "Memproses…" : "Masuk"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-black/50">atau</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="">
          <button
            type="button"
            onClick={() => {
              const api = process.env.NEXT_PUBLIC_API_BASE_URL;
              window.location.href = `${api}/auth/google/start?next=${encodeURIComponent(
                next
              )}`;
            }}
            className="w-full h-10 rounded-lg border bg-white hover:bg-black/5 font-semibold inline-flex items-center justify-center gap-3"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.4-1.45 4.11-5.26 4.11-3.17 0-5.75-2.62-5.75-5.84s2.58-5.84 5.75-5.84c1.8 0 3.01.77 3.7 1.43l2.52-2.43C17.1 3.2 15.28 2.3 12.17 2.3 7.1 2.3 3 6.34 3 11.26s4.1 8.96 9.17 8.96c5.29 0 8.8-3.8 8.8-9.12 0-.62-.07-1.06-.62-1.3z"
                fill="#4285F4"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-black/60">Belum punya akun? </span>
          <Link
            href="/auth/register"
            className="font-semibold text-black hover:underline"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
