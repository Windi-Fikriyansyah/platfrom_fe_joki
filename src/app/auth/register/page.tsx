"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FieldErrors = Record<string, string[]>;

function firstErrorMessage(errors?: FieldErrors): string | null {
  if (!errors) return null;
  for (const key of Object.keys(errors)) {
    const msg = errors[key]?.[0];
    if (msg) return msg;
  }
  return null;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // opsional
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ simpan error per field dari backend
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const router = useRouter();
  const { showToast } = useToast();

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || "", []);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // reset error UI setiap submit
    setFieldErrors({});

    // validasi FE (cepat)
    if (password.length < 8) {
      setFieldErrors((p) => ({
        ...p,
        password: ["Password minimal 8 karakter"],
      }));
      showToast("Password minimal 8 karakter", "danger");
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors((p) => ({
        ...p,
        confirmPassword: ["Password dan konfirmasi tidak cocok"],
      }));
      showToast("Password dan konfirmasi tidak cocok", "danger");
      return;
    }
    if (!agree) {
      showToast("Kamu harus menyetujui Syarat & Ketentuan", "danger");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || null,
      };

      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // parse aman tanpa bikin error di console
      const ct = res.headers.get("content-type") || "";
      let data: any = {};
      if (ct.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = {};
        }
      } else {
        await res.text().catch(() => "");
      }

      const isFailed = !res.ok || data?.success === false;

      if (isFailed) {
        // ✅ tampilkan error field dari backend kalau ada
        const beErrors: FieldErrors | undefined = data?.errors;
        if (beErrors && typeof beErrors === "object") {
          setFieldErrors(beErrors);
        }

        // ✅ toast ambil pesan paling atas (prioritas field error)
        const msg =
          firstErrorMessage(beErrors) || data?.message || "Pendaftaran gagal";
        showToast(msg, "danger");
        return;
      }

      if (data?.data?.token) localStorage.setItem("jm_token", data.data.token);
      if (data?.data?.user)
        localStorage.setItem("jm_user", JSON.stringify(data.data.user));

      localStorage.setItem(
        "jm_toast",
        JSON.stringify({
          message: "Pendaftaran berhasil. Silakan masuk.",
          type: "success",
        })
      );
      router.replace("/auth/login");
    } catch {
      // tidak di-console, hanya toast
      showToast("Terjadi kesalahan jaringan", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-4 sm:p-8 shadow-md mx-2">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white text-sm font-bold">
              JA
            </span>
            <span className="text-lg sm:text-xl font-extrabold">
              jokiaja.com
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold">Daftar</h1>
        </div>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              type="email"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              No. HP <span className="text-black/50">(opsional)</span>
            </label>
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              inputMode="tel"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                type="password"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Konfirmasi
              </label>
              <Input
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                type="password"
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border mt-1"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <span className="text-sm text-black/60">
              Saya setuju dengan{" "}
              <Link href="#" className="underline">
                Syarat &amp; Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="#" className="underline">
                Kebijakan Privasi
              </Link>
            </span>
          </label>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Memproses…" : "Daftar"}
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
              const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
              window.location.href = `${api}/auth/google/start`;
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
            <span>Daftar dengan Google</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-black/60">Sudah punya akun? </span>
          <Link
            href="/auth/login"
            className="font-semibold text-black hover:underline"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
