"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white text-sm font-bold">SM</span>
            <span className="text-lg sm:text-xl font-extrabold">SkripsiMate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Daftar</h1>
          <p className="mt-2 text-sm text-black/60 max-w-sm">Bergabunglah dengan SkripsiMate untuk mencari atau menawarkan jasa mentoring skripsi.</p>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex gap-2">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-black" : "bg-black/20"}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-black" : "bg-black/20"}`} />
          </div>

          <form className="space-y-4">
            {step === 1 && (
              <>
                <label className="block text-sm font-medium mb-2">Saya ingin mendaftar sebagai</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`p-3 rounded-lg border transition ${role === "client" ? "bg-black text-white border-black" : "bg-white"}`}
                  >
                    <div className="text-2xl mb-1">👨‍🎓</div>
                    <div className="font-semibold text-sm">Mahasiswa</div>
                    <div className="text-[12px] text-black/60 mt-1">Cari mentor</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("freelancer")}
                    className={`p-3 rounded-lg border transition ${role === "freelancer" ? "bg-black text-white border-black" : "bg-white"}`}
                  >
                    <div className="text-2xl mb-1">👨‍💼</div>
                    <div className="font-semibold text-sm">Mentor</div>
                    <div className="text-[12px] text-black/60 mt-1">Tawarkan jasa</div>
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-black/5 border text-sm text-black/70">
                  {role === "client" ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Cari mentor sesuai kebutuhan skripsi</li>
                      <li>Chat langsung dengan mentor</li>
                      <li>Dapatkan feedback dan revisi</li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Tawarkan jasa pendampingan</li>
                      <li>Atur harga dan availability</li>
                      <li>Dapatkan passive income</li>
                    </ul>
                  )}
                </div>

                <Button className="w-full h-11 mt-3" onClick={handleNext}>Lanjutkan</Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                  <Input placeholder="Masukkan nama lengkap" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input type="email" placeholder="contoh@email.com" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input type="password" placeholder="Minimal 8 karakter" required />
                  <p className="text-[12px] text-black/50 mt-1">Gunakan kombinasi huruf besar, kecil, angka, dan simbol.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                  <Input type="password" placeholder="Masukkan ulang password" required />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border mt-1" required />
                  <span className="text-sm text-black/60">Saya setuju dengan <Link href="#" className="underline">Syarat & Ketentuan</Link> dan <Link href="#" className="underline">Kebijakan Privasi</Link></span>
                </label>

                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={handlePrev} className="flex-1 h-11 rounded-lg border bg-white hover:bg-black/5">Kembali</button>
                  <Button className="flex-1 h-11">Daftar</Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-black/50">atau</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex gap-2 mb-4">
                <button className="flex-1 h-10 rounded-lg border bg-white hover:bg-black/5 font-semibold">Google</button>
                <button className="flex-1 h-10 rounded-lg border bg-white hover:bg-black/5 font-semibold">GitHub</button>
              </div>
            </>
          )}

          <div className="text-center text-sm mt-2">
            <p className="text-black/60">Sudah punya akun? <Link href="/auth/login" className="font-semibold text-black hover:underline">Masuk di sini</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
