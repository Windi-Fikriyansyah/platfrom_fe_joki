"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import {
    User,
    Phone,
    Mail,
    Save,
    Loader2,
    ShieldCheck
} from "lucide-react";

export default function ClientProfilePage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        fetchMe();
    }, []);

    async function fetchMe() {
        setLoading(true);
        try {
            const res = await apiFetch<{ success: boolean; data: any }>("/me");
            if (res.success) {
                setName(res.data.name || "");
                setEmail(res.data.email || "");
                setPhone(res.data.phone || "");
            }
        } catch (err) {
            console.error(err);
            showToast("Gagal memuat profil", "danger");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!name.trim()) {
            showToast("Nama tidak boleh kosong", "danger");
            return;
        }

        setSaving(true);
        try {
            const res = await apiFetch<{ success: boolean; message: string }>("/me", {
                method: "PUT",
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                }),
            });

            if (res.success) {
                showToast("Profil berhasil diperbarui", "success");
                // Optional: reload window to update Navbar name
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showToast(res.message || "Gagal menyimpan", "danger");
            }
        } catch (err: any) {
            showToast(err.message || "Terjadi kesalahan", "danger");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12">
            <div className="mb-8 flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                    {(name?.[0] || "U").toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Profil Saya</h1>
                    <p className="text-sm text-gray-500 font-medium">Kelola informasi akun Anda</p>
                </div>
            </div>

            <div className="rounded-3xl border border-primary/10 bg-white p-6 sm:p-8 shadow-sm">
                <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <User className="w-4 h-4 text-primary" />
                            Nama Lengkap
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="rounded-xl border-primary/10 focus:border-primary/40 focus:ring-primary/20 h-12"
                        />
                    </div>

                    {/* Email - Read Only */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Mail className="w-4 h-4 text-primary" />
                            Email
                        </label>
                        <div className="relative">
                            <Input
                                value={email}
                                disabled
                                className="rounded-xl border-primary/5 bg-gray-50 h-12 text-gray-500 cursor-not-allowed pr-10"
                            />
                            <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-[10px] text-gray-400">Email tidak dapat diubah karena merupakan identitas utama akun.</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Phone className="w-4 h-4 text-primary" />
                            Nomor Telepon / WhatsApp
                        </label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="rounded-xl border-primary/10 focus:border-primary/40 focus:ring-primary/20 h-12"
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
