"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type OnboardingStatus = "draft" | "pending_review" | "approved" | "rejected";

export default function PendingReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/freelancer/onboarding`, {
        credentials: "include",
      });
      const json = await res.json();

      if (res.status === 401 || res.status === 403) {
        router.replace("/auth/login");
        return;
      }

      const s = json?.data?.onboarding_status as OnboardingStatus | undefined;
      setStatus(s || null);

      if (s === "approved") router.replace("/freelancer");
      if (s === "rejected") router.replace("/apply-freelance/rejected");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkStatus();
    // optional: auto-poll tiap 10 detik
    const t = setInterval(checkStatus, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Pendaftaran sedang diproses</h1>
        <p className="text-gray-600 mb-6">
          Data kamu sudah terkirim. Tim kami sedang melakukan verifikasi &
          approve. Silakan tunggu, kamu akan otomatis diarahkan jika sudah
          selesai.
        </p>

        <div className="rounded-xl border p-4 bg-gray-50 text-sm text-gray-700">
          Status saat ini:{" "}
          <span className="font-semibold">
            {loading ? "memeriksa..." : status || "pending_review"}
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.replace("/")}
            className="h-11 px-4 rounded-lg border border-gray-300 font-semibold"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
