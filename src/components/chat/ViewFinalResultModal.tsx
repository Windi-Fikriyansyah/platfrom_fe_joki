"use client";

import { X, ExternalLink, Download, FileText, Link as LinkIcon } from "lucide-react";
import { JobOffer } from "./types";

interface ViewFinalResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: JobOffer | null;
}

export default function ViewFinalResultModal({
    isOpen,
    onClose,
    offer,
}: ViewFinalResultModalProps) {
    if (!isOpen || !offer) return null;

    let files: string[] = [];
    try {
        if (offer.work_delivery_files) {
            files = JSON.parse(offer.work_delivery_files) || [];
        }
    } catch (e) {
        console.error("Failed to parse delivery files", e);
    }

    const fileCount = Array.isArray(files) ? files.length : 0;

    const getFileName = (url: string) => {
        return url.split('/').pop() || "downloaded-file";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Hasil Akhir Pekerjaan</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Work URL */}
                    {offer.work_delivery_link && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tautan Hasil Kerja</label>
                            <a
                                href={offer.work_delivery_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl group hover:bg-blue-100/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                        <LinkIcon size={18} />
                                    </div>
                                    <span className="text-sm font-semibold text-blue-700 truncate max-w-[300px]">
                                        {offer.work_delivery_link}
                                    </span>
                                </div>
                                <ExternalLink size={16} className="text-blue-400 group-hover:text-blue-600" />
                            </a>
                        </div>
                    )}

                    {/* Files */}
                    {fileCount > 0 && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">File Terlampir ({fileCount})</label>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {files.map((fileUrl, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl group hover:border-gray-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[250px]">
                                                {getFileName(fileUrl)}
                                            </span>
                                        </div>
                                        <a
                                            href={fileUrl}
                                            download
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!offer.work_delivery_link && fileCount === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 italic">Tidak ada lampiran pekerjaan.</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
