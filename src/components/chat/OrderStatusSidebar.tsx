import { JobOffer } from "./types";
import { CheckCircle2, Circle, Clock, Package, DollarSign, FileText } from "lucide-react";

interface OrderStatusSidebarProps {
    offers: JobOffer[];
    isLoading: boolean;
    isFreelancer: boolean;
    onEdit: (offer: JobOffer) => void;
}

export default function OrderStatusSidebar({ offers, isLoading, isFreelancer, onEdit }: OrderStatusSidebarProps) {
    // If no offers, show placeholder or empty state
    // But usually this sidebar is shown when there's an active order.
    // We'll show the latest offer.

    if (isLoading) {
        return <div className="w-80 border-l bg-white p-4">Loading...</div>;
    }

    const activeOffer = offers[0]; // Assuming sorted DESC

    if (!activeOffer) {
        return (
            <div className="w-80 border-l bg-white p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">Belum ada pesanan</h3>
                <p className="text-sm text-gray-500">
                    Buat penawaran kerja untuk memulai pesanan dengan klien.
                </p>
            </div>
        );
    }

    const steps = [
        { id: "pending", label: "Menunggu Pembayaran", icon: DollarSign },
        { id: "paid", label: "Order Dibuat", icon: FileText, subtext: "Hari ini Penawaran terkirim" },
        { id: "working", label: "Pembayaran", icon: CheckCircle2 },
        { id: "delivered", label: "Bekerja", icon: Clock },
        { id: "completed", label: "Tinjauan", icon: CheckCircle2 },
        { id: "closed", label: "Selesai", icon: CheckCircle2 },
    ];

    // Logic to determine active step based on status
    // Simplified for now
    const currentStepIdx = 1; // "Order Dibuat" roughly maps to pending/paid

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b">
                <h3 className="font-bold text-gray-900">Status Order</h3>
            </div>

            <div className="p-4 space-y-6">
                {/* Waiting for Payment */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Menunggu Pembayaran</h4>
                    <p className="text-xs text-gray-500 mb-3">
                        Menunggu Pemberi Kerja untuk memeriksa Penawaran Kerja dan melakukan pembayaran.
                    </p>
                    {isFreelancer && activeOffer.status === 'pending' && (
                        <button
                            onClick={() => onEdit(activeOffer)}
                            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ubah Penawaran Kerja
                        </button>
                    )}
                </div>

                {/* Timeline */}
                <div className="relative pl-2">
                    {/* Line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6 relative">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex gap-3">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${idx <= currentStepIdx
                                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-white"
                                    : "bg-white border-2 border-gray-300 text-gray-300"
                                    }`}>
                                    <step.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${idx <= currentStepIdx ? "text-blue-600" : "text-gray-400"}`}>
                                        {step.label}
                                    </p>
                                    {step.subtext && (
                                        <p className="text-xs text-gray-500 mt-0.5">{step.subtext}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="pt-4 border-t mt-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {activeOffer.freelancer?.name?.charAt(0) || "F"}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{activeOffer.freelancer?.name || "Freelancer"}</p>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified Email</span>
                        </div>
                    </div>

                    <div className="border rounded-lg p-3 bg-white space-y-3">
                        <div className="flex gap-3">
                            <div className="w-16 h-12 bg-gray-100 rounded-md shrink-0"></div>
                            <div>
                                <p className="text-xs font-medium text-gray-900 line-clamp-2">{activeOffer.title}</p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    {activeOffer.description.substring(0, 50)}...
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs border-t pt-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Penawaran Kerja</span>
                                <span className="font-medium">{activeOffer.price.toLocaleString()} IDR</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Order Code</span>
                                <span className="font-medium font-mono">{activeOffer.order_code}</span>
                            </div>
                            <div className="flex justify-between text-yellow-600">
                                <span>Pembayaran</span>
                                <span>Menunggu pembayaran</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tanggal Pengiriman</span>
                                <span className="font-medium">{activeOffer.delivery_date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
