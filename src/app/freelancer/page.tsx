import GigCard from "@/components/GigCard";
import { freelancers, gigs } from "@/lib/mock";

export default function FreelancerProfile({
  params,
}: {
  params: { id: string };
}) {
  const f = freelancers.find((x) => x.id === params.id) ?? freelancers[0];
  const list = gigs.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-3xl border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-black/10" />
            <div>
              <div className="text-2xl font-extrabold">{f.name}</div>
              <div className="text-sm text-black/60">{f.title}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {f.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold"
                  >
                    {b}
                  </span>
                ))}
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                  ⭐ {f.rating}
                </span>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                  {f.jobs}+ jobs
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5">
              Simpan
            </button>
            <button className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white">
              Chat
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border p-5">
            <div className="font-extrabold">Tentang</div>
            <p className="mt-2 text-sm text-black/60 leading-relaxed">
              Profil freelancer (UI-only). Nanti isi bio, portfolio, dan
              pengalaman bisa dari database. Fokus desain bersih, card rapi, dan
              CTA jelas.
            </p>

            <div className="mt-4">
              <div className="font-bold">Skill</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {f.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border px-3 py-1 text-xs font-semibold text-black/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-extrabold">Info</div>
            <div className="mt-3 space-y-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span className="text-black/50">Response</span>
                <b>~1 jam</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/50">Revisi</span>
                <b>2x</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/50">Bahasa</span>
                <b>ID/EN</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Jasa dari {f.name}</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((g) => (
            <GigCard key={g.id} gig={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
