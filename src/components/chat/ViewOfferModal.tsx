"use client";

import { useState } from "react";
import { X, Calendar, CheckCircle2, ChevronRight, ChevronLeft, Download, FileText } from "lucide-react";
import { JobOffer } from "./types";

interface ViewOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: JobOffer | null;
    isFreelancer: boolean; // To show/hide fee details
}

type Tab = "overview" | "details";

export default function ViewOfferModal({
    isOpen,
    onClose,
    offer,
    isFreelancer,
}: ViewOfferModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    if (!isOpen || !offer) return null;

    const platformFee = Math.floor(offer.price * 0.1);
    const netAmount = offer.price - platformFee;

    const handleDownload = async () => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("PENAWARAN KERJA", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Order ID: ${offer.order_code}`, 20, 30);
        doc.text(`Tanggal: ${new Date(offer.created_at).toLocaleDateString("id-ID")}`, 20, 35);

        // Line
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 40, 190, 40);

        // Title & Price
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(offer.title, 20, 50);

        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235); // Blue
        doc.text(`Rp ${offer.price.toLocaleString("id-ID")}`, 190, 50, { align: "right" });

        // Status Badge (Visual representation)
        doc.setFillColor(240, 240, 240);
        const statusWidth = doc.getTextWidth(offer.status.toUpperCase()) + 10;
        doc.roundedRect(20, 60, statusWidth, 8, 2, 2, "F");
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text(offer.status.toUpperCase(), 25, 65.5);

        // Description
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const splitDesc = doc.splitTextToSize(offer.description, 170);
        doc.text(splitDesc, 20, 80);

        let yPos = 80 + (splitDesc.length * 5) + 10;

        // Details Box
        doc.setFillColor(249, 250, 251); // Gray-50
        doc.rect(20, yPos, 170, 70, "F");

        const detailsStart = yPos + 10;
        doc.setFontSize(10);

        const addDetailRow = (label: string, value: string, y: number) => {
            doc.setTextColor(100, 100, 100);
            doc.text(label, 25, y);
            doc.setTextColor(0, 0, 0);
            doc.text(value, 90, y);
        };

        addDetailRow("Jumlah Revisi", `${offer.revision_count} Kali`, detailsStart);
        addDetailRow("Tanggal Mulai", offer.start_date ? new Date(offer.start_date).toLocaleDateString("id-ID") : "-", detailsStart + 10);
        addDetailRow("Target Pengiriman", offer.delivery_date ? new Date(offer.delivery_date).toLocaleDateString("id-ID") : "-", detailsStart + 20);
        addDetailRow("Format Pengiriman", offer.delivery_format || "-", detailsStart + 30);

        // Notes
        doc.setTextColor(100, 100, 100);
        doc.text("Catatan:", 25, detailsStart + 45);
        doc.setTextColor(0, 0, 0);
        const splitNotes = doc.splitTextToSize(offer.notes || "-", 100);
        doc.text(splitNotes, 90, detailsStart + 45);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Dokumen ini dibuat otomatis oleh sistem Jokiin.", 105, 280, { align: "center" });

        doc.save(`Offer-${offer.order_code}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Detail Penawaran</h2>
                        <p className="text-xs text-gray-500">Order ID : {offer.order_code}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "overview"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Ringkasan
                    </button>
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "details"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Detail Lengkap
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${offer.status === "pending" ? "bg-orange-100 text-orange-700" :
                                        offer.status === "paid" ? "bg-green-100 text-green-700" :
                                            offer.status === "working" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                    }`}>
                                    {offer.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
                                <h3 className="font-bold text-gray-900">{offer.title}</h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{offer.description}</p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm py-2 border-b">
                                    <span className="text-gray-600">Harga Pekerjaan</span>
                                    <span className="font-bold text-gray-900">Rp {offer.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs text-gray-500 block mb-1">Tanggal Mulai</label>
                                    <p className="font-medium text-sm text-gray-900">{offer.start_date ? new Date(offer.start_date).toLocaleDateString("id-ID") : "-"}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs text-gray-500 block mb-1">Target Pengiriman</label>
                                    <p className="font-medium text-sm text-gray-900">{offer.delivery_date ? new Date(offer.delivery_date).toLocaleDateString("id-ID") : "-"}</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <label className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Revisi</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        <span className="text-gray-900">{offer.revision_count} Kali</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Format Pengiriman</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        <span className="text-gray-900">{offer.delivery_format || "-"}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-500 block mb-1 text-xs uppercase font-bold tracking-wider">Catatan</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{offer.notes || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Unduh PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
