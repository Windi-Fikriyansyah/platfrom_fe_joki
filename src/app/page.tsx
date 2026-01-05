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
    <div className="relative overflow-hidden bg-background">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 border-b border-primary/5">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-primary shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              🎓 Mahasiswa • Konsultasi • Semua lewat chat
            </div>

            <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-black tracking-tight">
              Bereskan skripsi lebih{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                terarah & tenang
              </span>
              .
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
              Metodologi, olah data (dibimbing), revisi sesuai catatan dosen,
              proofreading, sitasi, dan PPT sidang. <span className="text-secondary font-semibold">Tuntas bareng mentor ahli.</span>
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/search"
                className="group relative h-12 flex items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Cari Layanan Impian
              </Link>
              <Link
                href="/dashboard"
                className="h-12 flex items-center justify-center rounded-2xl border border-primary/20 bg-white px-6 text-sm font-bold text-primary hover:bg-primary/5 shadow-sm active:scale-95 transition-all"
              >
                Jadi Mentor Sekarang
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {categories.slice(0, 7).map((c) => (
                <Link
                  key={c}
                  href={`/search?cat=${encodeURIComponent(c)}`}
                  className="rounded-xl border border-primary/10 bg-white/40 backdrop-blur-sm px-4 py-2 text-xs font-bold text-foreground/80 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                >
                  {c}
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-secondary/10 bg-secondary/5 p-4 text-xs sm:text-sm text-foreground/70">
              <b className="text-secondary">💡 Catatan:</b> layanan fokus pendampingan
              & perbaikan naskah milikmu (bukan menggantikan kamu mengerjakan).
            </div>
          </div>

          {/* Card kanan */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl sm:rounded-3xl border border-white/50 bg-white/80 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-2xl">
              <div className="grid gap-4">
                <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 sm:p-6 text-white shadow-lg shadow-primary/30">
                  <div className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider">
                    Sesi berjalan
                  </div>
                  <div className="mt-1 text-xl sm:text-2xl font-black">
                    Olah Data (Bimbingan)
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/80 font-medium">Status</span>
                    <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1 font-bold animate-pulse">
                      In Progress
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { k: "Mentor", v: "1.2K+", c: "text-primary" },
                    { k: "Layanan", v: "6.4K+", c: "text-secondary" },
                    { k: "Rating", v: "4.8", c: "text-chart-3" },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-2xl border border-primary/5 bg-white p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="text-[10px] sm:text-xs font-bold text-foreground/40 uppercase tracking-widest">
                        {x.k}
                      </div>
                      <div className={`mt-1 text-lg sm:text-xl font-black ${x.c}`}>
                        {x.v}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/chat/1"
                  className="h-12 rounded-xl bg-foreground text-center text-xs sm:text-sm font-bold text-white leading-[48px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  Lihat Contoh Chat Interaktif
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Layanan <span className="text-primary italic">Populer</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-foreground/60 max-w-md">
              Pendampingan yang paling sering dipakai mahasiswa di seluruh Indonesia.
            </p>
          </div>
          <Link
            href="/search"
            className="group flex items-center gap-2 rounded-xl border border-primary/10 bg-white px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            Lihat semua
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {gigs && gigs.length > 0 ? (
            gigs.map((g: any) => <GigCard key={g.id} gig={g} />)
          ) : (
            <div className="col-span-full text-center py-20 rounded-3xl border-2 border-dashed border-primary/10 bg-primary/5">
              <p className="text-foreground/40 font-bold">
                Tidak ada layanan yang tersedia saat ini
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-20 md:pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-primary/10 bg-white p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Mau jadi bagian dari <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mentor Terbaik</span> kami?
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-foreground/60 leading-relaxed">
                Bantu mahasiswa lain menyelesaikan skripsi mereka sambil menambah penghasilan. Daftar sebagai mentor sekarang juga.
              </p>
            </div>
            <Link
              href="/search"
              className="rounded-2xl bg-primary px-8 py-4 text-sm sm:text-base font-black text-white text-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Cari Mentor Ahli
            </Link>
          </div>

          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"></div>
        </div>
      </section>
    </div>
  );
}
