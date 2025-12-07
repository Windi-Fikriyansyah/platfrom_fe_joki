"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-black text-white text-xs sm:text-sm font-bold">
              SM
            </span>
            <span className="text-lg sm:text-xl font-extrabold">SkripsiMate</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Lupa Password?</h1>
          <p className="mt-2 text-xs sm:text-sm text-black/60">
            Kami akan membantu Anda mengatur ulang password
          </p>
        </div>

        <form className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-[10px] sm:text-xs text-black/50 mt-1">
                  Masukkan email terdaftar di akun Anda
                </p>
              </div>

              <Button
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => setStep(2)}
              >
                Kirim Kode Verifikasi
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-black/5 border rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-black/70">
                  Kami telah mengirim kode verifikasi ke
                </p>
                <p className="font-semibold text-xs sm:text-sm mt-1">{email}</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5">
                  Kode Verifikasi
                </label>
                <Input placeholder="Masukkan 6 digit kode" maxLength={6} required />
              </div>

              <Button
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => setStep(3)}
              >
                Verifikasi
              </Button>

              <p className="text-center text-xs text-black/50">
                Tidak menerima kode?{" "}
                <button className="font-semibold underline hover:text-black">
                  Kirim ulang
                </button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5">
                  Password Baru
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5">
                  Konfirmasi Password
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan ulang password"
                  required
                />
              </div>

              <Button className="w-full h-10 sm:h-11 text-sm sm:text-base">
                Atur Ulang Password
              </Button>
            </>
          )}
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm text-black/60 hover:text-black font-semibold"
          >
            ← Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
