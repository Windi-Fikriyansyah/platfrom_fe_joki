import Link from "next/link";
import GigCard from "@/components/GigCard";
import FreelancerCard from "@/components/FreelancerCard";
import { Search, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
          <div className="relative flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-primary shadow-sm hover:scale-105 transition-transform cursor-default mb-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              🎓 Mahasiswa • Konsultasi • Semua lewat chat
            </div>

            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-black tracking-tight text-center lg:text-left">
              Bereskan skripsi lebih{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                terarah & tenang
              </span>
              .
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Metodologi, olah data (dibimbing), revisi sesuai catatan dosen,
              proofreading, sitasi, dan PPT sidang. <span className="text-secondary font-semibold">Tuntas bareng mentor ahli.</span>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto lg:mx-0 lg:max-w-none">
              <Button
                href="/search"
                variant="premium"
                full
                className="h-14 sm:h-16 text-base sm:text-lg group"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                Cari Layanan Impian
              </Button>
              <Button
                href="/dashboard"
                variant="secondary"
                full
                className="h-14 sm:h-16 text-base sm:text-lg"
              >
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                Jadi Mentor Sekarang
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5 justify-center lg:justify-start">
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
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 shadow-lg shadow-primary/10 min-h-[250px] sm:min-h-[400px] group/card">
                  <img
                    src="/thesis_mentoring_banner_1767773830848.png"
                    alt="Bimbingan Olah Data"
                    className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle glass effect label */}
                  <div className="absolute top-4 left-4 rounded-full bg-white/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                    Live Session
                  </div>
                </div>

                {/* Stats and Button removed as requested */}
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
          <Button
            href="/search"
            variant="outline"
            className="w-full sm:w-auto group border-primary/10 text-primary hover:border-primary/20"
          >
            Lihat semua
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {gigs && gigs.length > 0 ? (
            gigs.map((g: any, index: number) => (
              <GigCard key={g.id} gig={{ ...g, priority: index < 4 }} />
            ))
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
            <Button
              href="/search"
              variant="premium"
              className="w-full sm:w-auto h-14 px-10 text-base"
            >
              Cari Mentor Ahli
            </Button>
          </div>

          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"></div>
        </div>
      </section>
    </div>
  );
}
