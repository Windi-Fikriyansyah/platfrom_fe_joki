import { JobOffer } from "./types";
import { CheckCircle2, Circle, Clock, Package, DollarSign, FileText } from "lucide-react";

interface OrderStatusSidebarProps {
    offers: JobOffer[];
    isLoading: boolean;
    isFreelancer: boolean;
    onEdit: (offer: JobOffer) => void;
    onViewResult?: () => void;
}

export default function OrderStatusSidebar({ offers, isLoading, isFreelancer, onEdit, onViewResult }: OrderStatusSidebarProps) {
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

    // Map status to step index
    const statusToStep: Record<string, number> = {
        'pending': 0,
        'paid': 2,    // Skip "Order Dibuat" visual step if we consider paid as step 2 (0-indexed 0,1,2)
        'working': 3,
        'delivered': 4,
        'completed': 5,
        'cancelled': -1
    };

    // Logic to determine active step based on status
    const currentStepIdx = statusToStep[activeOffer.status] ?? 0;

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b">
                <h3 className="font-bold text-gray-900">Status Order</h3>
            </div>

            <div className="p-4 space-y-6">
                {/* Status Banner */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {activeOffer.status === 'pending' ? 'Menunggu Pembayaran' :
                            activeOffer.status === 'paid' ? 'Pembayaran Berhasil' :
                                activeOffer.status === 'working' ? 'Sedang Dikerjakan' :
                                    activeOffer.status === 'delivered' ? 'Pekerjaan Dikirim' :
                                        activeOffer.status === 'completed' ? 'Pesanan Selesai' : 'Status Order'}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                        {activeOffer.status === 'pending' ? 'Menunggu Pemberi Kerja untuk memeriksa Penawaran Kerja dan melakukan pembayaran.' :
                            activeOffer.status === 'paid' ? 'Pembayaran telah diterima. Freelancer dapat mulai bekerja.' :
                                activeOffer.status === 'working' ? 'Freelancer sedang mengerjakan pesanan ini.' :
                                    activeOffer.status === 'delivered' ? 'Pekerjaan telah dikirim. Menunggu konfirmasi atau revisi dari pembeli.' :
                                        activeOffer.status === 'completed' ? 'Pesanan telah selesai. Terima kasih!' : ''}
                    </p>
                    {isFreelancer && activeOffer.status === 'pending' && (
                        <button
                            onClick={() => onEdit(activeOffer)}
                            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ubah Penawaran Kerja
                        </button>
                    )}

                    {(activeOffer.status === "delivered" || activeOffer.status === "completed") && (
                        <button
                            onClick={onViewResult}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-blue-500 text-blue-600 font-bold text-xs rounded-xl transition-all active:scale-[0.98] shadow-sm mt-3"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Lihat hasil akhir</span>
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
                                        {step.id === 'working' && activeOffer.revision_count > 0 && (
                                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                                                Revisi: {activeOffer.used_revision_count}/{activeOffer.revision_count}
                                            </span>
                                        )}
                                    </p>
                                    {step.subtext && (
                                        <p className="text-xs text-gray-500 mt-0.5">{step.subtext}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Card - Show Partner Info */}
                <div className="pt-4 border-t mt-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold ring-2 ring-white">
                            {(isFreelancer ? activeOffer.client?.name : activeOffer.freelancer?.name)?.charAt(0) || (isFreelancer ? "C" : "F")}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {isFreelancer ? activeOffer.client?.name || "Client" : activeOffer.freelancer?.name || "Freelancer"}
                            </p>
                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Verified User</span>
                        </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-3">
                        <div className="flex gap-3">
                            {activeOffer.product?.cover_url ? (
                                <img
                                    src={activeOffer.product.cover_url}
                                    alt={activeOffer.title}
                                    className="w-16 h-12 rounded-lg object-cover shrink-0 shadow-sm border border-white"
                                />
                            ) : (
                                <div className="w-16 h-12 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center border border-gray-100">
                                    <Package className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">{activeOffer.title}</p>
                                <p className="text-[10px] text-gray-500 mt-1 truncate">
                                    {activeOffer.description}
                                </p>
                            </div>
                        </div>



                        <div className="space-y-2 text-xs border-t pt-2 mt-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Penawaran Kerja</span>
                                <span className="font-medium">{activeOffer.price.toLocaleString()} IDR</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Order Code</span>
                                <span className="font-medium font-mono">{activeOffer.order_code}</span>
                            </div>
                            <div className={`flex justify-between ${activeOffer.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                <span>Pembayaran</span>
                                <span>{activeOffer.status === 'pending' ? 'Menunggu pembayaran' :
                                    activeOffer.status === 'paid' ? 'Lunas' : activeOffer.status}</span>
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
