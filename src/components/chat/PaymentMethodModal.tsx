"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, CreditCard, Wallet, QrCode, Store } from "lucide-react";
import { apiFetch } from "@/lib/api";

type PaymentChannel = {
    group: string;
    code: string;
    name: string;
    type: string;
    total_fee: {
        flat: number | string;
        percent: number | string;
    };
    icon_url: string;
};

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (methodCode: string) => void;
    amount: number;
}

export default function PaymentMethodModal({
    isOpen,
    onClose,
    onSelect,
    amount,
}: PaymentMethodModalProps) {
    const [channels, setChannels] = useState<PaymentChannel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedChannelCode, setSelectedChannelCode] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError("");
            setSelectedChannelCode(null);
            apiFetch<{ data: PaymentChannel[] }>("/payments/channels")
                .then((res) => {
                    if (res.data) {
                        setChannels(res.data);
                    }
                })
                .catch((err) => {
                    console.error("Failed to load payment channels", err);
                    setError("Gagal memuat metode pembayaran");
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Calculate details for selected channel
    const selectedChannel = channels.find(c => c.code === selectedChannelCode);

    let adminFee = 0;
    let totalPayload = amount;

    if (selectedChannel) {
        const flat = typeof selectedChannel.total_fee.flat === 'string' ? parseFloat(selectedChannel.total_fee.flat) : selectedChannel.total_fee.flat;
        const percent = typeof selectedChannel.total_fee.percent === 'string' ? parseFloat(selectedChannel.total_fee.percent) : selectedChannel.total_fee.percent;
        adminFee = flat + (amount * percent / 100);
        totalPayload = amount + adminFee;
    }

    // Group channels by group/type
    const groups: Record<string, PaymentChannel[]> = {};
    channels.forEach((c) => {
        const groupName = c.group || "Lainnya";
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(c);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-800">Pilih Metode Pembayaran</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {loading && (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Payment Detail Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 transition-all duration-300">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Harga Jasa</span>
                            <span>Rp {amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Biaya Layanan</span>
                            <span className={selectedChannel ? "text-gray-900" : "text-gray-400"}>
                                {selectedChannel ? `Rp ${Math.ceil(adminFee).toLocaleString()}` : "-"}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-gray-900">
                            <span>Total Tagihan</span>
                            <span className="text-blue-600 text-lg">
                                {selectedChannel ? `Rp ${Math.ceil(totalPayload).toLocaleString()}` : "-"}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                            * {selectedChannel ? "Biaya admin sudah termasuk dalam total tagihan." : "Pilih metode pembayaran untuk melihat total tagihan."}
                        </p>
                    </div>

                    {!loading && !error && Object.entries(groups).map(([groupName, groupChannels]) => (
                        <div key={groupName}>
                            <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-3 ml-1">
                                {groupName}
                            </h3>
                            <div className="space-y-2">
                                {groupChannels.map((channel) => {
                                    const isSelected = selectedChannelCode === channel.code;
                                    const flat = typeof channel.total_fee.flat === 'string' ? parseFloat(channel.total_fee.flat) : channel.total_fee.flat;
                                    const percent = typeof channel.total_fee.percent === 'string' ? parseFloat(channel.total_fee.percent) : channel.total_fee.percent;
                                    const fee = flat + (amount * percent / 100);

                                    return (
                                        <button
                                            key={channel.code}
                                            onClick={() => setSelectedChannelCode(channel.code)}
                                            className={`w-full flex items-center gap-4 p-3 border rounded-xl transition-all group text-left relative ${isSelected
                                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="w-12 h-8 bg-white border rounded flex items-center justify-center p-1">
                                                {channel.icon_url ? (
                                                    <img src={channel.icon_url} alt={channel.name} className="max-h-full max-w-full object-contain" />
                                                ) : (
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {channel.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    Biaya layanan: Rp {Math.ceil(fee).toLocaleString()}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t bg-white safe-bottom">
                    <button
                        disabled={!selectedChannelCode}
                        onClick={() => selectedChannelCode && onSelect(selectedChannelCode)}
                        className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2 ${selectedChannelCode
                            ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <span>Bayar Sekarang</span>
                        {selectedChannelCode && <span className="opacity-90">• Rp {Math.ceil(totalPayload).toLocaleString()}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
