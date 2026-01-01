import Link from "next/link";
import GigCard from "@/components/GigCard";
import FreelancerCard from "@/components/FreelancerCard";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

async function getHomeData() {
  const fetchWithTimeout = async <T,>(
    url: string,
    timeoutMs: number = 5000
  ): Promise<T | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      return null;
    }
  };

  // Use Promise.allSettled for better error handling
  const [productResult, categoryResult] = await Promise.allSettled([
    fetchWithTimeout(`${API_BASE}/products`, 5000),
    fetchWithTimeout(`${API_BASE}/categories`, 5000),
  ]);

  let gigs: any[] = [];
  let categories: any[] = [];

  if (productResult.status === "fulfilled" && productResult.value) {
    const data = productResult.value as any;
    gigs = data?.data ?? [];
  }

  if (categoryResult.status === "fulfilled" && categoryResult.value) {
    const data = categoryResult.value as any;
    categories = data?.data ?? [];
  }

  return {
    gigs,
    categories,
  };
}

export default async function HomePage() {
  const { gigs, categories } = await getHomeData();

  return (
    <div>
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 md:pb-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-black/70">
              🎓 Mahasiswa • Konsultasi • Semua lewat chat
            </div>

            {/* ✅ Ukuran judul mobile lebih pas */}
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-[1.2] font-extrabold">
              Bereskan skripsi lebih terarah dengan{" "}
              <span className="underline decoration-black/20">
                pendampingan & mentoring
              </span>
              .
            </h1>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-black/60 max-w-xl leading-relaxed">
              Metodologi, olah data (dibimbing), revisi sesuai catatan dosen,
              proofreading, sitasi, dan PPT sidang.
            </p>

            {/* ✅ Tombol full-width di mobile */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/search"
                className="h-11 rounded-2xl bg-black px-6 text-center text-sm font-semibold text-white leading-[44px]"
              >
                Cari Layanan
              </Link>
              <Link
                href="/dashboard"
                className="h-11 rounded-2xl border bg-white px-6 text-center text-sm font-semibold hover:bg-black/5 leading-[44px]"
              >
                Jadi Mentor
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 7).map((c) => (
                <Link
                  key={c}
                  href={`/search?cat=${encodeURIComponent(c)}`}
                  className="rounded-full border bg-white px-3 py-2 text-xs font-semibold text-black/70 hover:bg-black/5"
                >
                  {c}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border bg-white p-4 text-xs sm:text-sm text-black/60">
              <b className="text-black">Catatan:</b> layanan fokus pendampingan
              & perbaikan naskah milikmu (bukan menggantikan kamu mengerjakan).
            </div>
          </div>

          {/* ✅ Card kanan: biar di mobile nggak "kekecilan" */}
          <div className="rounded-2xl sm:rounded-3xl border bg-white p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="grid gap-3">
              <div className="rounded-xl sm:rounded-2xl bg-black p-4 sm:p-5 text-white">
                <div className="text-xs sm:text-sm font-semibold text-white/70">
                  Sesi berjalan
                </div>
                <div className="mt-1 text-lg sm:text-xl font-extrabold">
                  Olah Data (Bimbingan)
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-white/70">Status</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">
                    In Progress
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { k: "Mentor", v: "1.2K+" },
                  { k: "Layanan", v: "6.4K+" },
                  { k: "Rating", v: "4.8" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-lg sm:rounded-2xl border bg-white p-3 sm:p-4"
                  >
                    <div className="text-[11px] sm:text-xs font-semibold text-black/50">
                      {x.k}
                    </div>
                    <div className="mt-1 text-base sm:text-lg font-extrabold">
                      {x.v}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/chat/1"
                className="h-10 sm:h-11 rounded-lg sm:rounded-xl bg-black px-3 sm:px-4 text-center text-xs sm:text-sm font-semibold text-white leading-10 sm:leading-[44px]"
              >
                Lihat Contoh Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Layanan Populer
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-black/60">
              Pendampingan yang paling sering dipakai mahasiswa.
            </p>
          </div>
          <Link
            href="/search"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Lihat semua
          </Link>
        </div>

        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {gigs && gigs.length > 0 ? (
            gigs.map((g: any) => <GigCard key={g.id} gig={g} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                Tidak ada layanan yang tersedia saat ini
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-12">
        <div className="rounded-2xl sm:rounded-3xl border bg-white p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                Mentor Terbaik
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-black/60">
                Pilih mentor sesuai kebutuhan skripsimu.
              </p>
            </div>
            <Link
              href="/search"
              className="rounded-lg sm:rounded-xl bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white text-center"
            >
              Cari Mentor
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"></div>
        </div>
      </section>
    </div>
  );
}
