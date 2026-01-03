"use client";

import { useState, useRef } from "react";
import { X, Upload, File, CheckCircle2 } from "lucide-react";
import { JobOffer } from "./types";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface DeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: JobOffer;
    onSuccess: (updatedOffer: JobOffer) => void;
}

export default function DeliveryModal({
    isOpen,
    onClose,
    offer,
    onSuccess,
}: DeliveryModalProps) {
    const [workUrl, setWorkUrl] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [agreed, setAgreed] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Limit to 10 files total
            if (files.length + selectedFiles.length > 10) {
                toast.error("Maksimal 10 file yang dapat diupload");
                return;
            }

            // Check file size (25MB)
            const oversized = selectedFiles.some(f => f.size > 25 * 1024 * 1024);
            if (oversized) {
                toast.error("Beberapa file melebihi batas 25MB");
                return;
            }

            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            toast.error("Anda harus menyetujui syarat dan ketentuan");
            return;
        }

        if (!workUrl.trim() && files.length === 0) {
            toast.error("Harap masukkan link atau upload file hasil kerja");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("work_url", workUrl);
            files.forEach(file => {
                formData.append("files", file);
            });

            const res = await apiFetch<{ success: boolean; data: JobOffer }>(
                `/job-offers/${offer.id}/deliver`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (res.success) {
                toast.success("Pekerjaan berhasil dikirim ke pembeli!");
                onSuccess(res.data);
                onClose();
            } else {
                throw new Error("Gagal mengirim pekerjaan");
            }
        } catch (error: any) {
            console.error("Delivery error:", error);
            toast.error(error.message || "Terjadi kesalahan saat mengirim hasil kerja");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white relative">
                    <div className="text-center w-full pr-6">
                        <h3 className="text-base font-bold text-gray-900">Kirim hasil pekerjaan</h3>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">Order: {offer.order_code}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3.5 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Work URL */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-gray-700">Tautan Hasil Kerja</label>
                        <input
                            type="url"
                            placeholder="Masukkan link (Google Drive, Dropbox, dll)"
                            value={workUrl}
                            onChange={(e) => setWorkUrl(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-700"
                        />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        <div className="h-px flex-1 bg-gray-100"></div>
                        <span>Atau</span>
                        <div className="h-px flex-1 bg-gray-100"></div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-3">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[13px] font-bold text-gray-700">Unggah File</label>
                            <p className="text-[11px] text-gray-400 font-medium">
                                Saran: ZIP/RAR jika banyak file (Max 10 file, @25MB)
                            </p>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <p className="text-xs font-semibold text-gray-500">Klik untuk pilih file</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar scrollbar-thin scrollbar-thumb-gray-200">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="p-1.5 bg-white rounded text-blue-500 shadow-sm shrink-0 border border-gray-50">
                                                <File size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[12px] font-semibold text-gray-800 truncate leading-none mb-0.5">{file.name}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="space-y-3 pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-blue-600 checked:bg-blue-600"
                                />
                                <CheckCircle2 size={10} className="pointer-events-none absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-[12px] font-bold text-gray-600 select-none">Saya menyetujui syarat & ketentuan pengiriman</span>
                        </label>

                        <div className="p-3 bg-gray-50 rounded-xl text-[10px] leading-relaxed text-gray-500 border border-gray-100 h-20 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-gray-200">
                            <ul className="list-disc pl-3.5 space-y-1 font-semibold">
                                <li>Hasil pekerjaan harus sesuai dengan deskripsi kesepakatan pesanan.</li>
                                <li>Gunakan fitur chat untuk pengiriman file tambahan atau revisi.</li>
                                <li>Pesanan selesai otomatis dalam 7 hari jika pembeli tidak merespons.</li>
                                <li>Pastikan tautan dapat diakses dan file tidak rusak.</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {uploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Sedang mengirim...</span>
                            </div>
                        ) : "Kirim Pekerjaan"}
                    </button>
                </form>
            </div>
        </div>
    );
}
