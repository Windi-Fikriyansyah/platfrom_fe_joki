"use client";

import { memo } from "react";
import { RotateCw, FileSearch } from "lucide-react";

interface RevisionMessageProps {
    reason: string;
    timestamp: string;
    isOwn: boolean;
    onViewRevision?: () => void;
}

const RevisionMessage = memo(function RevisionMessage({
    reason,
    timestamp,
    isOwn,
    onViewRevision,
}: RevisionMessageProps) {
    return (
        <div className={`flex flex-col my-4 space-y-1 max-w-[85%] ${isOwn ? 'items-end ml-auto' : 'items-start mr-auto'}`}>
            <div className={`bg-white border shadow-sm rounded-2xl overflow-hidden w-full ${isOwn ? 'border-amber-100' : 'border-gray-100'}`}>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                            <RotateCw size={20} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                                Permintaan Revisi
                            </h4>
                            <p className="text-[11px] text-gray-400 font-medium">
                                Freelancer sedang mengerjakan revisi ini
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-100/50">
                        <div className="flex items-start gap-2">
                            <FileSearch size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[12px] text-gray-700 leading-relaxed font-semibold line-clamp-2">
                                {reason}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={onViewRevision}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 hover:border-amber-500 hover:bg-amber-50 text-amber-600 font-bold text-xs rounded-xl transition-all active:scale-[0.98] shadow-sm"
                        >
                            <FileSearch size={16} />
                            <span>Lihat Revisi</span>
                        </button>

                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 border border-gray-100 text-amber-600 font-bold text-[11px] rounded-lg tracking-wide uppercase">
                            <span>Menunggu Perbaikan</span>
                        </div>
                    </div>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mx-1">{timestamp}</span>
        </div>
    );
});

export default RevisionMessage;
