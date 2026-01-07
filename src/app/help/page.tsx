"use client";

import { Search, HelpCircle, BookOpen, CreditCard, UserCheck, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

const categories = [
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Panduan Pemesanan",
        desc: "Cara mencari mentor, memilih layanan, dan melakukan pembayaran.",
        color: "bg-primary/10 text-primary",
    },
    {
        icon: <UserCheck className="w-6 h-6" />,
        title: "Akun & Profil",
        desc: "Mengelola informasi profil, verifikasi, dan keamanan akun.",
        color: "bg-secondary/10 text-secondary",
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Pembayaran & Refund",
        desc: "Metode pembayaran yang tersedia dan info pengembalian dana.",
        color: "bg-chart-3/10 text-chart-3",
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Interaksi & Chat",
        desc: "Cara berkomunikasi efektif dengan mentor and revisi naskah.",
        color: "bg-chart-5/10 text-chart-5",
    },
];

const faqs = [
    { q: "Bagaimana cara memilih mentor yang tepat?", a: "Lihat rating, portfolio, dan spesialisasi bidang mereka di profil mentor." },
    { q: "Apakah pembayaran di jokiaja.com aman?", a: "Ya, kami menggunakan sistem escrow di mana dana hanya dilepas setelah Anda menyetujui hasil pekerjaan." },
    { q: "Apa yang harus dilakukan jika hasil revisi tidak sesuai?", a: "Anda dapat mengajukan komplain atau meminta revisi tambahan melalui fitur chat." },
    { q: "Berapa lama rata-rata sesi bimbingan?", a: "Tergantung kesepakatan, namun biasanya sesi konsultasi berlangsung 1-2 jam per sesi." },
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary py-16 sm:py-24 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">Pusat Bantuan</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 font-medium">
                        Apa yang bisa kami bantu hari ini? Cari panduan atau jawaban dari pertanyaan Anda.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
                        <Input
                            placeholder="Cari masalah Anda (misal: pembayaran, refund, cara daftar)"
                            className="h-14 pl-14 pr-6 rounded-2xl border-none shadow-2xl text-foreground text-lg focus:ring-4 focus:ring-white/20"
                        />
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="mx-auto max-w-7xl px-4 -mt-10 relative z-10">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((cat, i) => (
                        <div key={i} className="group cursor-pointer rounded-3xl border border-primary/5 bg-white p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                                {cat.icon}
                            </div>
                            <h3 className="text-lg font-black mb-2 text-foreground">{cat.title}</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed mb-4">{cat.desc}</p>
                            <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                                Pelajari <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mx-auto max-w-4xl px-4 py-20">
                <div className="text-center mb-12">
                    <HelpCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4">Pertanyaan Populer</h2>
                    <p className="text-foreground/60 font-medium">Jawaban cepat untuk hal-hal yang sering ditanyakan pengguna.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group rounded-2xl border border-primary/5 bg-white shadow-sm overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-primary/5 transition-colors">
                                <span className="font-bold text-foreground">{faq.q}</span>
                                <ChevronRight className="w-5 h-5 text-primary group-open:rotate-90 transition-transform" />
                            </summary>
                            <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-16 text-center bg-gradient-to-br from-primary to-secondary rounded-3xl p-10 text-white shadow-xl shadow-primary/20">
                    <h3 className="text-2xl font-black mb-4">Masih butuh bantuan?</h3>
                    <p className="mb-8 text-white/80 font-medium">Tim support kami siap membantu Anda 24/7.</p>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-primary font-black px-8 py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        Hubungi Tim Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
