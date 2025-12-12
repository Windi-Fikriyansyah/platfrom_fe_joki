export default function FreelancerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h1 className="text-xl font-extrabold">Dashboard Freelancer</h1>
        <p className="text-sm text-black/60 mt-1">
          Ini area khusus freelancer (navbar berbeda dari marketplace).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Order Aktif</div>
          <div className="text-2xl font-extrabold mt-1">0</div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Chat Baru</div>
          <div className="text-2xl font-extrabold mt-1">0</div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Pendapatan Bulan Ini</div>
          <div className="text-2xl font-extrabold mt-1">Rp 0</div>
        </div>
      </div>
    </div>
  );
}
