export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="font-extrabold text-base sm:text-lg">
              FastworkUI
            </div>
            <p className="mt-2 text-xs sm:text-sm text-black/60">
              Marketplace jasa (UI demo). Cari freelancer, order, dan chat—semua
              dalam satu tempat.
            </p>
          </div>
          <div>
            <div className="font-bold text-sm">Kategori</div>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-black/60">
              <li>Desain</li>
              <li>Penulisan</li>
              <li>Web/App</li>
              <li>Video</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-sm">Bantuan</div>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-black/60">
              <li>FAQ</li>
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan</li>
              <li>Kontak</li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-sm">Ikuti</div>
            <div className="mt-2 flex gap-2">
              {["IG", "X", "YT"].map((x) => (
                <span
                  key={x}
                  className="inline-flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border text-xs sm:text-sm font-bold"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-2 border-t pt-4 sm:pt-6 text-xs sm:text-sm text-black/50 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} FastworkUI. UI demo.</span>
          <span>Made with Next.js + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
