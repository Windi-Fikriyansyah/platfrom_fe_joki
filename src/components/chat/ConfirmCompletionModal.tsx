"use client";

import { X, CheckCircle, ShieldCheck, Info } from "lucide-react";
import { JobOffer } from "./types";

interface ConfirmCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    offer: JobOffer;
    loading?: boolean;
}

export default function ConfirmCompletionModal({
    isOpen,
    onClose,
    onConfirm,
    offer,
    loading = false,
}: ConfirmCompletionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header with Background Pattern */}
                <div className="relative h-24 bg-green-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    </div>
                    <div className="relative flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-lg mb-1">
                            <CheckCircle size={28} />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Selesaikan Pesanan?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Pastikan Anda telah menerima hasil kerja dengan baik. Dengan mengonfirmasi, dana sebesar
                        <span className="font-bold text-gray-900 mx-1">Rp {offer.price.toLocaleString()}</span>
                        akan segera diteruskan ke freelancer.
                    </p>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-left">
                            <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-blue-900">Platform Escrow</h4>
                                <p className="text-[11px] text-blue-700/80">Keamanan transaksi Anda terjamin 100%.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-left">
                            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-amber-900">Tindakan Reversibel?</h4>
                                <p className="text-[11px] text-amber-700/80">Setelah dikonfirmasi, Anda tidak dapat mengajukan revisi lagi.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 text-gray-500 text-sm font-bold hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Periksa Lagi
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            Konfirmasi Selesai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
