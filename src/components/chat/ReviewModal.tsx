"use client";

import { useState } from "react";
import { Star, Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerId: string;
    orderCode: string;
    onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, offerId, orderCode, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Pilih rating terlebih dahulu");
            return;
        }

        setLoading(true);
        try {
            await apiFetch(`/job-offers/${offerId}/review`, {
                method: "POST",
                body: JSON.stringify({ rating, comment }),
            });

            toast.success("Terima kasih! Review Anda sangat berarti.");
            onSuccess?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Gagal mengirim review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-16 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-primary/10 p-6 sm:p-8 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl -ml-12 -mb-12" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 hover:bg-primary/5 rounded-full transition-colors text-foreground/40"
                >
                    <X size={18} />
                </button>

                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white mb-3 shadow-lg shadow-primary/20">
                        <Star size={20} fill="white" />
                    </div>
                    <h2 className="text-lg font-black text-foreground mb-0.5 italic leading-tight">Beri Rating & Review</h2>
                    <p className="text-foreground/60 text-xs font-medium">
                        Bagaimana pengalaman Anda untuk pesanan <span className="text-primary font-bold">#{orderCode}</span>?
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                className="group transition-transform active:scale-90"
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors duration-200 ${(hover || rating) >= star ? "text-amber-400 fill-amber-400" : "text-gray-200"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Comment box */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest px-2">Komentar Penilaian</label>
                        <textarea
                            className="w-full min-h-[70px] rounded-xl border border-primary/10 bg-primary/[0.02] p-3 text-xs focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-foreground/30"
                            placeholder="Tuliskan feedback Anda..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={16} />
                                Kirim Review
                            </>
                        )}
                    </Button>

                    <p className="text-center text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                        Review Anda sangat membantu kualitas platform
                    </p>
                </div>
            </div>
        </div>
    );
}
