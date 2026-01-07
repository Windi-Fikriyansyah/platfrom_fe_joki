"use client";

import { FileText, ShieldAlert, Scale, AlertCircle } from "lucide-react";

export default function TermsPage() {
    const sections = [
        {
            title: "1. Penerimaan Ketentuan",
            content: "Dengan mengakses dan menggunakan platform jokiaja.com, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju, harap jangan gunakan layanan kami.",
            icon: <FileText className="w-5 h-5" />,
        },
        {
            title: "2. Layanan Pendampingan",
            content: "jokiaja.com adalah platform yang menghubungkan mahasiswa dengan mentor untuk pendampingan skripsi. Kami hanya memfasilitasi bimbingan, revisi, and konsultasi. Kami melarang keras jasa pembuatan skripsi secara utuh (joki) yang melanggar etik akademik.",
            icon: <AlertCircle className="w-5 h-5" />,
        },
        {
            title: "3. Akun Pengguna",
            content: "Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk memberikan informasi yang akurat and lengkap saat mendaftar.",
            icon: <ShieldAlert className="w-5 h-5" />,
        },
        {
            title: "4. Pembayaran & Biaya Jasa",
            content: "Pembayaran dilakukan melalui sistem escrow jokiaja.com. Dana akan ditahan hingga pekerjaan diselesaikan dan disetujui oleh pengguna. Biaya layanan akan dipotong dari nilai transaksi sesuai kebijakan yang berlaku.",
            icon: <Scale className="w-5 h-5" />,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16 sm:py-24 border-b border-primary/5">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white shadow-xl mb-6 shadow-primary/10">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">
                        Syarat & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Ketentuan</span>
                    </h1>
                    <p className="text-foreground/60 font-medium text-lg">
                        Terakhir diperbarui: 5 Januari 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-4xl px-4 py-16">
                <div className="bg-white rounded-[2.5rem] border border-primary/5 p-8 sm:p-12 shadow-2xl shadow-primary/5">
                    <div className="prose prose-blue max-w-none">
                        <p className="text-lg text-foreground/70 mb-12 italic border-l-4 border-secondary pl-6">
                            "Bacalah Syarat dan Ketentuan ini dengan seksama sebelum menggunakan layanan jokiaja.com."
                        </p>

                        <div className="space-y-12">
                            {sections.map((section, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-2xl font-black m-0 text-foreground">{section.title}</h2>
                                    </div>
                                    <p className="text-foreground/70 leading-relaxed text-lg pl-14">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 p-8 rounded-3xl bg-secondary/5 border border-secondary/10">
                            <h3 className="text-xl font-black mb-4 text-secondary">Pertanyaan Hukum?</h3>
                            <p className="text-foreground/60 mb-0">
                                Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi tim legal kami melalui halaman Hubungi Kami.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
