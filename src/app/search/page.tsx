"use client";

import { useState } from "react";
import GigCard from "@/components/GigCard";
import { gigs, categories } from "@/lib/mock";

export default function SearchPage() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Cari Layanan Mahasiswa</h1>
          <p className="mt-1 text-sm text-black/60">
            UI-only: filter & sort tampil dan responsif.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="md:hidden rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-black/5"
          >
            {showFilter ? "Tutup Filter" : "Buka Filter"}
          </button>

          <select className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold">
            <option>Sort: Terbaru</option>
            <option>Rating tertinggi</option>
            <option>Harga terendah</option>
          </select>

          <button className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white">
            Terapkan
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[280px_1fr]">
        <aside
          className={`h-fit rounded-2xl border bg-white p-4 ${
            showFilter ? "" : "hidden md:block"
          }`}
        >
          <div className="font-extrabold">Filter</div>

          <div className="mt-4">
            <div className="text-sm font-bold">Kategori</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold text-black/70 hover:bg-black/5"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-bold">Harga</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                className="rounded-xl border px-3 py-2 text-sm"
                placeholder="Min"
              />
              <input
                className="rounded-xl border px-3 py-2 text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-bold">Tipe layanan</div>
            <div className="mt-2 space-y-2">
              {[
                "Sesi 1:1",
                "Review dokumen",
                "Bimbingan olah data",
                "Pembuatan PPT",
              ].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 text-sm text-black/70"
                >
                  <input type="checkbox" />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-black/5">
            Reset
          </button>
        </aside>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.map((g) => (
              <GigCard key={g.id} gig={g} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
