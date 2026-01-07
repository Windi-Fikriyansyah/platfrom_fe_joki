"use client";

import { ShieldCheck, Eye, Lock, Database, Globe } from "lucide-react";

export default function PrivacyPage() {
    const points = [
        {
            icon: <Database className="w-6 h-6 text-chart-3" />,
            title: "Data yang Kami Kumpulkan",
            text: "Kami mengumpulkan informasi profil (nama, email, nomor HP), data transaksi, and riwayat chat antara Anda dan mentor untuk memastikan kualitas layanan.",
        },
        {
            icon: <Eye className="w-6 h-6 text-primary" />,
            title: "Penggunaan Informasi",
            text: "Data Anda digunakan untuk memproses pesanan, memberikan dukungan teknis, and meningkatkan algoritma pencarian mentor yang lebih personal.",
        },
        {
            icon: <Lock className="w-6 h-6 text-secondary" />,
            title: "Keamanan Data",
            text: "Kami menggunakan enkripsi tingkat tinggi untuk melindungi data pribadi and informasi transaksi Anda dari akses yang tidak sah.",
        },
        {
            icon: <Globe className="w-6 h-6 text-chart-5" />,
            title: "Berbagi Informasi",
            text: "jokiaja.com tidak pernah menjual data pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada penyedia layanan pembayaran resmi kami.",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative overflow-hidden bg-white border-b border-primary/10 py-20 sm:py-28">
                <div className="absolute top-0 right-0 w-80 h-80 bg-chart-3/5 rounded-full blur-3xl -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-40 -mb-40" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-chart-3/10 text-chart-3 text-sm font-black mb-8 border border-chart-3/10">
                        <ShieldCheck className="w-5 h-5" />
                        KEAMANAN DATA ADALAH PRIORITAS
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black mb-8 tracking-tight">
                        Kebijakan <span className="bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">Privasi</span>
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
                        Komitmen kami untuk melindungi data pribadi dan transparansi dalam setiap informasi yang Anda bagikan di jokiaja.com.
                    </p>
                </div>
            </section>

            {/* Main Points */}
            <section className="mx-auto max-w-7xl px-4 py-20">
                <div className="grid gap-8 md:grid-cols-2">
                    {points.map((p, i) => (
                        <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-primary/5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                {p.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-foreground">{p.title}</h3>
                            <p className="text-foreground/70 leading-relaxed text-lg">{p.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed Sections */}
            <section className="mx-auto max-w-4xl px-4 pb-32">
                <div className="bg-foreground text-white rounded-[3rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-chart-3 opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />

                    <h2 className="text-3xl font-black mb-10">Pemberitahuan Cookies</h2>
                    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                        <p>
                            Kami menggunakan cookies untuk meningkatkan pengalaman navigasi Anda, mengingat preferensi masuk, and menganalisis lalu lintas situs kami.
                        </p>
                        <p>
                            Dengan terus menggunakan platform kami, Anda menyetujui penggunaan cookies sesuai dengan kebijakan ini. Anda dapat mengontrol atau menghapus cookies melalui pengaturan browser Anda kapan saja.
                        </p>
                    </div>

                    <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-base font-bold text-white/50 italic">
                            "Privasi Anda adalah kendali Anda."
                        </div>
                        <button className="px-8 py-4 bg-chart-3 rounded-2xl font-black text-white shadow-lg shadow-chart-3/20 hover:scale-105 active:scale-95 transition-all">
                            Kelola Preferensi
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
