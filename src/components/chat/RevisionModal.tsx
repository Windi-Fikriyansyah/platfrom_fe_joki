"use client";

import { useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import { JobOffer } from "./types";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface RevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: JobOffer;
    onSuccess: (updatedOffer: JobOffer) => void;
}

export default function RevisionModal({
    isOpen,
    onClose,
    offer,
    onSuccess,
}: RevisionModalProps) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error("Harap masukkan alasan atau instruksi revisi");
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch<{ success: boolean; data: JobOffer }>(
                `/job-offers/${offer.id}/revision`,
                {
                    method: "POST",
                    body: JSON.stringify({ reason }),
                }
            );

            if (res.success) {
                toast.success("Permintaan revisi telah dikirim!");
                onSuccess(res.data);
                onClose();
            } else {
                throw new Error("Gagal mengirim revisi");
            }
        } catch (error: any) {
            console.error("Revision error:", error);
            toast.error(error.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white relative">
                    <div className="text-center w-full pr-6">
                        <h3 className="text-base font-bold text-gray-900">Ajukan Revisi ({offer.used_revision_count}/{offer.revision_count})</h3>
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
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                            Instruksi Revisi
                            <AlertCircle size={14} className="text-amber-500" />
                        </label>
                        <textarea
                            placeholder="Jelaskan bagian mana yang perlu diperbaiki atau diubah..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-700 resize-none"
                        />
                        <p className="text-[10px] text-gray-400 font-medium">
                            * Pastikan instruksi yang Anda berikan jelas dan mudah dipahami oleh freelancer.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Send size={16} />
                            )}
                            <span>Kirim Revisi</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
