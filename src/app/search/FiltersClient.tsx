"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  categories: string[];
  initialCat: string;
  initialMin: string;
  initialMax: string;
  initialSort: string;
  variant?: "topbar" | "sidebar";
};

export default function FiltersClient({
  categories,
  initialCat,
  initialMin,
  initialMax,
  initialSort,
  variant = "topbar",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  /* =========================
     Helpers Rupiah
  ========================= */
  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number
      ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(number))
      : "";
  };

  const cleanNumber = (value: string) => value.replace(/\D/g, "");

  /* =========================
     State
  ========================= */
  const [showFilter, setShowFilter] = useState(false);

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(initialCat || "");

  const [minDisplay, setMinDisplay] = useState(formatRupiah(initialMin));
  const [maxDisplay, setMaxDisplay] = useState(formatRupiah(initialMax));

  const [sort, setSort] = useState(initialSort || "latest");

  /* =========================
     Sync back/forward browser
  ========================= */
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCat(initialCat || "");
    setMinDisplay(formatRupiah(initialMin));
    setMaxDisplay(formatRupiah(initialMax));
    setSort(initialSort || "latest");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, initialCat, initialMin, initialMax, initialSort]);

  /* =========================
     Build Next URL
  ========================= */
  const nextUrl = useMemo(() => {
    const qs = new URLSearchParams(sp.toString());

    const setOrDel = (key: string, val: string) => {
      if (val && val.trim()) qs.set(key, val.trim());
      else qs.delete(key);
    };

    setOrDel("q", q);
    setOrDel("cat", cat);
    setOrDel("min", cleanNumber(minDisplay));
    setOrDel("max", cleanNumber(maxDisplay));

    if (sort && sort !== "latest") qs.set("sort", sort);
    else qs.delete("sort");

    // Fix: Always reset to page 1 when filtering
    qs.delete("page");

    const query = qs.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [sp, pathname, q, cat, minDisplay, maxDisplay, sort]);

  /* =========================
     Actions
  ========================= */
  const apply = () => {
    router.replace(nextUrl, { scroll: false });
  };

  const reset = () => {
    setQ("");
    setCat("");
    setMinDisplay("");
    setMaxDisplay("");
    setSort("latest");
    // Clear all params but keep pathname
    router.replace(pathname, { scroll: false });
  };

  /* =========================
     TOPBAR (Mobile + Desktop)
  ========================= */
  if (variant === "topbar") {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="md:hidden rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-black/5"
        >
          {showFilter ? "Tutup Filter" : "Buka Filter"}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold"
        >
          <option value="latest">Sort: Terbaru</option>
          <option value="price_low">Harga terendah</option>
          <option value="price_high">Harga tertinggi</option>
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari layanan (contoh: skripsi, SPSS)"
          className="rounded-xl border bg-white px-4 py-3 text-sm w-full sm:w-[260px]"
        />

        <button
          onClick={apply}
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Terapkan
        </button>

        {/* FILTER MOBILE */}
        {showFilter && (
          <div className="md:hidden mt-2 rounded-2xl border bg-white p-4">
            <div className="font-extrabold">Filter</div>

            <div className="mt-4">
              <div className="text-sm font-bold">Kategori</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = cat === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setCat(active ? "" : c)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active
                        ? "bg-black text-white border-black"
                        : "text-black/70 hover:bg-black/5"
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-bold">Harga</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={minDisplay}
                  onChange={(e) => setMinDisplay(formatRupiah(e.target.value))}
                  placeholder="Min"
                  inputMode="numeric"
                  className="rounded-xl border px-3 py-2 text-sm"
                />
                <input
                  value={maxDisplay}
                  onChange={(e) => setMaxDisplay(formatRupiah(e.target.value))}
                  placeholder="Max"
                  inputMode="numeric"
                  className="rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              onClick={reset}
              className="mt-6 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-black/5"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     SIDEBAR (Desktop)
  ========================= */
  return (
    <aside className="h-fit rounded-2xl border bg-white p-4 hidden md:block">
      <div className="font-extrabold">Filter</div>

      <div className="mt-4">
        <div className="text-sm font-bold">Kategori</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => {
                  const next = active ? "" : c;
                  setCat(next);

                  const qs = new URLSearchParams(sp.toString());
                  if (next) qs.set("cat", next);
                  else qs.delete("cat");

                  // Also reset page
                  qs.delete("page");

                  router.replace(`${pathname}?${qs.toString()}`, {
                    scroll: false,
                  });
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active
                  ? "bg-black text-white border-black"
                  : "text-black/70 hover:bg-black/5"
                  }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-bold">Harga</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            value={minDisplay}
            onChange={(e) => setMinDisplay(formatRupiah(e.target.value))}
            placeholder="Min"
            inputMode="numeric"
            className="rounded-xl border px-3 py-2 text-sm"
          />
          <input
            value={maxDisplay}
            onChange={(e) => setMaxDisplay(formatRupiah(e.target.value))}
            placeholder="Max"
            inputMode="numeric"
            className="rounded-xl border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={apply}
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Terapkan
        </button>
        <button
          onClick={reset}
          className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-black/5"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
