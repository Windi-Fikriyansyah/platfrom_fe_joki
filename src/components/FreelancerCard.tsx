import Link from "next/link";

export default function FreelancerCard({ f }: { f: any }) {
  return (
    <Link
      href={`/freelancer/${f.id}`}
      className="rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-10 sm:h-12 w-10 sm:w-12 shrink-0 rounded-lg sm:rounded-2xl bg-black/10" />
        <div className="min-w-0">
          <div className="truncate font-extrabold text-sm sm:text-base">{f.name}</div>
          <div className="truncate text-xs sm:text-sm text-black/60">{f.title}</div>
        </div>
        <div className="ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold">
          ⭐ {f.rating}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {f.badges.map((b: string) => (
          <span
            key={b}
            className="rounded-full bg-black/5 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold"
          >
            {b}
          </span>
        ))}
        <span className="rounded-full bg-black/5 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold">
          {f.jobs}+ jobs
        </span>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
        {f.skills.map((s: string) => (
          <span
            key={s}
            className="rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-black/60"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl bg-black px-3 sm:px-4 py-1.5 sm:py-2 text-center text-xs sm:text-sm font-semibold text-white">
        Lihat Profil
      </div>
    </Link>
  );
}
