"use client";

import { X, AlertTriangle } from "lucide-react";
import { JobOffer } from "./types";

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    offer: JobOffer;
    loading?: boolean;
}

export default function CancelOrderModal({
    isOpen,
    onClose,
    onConfirm,
    offer,
    loading = false,
}: CancelOrderModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="relative h-24 bg-red-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots-red" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots-red)" />
                        </svg>
                    </div>
                    <div className="relative flex flex-col items-center text-white">
                        <AlertTriangle size={32} />
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Batalkan Pesanan?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Apakah Anda yakin ingin membatalkan pesanan <span className="font-bold text-gray-900">#{offer.order_code}</span>?
                        Data penawaran ini akan dihapus dari histori aktif.
                    </p>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 text-gray-500 text-sm font-bold hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Tidak
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-[2] py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            Ya, Batalkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
