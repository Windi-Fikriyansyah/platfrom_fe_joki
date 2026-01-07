import Link from "next/link";
import LazyImage from "./LazyImage";

export default function GigCard({ gig }: { gig: any }) {
  return (
    <Link
      href={`/gig/${gig.id}`}
      className="group rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black/5">
        {gig.cover ? (
          <LazyImage
            src={gig.cover}
            alt={gig.title}
            priority={gig.priority}
            className="h-full w-full object-cover transition group-hover:scale-105"
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
        <div className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-white text-black">
          ⭐ {Number(gig.rating || 0).toFixed(1)} <span className="text-gray-400">({gig.review_count || 0})</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          {/* Avatar Mentor */}
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            {gig.seller?.photo_url ? (
              <LazyImage
                src={gig.seller.photo_url}
                alt={gig.seller.name || "Mentor"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 font-bold text-xs">
                {gig.seller?.name?.[0]?.toUpperCase() || "M"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 line-clamp-1">
              {gig.seller?.name || "Mentor"}
            </span>
            <span className="text-[10px] text-gray-500 line-clamp-1">
              {gig.seller?.title || "Freelancer"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-gray-400">Mulai dari</p>
          <p className="text-sm font-extrabold text-black">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(gig.price)}
          </p>
        </div>
      </div>

      {/* Sold Badge */}
      <div className="mt-2 text-[10px] font-medium text-gray-500">
        {(gig.sold || 0) > 0 ? `${gig.sold} terjual` : '0 terjual'}
      </div>

      <div className="mt-3 sm:mt-4 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-black text-center text-xs sm:text-sm font-semibold text-white leading-9 sm:leading-10 opacity-0 transition group-hover:opacity-100">
        Lihat Detail
      </div>
    </Link>
  );
}

interface Gig {
  id: string; // encrypted ID
  title: string;
  category: string;
  price: number;
  cover: string;
  rating: number;
  sold: number;
  review_count: number;
  seller: {
    name: string;
    title: string;
    photo_url: string;
  };
}
