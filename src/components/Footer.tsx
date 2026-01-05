import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-white to-primary/5">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-xl tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold">
                SM
              </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkripsiMate
              </span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Platform pendampingan skripsi nomor #1 di Indonesia.
              Cari mentor terbaik, bimbingan intensif, and bereskan skripsi tanpa drama.
            </p>
          </div>

          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-primary">Layanan</div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li><Link href="/search" className="hover:text-primary transition-colors">Analisis Data (SPSS/R)</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Proofreading Naskah</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Desain PPT Sidang</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Mentoring Metodologi</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-primary">Bantuan</div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li><Link href="/help" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-primary">Social Media</div>
            <div className="mt-4 flex gap-3">
              {["IG", "X", "YT", "FB"].map((x) => (
                <button
                  key={x}
                  className="group relative h-10 w-10 flex items-center justify-center rounded-xl border border-primary/10 bg-white hover:border-primary transition-all overflow-hidden shadow-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 text-xs font-bold text-foreground/60 group-hover:text-white transition-colors">{x}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs font-medium text-foreground/40">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SkripsiMate. Tuntas Bareng Expert.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary transition-colors cursor-default">Modern Interface</span>
            <span className="hover:text-secondary transition-colors cursor-default">Premium Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
