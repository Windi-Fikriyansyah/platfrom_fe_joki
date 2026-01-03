"use client";

import { X, FileText } from "lucide-react";

interface ViewRevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    orderCode?: string;
}

export default function ViewRevisionModal({
    isOpen,
    onClose,
    reason,
    orderCode,
}: ViewRevisionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white relative">
                    <div className="text-center w-full pr-6">
                        <h3 className="text-base font-bold text-gray-900">Detail Revisi</h3>
                        {orderCode && (
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">Order: {orderCode}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3.5 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Instruksi Pembeli</label>
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                                {reason}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
