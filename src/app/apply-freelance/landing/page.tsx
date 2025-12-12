"use client";

import Link from "next/link";

export default function ApplyFreelancerLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Selamat Bergabung sebagai Freelancer!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Pendaftaran Anda berhasil. Sekarang saatnya mulai menambahkan
          pekerjaan dan layanan Anda agar klien dapat menemukan Anda.
        </p>
        <Link
          href="/product/basic"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Tambahkan Pekerjaan / Layanan
        </Link>
        <div className="mt-6 text-sm text-gray-500">
          Anda dapat mengelola pekerjaan di halaman{" "}
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
