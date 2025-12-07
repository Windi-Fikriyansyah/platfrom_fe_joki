export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border bg-white p-4">
          <div className="font-extrabold">Menu</div>
          <div className="mt-3 space-y-2">
            {["Overview", "Order Saya", "Gig Saya", "Wallet", "Pengaturan"].map(
              (x) => (
                <button
                  key={x}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-black/5"
                >
                  {x}
                </button>
              )
            )}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border bg-white p-6">
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="mt-1 text-sm text-black/60">
              Ringkasan aktivitas (UI-only).
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { k: "Order aktif", v: "3" },
                { k: "Chat belum dibaca", v: "5" },
                { k: "Saldo", v: "Rp 1.250.000" },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl bg-black/5 p-4">
                  <div className="text-xs font-semibold text-black/50">
                    {x.k}
                  </div>
                  <div className="mt-1 text-xl font-extrabold">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl font-extrabold">Order Terbaru</div>
                <div className="text-sm text-black/60">Contoh table order.</div>
              </div>
              <button className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white">
                Buat Gig
              </button>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-black/50">
                  <tr>
                    <th className="py-3">Order</th>
                    <th>Jasa</th>
                    <th>Status</th>
                    <th className="text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      id: "UI-001",
                      gig: "Landing Page Next.js",
                      st: "In Progress",
                      amt: "Rp 900.000",
                    },
                    {
                      id: "UI-002",
                      gig: "Desain Logo",
                      st: "Delivered",
                      amt: "Rp 300.000",
                    },
                    {
                      id: "UI-003",
                      gig: "Edit Reels",
                      st: "Revision",
                      amt: "Rp 200.000",
                    },
                  ].map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 font-bold">{r.id}</td>
                      <td className="text-black/70">{r.gig}</td>
                      <td>
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                          {r.st}
                        </span>
                      </td>
                      <td className="text-right font-extrabold">{r.amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
