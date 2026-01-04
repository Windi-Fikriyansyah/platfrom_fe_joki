"use client";

import { memo } from "react";
import { FileText, ExternalLink } from "lucide-react";

interface DeliveryMessageProps {
    onViewResult: () => void;
    timestamp: string;
    isOwn: boolean;
    isDisabled?: boolean;
}

const DeliveryMessage = memo(function DeliveryMessage({
    onViewResult,
    timestamp,
    isOwn,
    isDisabled = false,
}: DeliveryMessageProps) {
    return (
        <div className={`flex flex-col my-4 space-y-1 max-w-[85%] ${isOwn ? 'items-end ml-auto' : 'items-start mr-auto'} ${isDisabled ? 'opacity-40 grayscale-[0.5]' : ''}`}>
            <div className={`bg-white border shadow-sm rounded-2xl overflow-hidden w-full ${isOwn ? 'border-blue-100' : 'border-gray-100'}`}>
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                            {isDisabled ? "Hasil pekerjaan ini sudah kadaluarsa (Telah diupdate)" : "Freelancer mengirimkan pekerjaan untuk ditinjau dan disetujui."}
                        </h4>
                        {!isDisabled && (
                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                                Pembeli dapat meminta revisi dalam kurun waktu 7 hari. Jika tidak ada respon dalam jangka waktu yang ditentukan, sistem akan secara otomatis menyelesaikan pesanan.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onViewResult}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 text-[13px] rounded-xl transition-all shadow-sm font-bold ${isDisabled
                            ? 'cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100'
                            : 'hover:border-blue-500 hover:bg-blue-50 text-blue-600 active:scale-[0.98]'
                            }`}
                    >
                        <FileText size={16} />
                        <span>{isDisabled ? "Hasil Lama" : "Lihat hasil akhir"}</span>
                    </button>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mx-1">
                {timestamp} {isDisabled && "• Kadaluarsa"}
            </span>
        </div>
    );
});

export default DeliveryMessage;
