import { JobOffer, Me } from "./types";
import { FileText, Download, ChevronRight } from "lucide-react";

interface OfferMessageProps {
    offer: JobOffer;
    isMine: boolean;
    onViewDetails: () => void;
    onEdit?: () => void;
}

export default function OfferMessage({ offer, isMine, onViewDetails, onEdit }: OfferMessageProps) {
    return (
        <div className={`flex flex-col gap-2 max-w-sm w-full ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            {/* System Bubble */}
            <div className={`p-3 rounded-2xl bg-blue-50 text-xs text-gray-600 flex gap-3 ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                <div className="shrink-0 pt-0.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="leading-relaxed">
                    Freelancer telah memberikan Penawaran Kerja. Tunggu Pemberi Kerja memeriksa Penawaran Kerja dan melakukan pembayaran. (Freelancer dapat mulai bekerja setelah pembayaran dilakukan)
                </div>
            </div>

            {/* Offer Card */}
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-white border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">Penawaran Kerja</h3>
                        <span className="text-blue-600 font-bold">Rp {offer.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3 leading-relaxed">
                        {offer.description}
                    </p>
                    <div className="text-xs text-gray-400">
                        Revisi: {offer.revision_count}x • Estimasi {offer.delivery_date ? new Date(offer.delivery_date).toLocaleDateString() : '-'}
                    </div>
                </div>

                <div className="flex divide-x divide-gray-100">
                    <button
                        onClick={onViewDetails}
                        className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors text-center"
                    >
                        Lihat semua
                    </button>
                    <button
                        onClick={onViewDetails} // Reuse viewer for download button too for now, or ViewOfferModal handles it
                        className="px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    >
                        Unduh <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {isMine && offer.status === 'pending' && (
                <button
                    onClick={onEdit}
                    className="mt-1 px-4 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full hover:bg-yellow-100 transition-colors flex items-center gap-2 mx-auto shadow-sm"
                >
                    <FileText className="w-4 h-4" />
                    Ubah Penawaran Kerja
                </button>
            )}
        </div>
    );
}
