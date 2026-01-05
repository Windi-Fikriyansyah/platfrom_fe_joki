"use client";

import { Send, MapPin, Mail, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden relative">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <section className="mx-auto max-w-7xl px-4 pt-16 sm:pt-24">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Left Column: Info */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-black mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping" />
                            TALK TO HUMAN
                        </div>

                        <h1 className="text-4xl sm:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
                            Ada <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Kendala?</span> <br />
                            Sampaikan pada kami.
                        </h1>

                        <p className="text-xl text-foreground/60 mb-12 font-medium leading-relaxed max-w-lg">
                            Tim support SkripsiMate siap membantu Anda kapan saja. Kami biasanya merespons dalam waktu kurang dari 2 jam di jam kerja.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">Email Support</p>
                                    <p className="text-lg font-bold text-foreground">support@skripsimate.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">WhatsApp Business</p>
                                    <p className="text-lg font-bold text-foreground">+62 821-1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6 text-chart-3" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">Kantor Pusat</p>
                                    <p className="text-lg font-bold text-foreground">Gedung Innovation Center, Jakarta</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative bg-white border border-primary/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl">
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <MessageSquare className="w-8 h-8 text-primary" />
                                Kirim Pesan
                            </h2>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-2">Nama Lengkap</label>
                                        <Input placeholder="John Doe" className="h-12 rounded-xl focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-2">Alamat Email</label>
                                        <Input placeholder="john@example.com" type="email" className="h-12 rounded-xl focus:ring-primary/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-2">Subjek Masalah</label>
                                    <Input placeholder="Misal: Kendala Pembayaran" className="h-12 rounded-xl focus:ring-primary/20" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-2">Detail Pesan</label>
                                    <textarea
                                        placeholder="Jelaskan secara detail kendala yang Anda alami..."
                                        className="w-full min-h-[150px] rounded-xl border border-input bg-transparent px-3 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>

                                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg">
                                    <Send className="w-6 h-6" />
                                    Kirim Sekarang
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Support */}
            <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
                <div className="rounded-[3rem] bg-foreground p-8 sm:p-16 text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">Lebih suka chat lewat WhatsApp?</h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Tim Customer Success kami juga aktif melayani chat via WhatsApp Business setiap hari (09:00 - 21:00 WIB).
                            </p>
                        </div>
                        <button className="flex items-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#25D366]/20">
                            Lanjut ke WhatsApp
                            <ExternalLink className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
