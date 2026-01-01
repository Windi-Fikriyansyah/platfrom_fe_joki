import Link from "next/link";

export default function GigCard({ gig }: { gig: any }) {
  return (
    <Link
      href={`/gig/${gig.id}`}
      className="group rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black/5">
        {gig.cover ? (
          <img
            src={gig.cover}
            alt={gig.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-black/0 to-black/10" />
        )}
      </div>

      <div className="mt-2 sm:mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-semibold text-black/50">
            {gig.category}
          </div>
          <div className="mt-1 line-clamp-2 text-xs sm:text-sm font-bold">
            {gig.title}
          </div>
        </div>
        <div className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold">
          ⭐ {gig.rating}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-black/60 min-w-0">
          {gig.seller?.photo_url ? (
            <img
              src={gig.seller.photo_url}
              alt={gig.seller.name}
              className="h-7 sm:h-8 w-7 sm:w-8 shrink-0 rounded-full object-cover border"
              loading="lazy"
            />
          ) : (
            <span className="h-7 sm:h-8 w-7 sm:w-8 shrink-0 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold text-black/40">
              {gig.seller?.name?.charAt(0) ?? "M"}
            </span>
          )}
          <div className="leading-tight min-w-0">
            <div className="font-semibold text-black truncate">
              {gig.seller.name}
            </div>
            <div className="text-[10px] sm:text-xs truncate">
              {gig.seller.title}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] sm:text-xs text-black/50">Mulai dari</div>
          <div className="font-extrabold text-xs sm:text-sm">
            Rp {gig.price.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs text-black/50">
        <span>{gig.sold}+ terjual</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 font-semibold whitespace-nowrap">
          {gig.seller.level}
        </span>
      </div>

      <div className="mt-3 sm:mt-4 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-black text-center text-xs sm:text-sm font-semibold text-white leading-9 sm:leading-10 opacity-0 transition group-hover:opacity-100">
        Lihat Detail
      </div>
    </Link>
  );
}
