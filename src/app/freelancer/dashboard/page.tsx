"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function FreelancerDashboardPage() {
  const [stats, setStats] = useState({
    active_orders: 0,
    unread_chats: 0,
    total_earnings: 0,
  });

  useEffect(() => {
    // @ts-ignore
    api.get("/freelancer/dashboard/stats").then((res) => {
      if (res.success) {
        setStats(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h1 className="text-xl font-extrabold">Dashboard Freelancer</h1>
        <p className="text-sm text-black/60 mt-1">
          Selamat datang di area kerja Anda. Pantau order dan pendapatan di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Order Aktif</div>
          <div className="text-2xl font-extrabold mt-1">
            {stats.active_orders}
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Chat Belum Dibaca</div>
          <div className="text-2xl font-extrabold mt-1">
            {stats.unread_chats}
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="text-sm text-black/60">Total Pendapatan (Ditarik/Tersedia)</div>
          <div className="text-2xl font-extrabold mt-1">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(stats.total_earnings)}
          </div>
        </div>
      </div>
    </div>
  );
}
