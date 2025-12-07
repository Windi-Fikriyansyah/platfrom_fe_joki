import Link from "next/link";
import { gigs } from "@/lib/mock";

export default function GigDetail({ params }: { params: { id: string } }) {
  const gig = gigs.find((x) => x.id === params.id) ?? gigs[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border bg-white p-6">
          <div className="text-sm font-semibold text-black/50">
            {gig.category}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold">{gig.title}</h1>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-black/5 p-4">
              <div className="text-xs font-semibold text-black/50">Rating</div>
              <div className="mt-1 text-xl font-extrabold">⭐ {gig.rating}</div>
            </div>
            <div className="rounded-2xl bg-black/5 p-4">
              <div className="text-xs font-semibold text-black/50">Terjual</div>
              <div className="mt-1 text-xl font-extrabold">{gig.sold}+</div>
            </div>
            <div className="rounded-2xl bg-black/5 p-4">
              <div className="text-xs font-semibold text-black/50">Mulai</div>
              <div className="mt-1 text-xl font-extrabold">
                Rp {gig.priceFrom.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-extrabold">Deskripsi</h2>
            <p className="mt-2 text-black/60 leading-relaxed">
              Ini halaman detail gig (UI demo). Nanti saat ada backend,
              deskripsi, paket, dan FAQ bisa diambil dari database. Untuk
              sekarang tampilkan layout siap pakai: highlight, requirement, dan
              timeline.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Revisi 2x",
                "Estimasi 2-3 hari",
                "File sumber termasuk",
                "Support via chat",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl border p-4 text-sm font-semibold text-black/70"
                >
                  ✅ {x}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border p-5">
              <div className="font-extrabold">Requirement</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/60 space-y-1">
                <li>Kirim brief kebutuhan</li>
                <li>Contoh referensi/kompetitor</li>
                <li>Warna/brand guideline (jika ada)</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-black/10" />
            <div>
              <div className="font-extrabold">{gig.seller.name}</div>
              <div className="text-sm text-black/60">{gig.seller.title}</div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/5 p-4">
            <div className="text-xs font-semibold text-black/50">
              Harga mulai dari
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              Rp {gig.priceFrom.toLocaleString("id-ID")}
            </div>
            <div className="mt-2 text-sm text-black/60">
              Termasuk 2x revisi & support via chat.
            </div>
          </div>

          <button className="mt-4 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white">
            Order Sekarang
          </button>

          <Link
            href="/chat/1"
            className="mt-3 block w-full rounded-2xl border bg-white px-4 py-3 text-center text-sm font-semibold hover:bg-black/5"
          >
            Chat Freelancer
          </Link>

          <Link
            href={`/freelancer/${gig.seller.id}`}
            className="mt-3 block text-center text-sm font-semibold text-black/60 hover:text-black"
          >
            Lihat profil freelancer →
          </Link>
        </aside>
      </div>
    </div>
  );
}
