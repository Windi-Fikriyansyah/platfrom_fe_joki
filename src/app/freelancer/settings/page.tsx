"use client";

import React, { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import {
    User,
    Settings as SettingsIcon,
    Camera,
    Loader2,
    Save,
} from "lucide-react";

type Profile = {
    id: string;
    user_id: string;
    photo_url: string;
    system_name: string;
    freelancer_type: string;
    about: string;
    first_name: string;
    last_name: string;
    nik: string;
    ktp_address: string;
    current_address: string;
    contact_phone: string;
    contact_email: string;
    onboarding_status: string;
    kelurahan: string;
    kecamatan: string;
    city: string;
};

export default function FreelancerSettingsPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [profile, setProfile] = useState<Profile | null>(null);

    // Form States
    const [systemName, setSystemName] = useState("");
    const [freelancerType, setFreelancerType] = useState("full_time");
    const [about, setAbout] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [currentAddress, setCurrentAddress] = useState("");

    // Photo
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setLoading(true);
        try {
            // @ts-ignore
            const res = await api.get("/freelancer/profile");
            if (res.success) {
                const p = res.data as Profile;
                setProfile(p);

                // initialize form
                setSystemName(p.system_name || "");
                setFreelancerType(p.freelancer_type || "full_time");
                setAbout(p.about || "");
                setContactPhone(p.contact_phone || "");
                setCurrentAddress(p.current_address || "");
            }
        } catch (err) {
            console.error(err);
            showToast("Gagal memuat profil", "danger");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            // @ts-ignore
            const res = await api.put("/freelancer/profile", {
                system_name: systemName,
                freelancer_type: freelancerType,
                about: about,
                contact_phone: contactPhone,
                current_address: currentAddress,
            });

            if (res.success) {
                showToast("Pengaturan berhasil disimpan", "success");
                const data = res.data as Profile;
                setProfile(data); // update local state
            } else {
                showToast((res as any).message || "Gagal menyimpan", "danger");
            }
        } catch (err: any) {
            showToast(err.message || "Terjadi kesalahan", "danger");
        } finally {
            setSaving(false);
        }
    }

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // validation
        if (file.size > 2 * 1024 * 1024) {
            showToast("Ukuran foto maksimal 2MB", "danger");
            return;
        }

        const fd = new FormData();
        fd.append("photo", file);

        setUploadingPhoto(true);
        try {
            // use fetch directly for multipart
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("jm_token="))
                ?.split("=")[1];

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/freelancer/profile/photo`, {
                method: "PUT", // Matches route in main.go
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`, // If using Bearer, though we rely on Cookie usually
                },
                credentials: "include",
            });

            const json = await res.json();

            if (json.success) {
                showToast("Foto profil diperbarui", "success");
                setProfile((prev) => prev ? ({ ...prev, photo_url: json.data.photo_url }) : null);
            } else {
                showToast(json.message || "Gagal upload foto", "danger");
            }
        } catch (err) {
            showToast("Gagal upload foto", "danger");
        } finally {
            setUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black/20" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-center text-gray-500">
                Profil tidak ditemukan.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold flex items-center gap-3">
                    <SettingsIcon className="w-7 h-7" />
                    Pengaturan Freelancer
                </h1>
                <p className="text-black/60 mt-1">
                    Kelola informasi profil, biodata, dan kontak Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Col: Photo & Main Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                                {profile.photo_url ? (
                                    <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            {uploadingPhoto && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handlePhotoChange}
                        />

                        <h2 className="font-bold text-lg">{profile.system_name || "Tanpa Nama"}</h2>
                        <span className="text-sm px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold uppercase mt-1">
                            {profile.freelancer_type?.replace("_", " ")}
                        </span>
                    </div>

                    {/* Read-Only Identity Info */}
                    <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-sm uppercase text-black/40 mb-2">Identitas Terverifikasi</h3>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Nama Lengkap (KTP)</label>
                            <div className="font-semibold text-sm">{profile.first_name} {profile.last_name}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">NIK</label>
                            <div className="font-mono text-sm bg-gray-50 p-2 rounded border border-dashed text-gray-600">
                                {profile.nik.substring(0, 4)}••••••••{profile.nik.substring(12)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Alamat KTP</label>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                {profile.ktp_address}, {profile.kelurahan}, {profile.kecamatan}, {profile.city}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Editable Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">Edit Profil</h2>
                        </div>

                        <div className="space-y-5">

                            {/* System Name */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Nama Tampilan (System Name)</label>
                                <Input
                                    value={systemName}
                                    onChange={(e) => setSystemName(e.target.value)}
                                    placeholder="Contoh: Joki Skripsi Mantap"
                                />
                                <p className="text-xs text-black/50 mt-1">
                                    Nama yang akan tampil di halaman produk dan chat.
                                </p>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Tipe Freelancer</label>
                                <select
                                    value={freelancerType}
                                    onChange={(e) => setFreelancerType(e.target.value)}
                                    className="w-full h-11 rounded-xl border px-3 bg-white text-sm"
                                >
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                </select>
                            </div>

                            {/* About */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Tentang Saya (Bio)</label>
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    className="w-full rounded-xl border p-3 text-sm min-h-[120px]"
                                    placeholder="Ceritakan pengalaman, keahlian, dan mengapa klien harus memilih Anda..."
                                />
                            </div>

                            <div className="h-px bg-gray-100 my-6" />

                            {/* Contact - Editable */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Nomor HP / WhatsApp Aktif</label>
                                <Input
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Alamat Domisili Sekarang</label>
                                <textarea
                                    value={currentAddress}
                                    onChange={(e) => setCurrentAddress(e.target.value)}
                                    className="w-full rounded-xl border p-3 text-sm min-h-[80px]"
                                    placeholder="Alamat lengkap tempat tinggal saat ini..."
                                />
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="rounded-xl px-8"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
