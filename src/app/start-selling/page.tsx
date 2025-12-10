"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function StartSellingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [checking, setChecking] = useState(false);

  async function checkOnboardingAndRedirect() {
    if (checking) return;
    setChecking(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${api}/freelancer/onboarding`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push(`/auth/login?next=${encodeURIComponent("/start-selling")}`);
        return;
      }

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const status = (
        data as unknown as { data?: { onboarding_status?: string } }
      )?.data?.onboarding_status;
      if (status === "pending_review") {
        router.push("/apply-freelance/pending-review");
      } else {
        router.push("/apply-freelance");
      }
    } catch {
      showToast("Gagal memeriksa status pendaftaran", "danger");
      router.push("/apply-freelance");
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    // noop — ensures client component hydration before render
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Hero */}
          <div className="lg:col-span-7">
            <div className="h-full flex flex-col rounded-2xl bg-white p-8 shadow-lg">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Freelance di fastwork — Mulai Jual Jasa Anda
              </h1>

              <p className="mt-1 text-gray-600 max-w-xl">
                Kebebasan bekerja dengan dukungan platform kami: proteksi
                pembayaran, pembuatan invoice cepat, dan tim support siap
                membantu.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={checkOnboardingAndRedirect}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-white font-semibold shadow transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {checking ? "Memeriksa…" : "Daftar sebagai Freelancer"}
                </button>
              </div>

              {/* CARD BENEFIT */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-emerald-50 p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2v6l4-2-4 2v6"
                        stroke="#059669"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">
                      Tingkatkan peluang kerja
                    </h4>
                    <p className="text-sm text-gray-600">
                      Promosi lewat berbagai channel untuk memperbesar
                      kesempatan Anda ditemukan buyer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-amber-50 p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"
                        stroke="#D97706"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10l5-5 5 5"
                        stroke="#D97706"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">
                      Proteksi Pembayaran
                    </h4>
                    <p className="text-sm text-gray-600">
                      Buyer membayar melalui kami dan dana ditahan sampai
                      pekerjaan selesai.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration / Steps */}
          <div className="lg:col-span-5">
            <div className="h-full flex flex-col justify-between rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                6 Langkah Mudah Menjadi Freelancer Kami
              </h3>

              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold">
                      Daftar sebagai Freelancer
                    </div>
                    <div className="text-sm text-gray-600">
                      Daftar dengan KTP dan akun bank untuk verifikasi, lalu
                      posting pekerjaan Anda.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold">Posting Pekerjaan</div>
                    <div className="text-sm text-gray-600">
                      Siapkan portofolio profesional, pekerjaan akan diperiksa
                      dalam 48 jam.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-semibold">Mulai Menjual</div>
                    <div className="text-sm text-gray-600">
                      Gunakan Seller Center untuk optimalkan penawaran Anda.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <div className="font-semibold">Bekerja Tanpa Khawatir</div>
                    <div className="text-sm text-gray-600">
                      Kami bantu mengelola pembayaran dan penyelesaian
                      pekerjaan.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <div className="font-semibold">Serahkan Hasil & Ulasan</div>
                    <div className="text-sm text-gray-600">
                      Dapatkan review untuk meningkatkan trust dan peluang Anda.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="flex-none w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <div className="font-semibold">Terima Pembayaran</div>
                    <div className="text-sm text-gray-600">
                      Dana ditransfer ke rekening setelah pekerjaan selesai.
                    </div>
                  </div>
                </li>
              </ol>

              <div className="mt-6">
                <button
                  onClick={checkOnboardingAndRedirect}
                  className="cursor-pointer w-full rounded-md bg-emerald-600 text-white py-3 font-semibold shadow transition transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {checking ? "Memeriksa…" : "Mulai Daftar Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
