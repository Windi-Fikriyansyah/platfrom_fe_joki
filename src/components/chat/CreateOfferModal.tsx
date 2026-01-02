"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Calendar, CheckCircle2, ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { JobOffer, ProductListItem } from "./types";
import { apiFetch } from "@/lib/api";
import { useToast } from "../ToastProvider";

interface CreateOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<JobOffer>;
    onUpdate?: (id: string, data: any) => Promise<void>;
    initialData?: JobOffer | null;
    productTitle?: string;
}

type Step = "price" | "description" | "results" | "review" | "sent";

const STEPS: { id: Step; label: string }[] = [
    { id: "price", label: "Harga" },
    { id: "description", label: "Deskripsi" },
    { id: "results", label: "Hasil Pekerjaan" },
    { id: "review", label: "Tinjauan" },
    { id: "sent", label: "Terkirim" },
];

export default function CreateOfferModal({
    isOpen,
    onClose,
    onSubmit,
    onUpdate,
    initialData,
    productTitle = "Desain Kaos Custom Semaunya Tanpa Batas Revisi",
}: CreateOfferModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>("price");
    const [isLoading, setIsLoading] = useState(false);
    const [createdOffer, setCreatedOffer] = useState<JobOffer | null>(null);
    const { showToast } = useToast();

    const isEdit = !!initialData;

    // Form Data
    const [price, setPrice] = useState<number>(initialData?.price || 0);
    const [title, setTitle] = useState(initialData?.title || productTitle);
    const [description, setDescription] = useState(initialData?.description || "");
    const [revisionCount, setRevisionCount] = useState(initialData?.revision_count || 0);
    const [startDate, setStartDate] = useState(initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "");
    const [deliveryDate, setDeliveryDate] = useState(initialData?.delivery_date ? new Date(initialData.delivery_date).toISOString().split('T')[0] : "");
    const [deliveryFormat, setDeliveryFormat] = useState(initialData?.delivery_format || "");
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [agreed, setAgreed] = useState(false);

    // Products
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | undefined>(initialData?.product_id);

    // Fetch products
    useEffect(() => {
        if (isOpen) {
            apiFetch<{ data: ProductListItem[] }>("/freelancer/products")
                .then(res => setProducts(res.data))
                .catch(err => console.error("Failed to fetch products", err));
        }
    }, [isOpen]);

    // Handle product selection
    const handleProductSelect = (productId: number) => {
        setSelectedProductId(productId);
        const product = products.find(p => p.real_id === productId);
        if (product) {
            setTitle(product.title);
            setPrice(product.base_price);
        }
    };

    // Sync state with initialData when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setPrice(initialData.price);
                setTitle(initialData.title);
                setDescription(initialData.description);
                setRevisionCount(initialData.revision_count);
                // Handle various date formats safely
                try {
                    setStartDate(initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "");
                    setDeliveryDate(initialData.delivery_date ? new Date(initialData.delivery_date).toISOString().split('T')[0] : "");
                } catch (e) {
                    console.error("Date parse error", e);
                }
                try {
                    setStartDate(initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "");
                    setDeliveryDate(initialData.delivery_date ? new Date(initialData.delivery_date).toISOString().split('T')[0] : "");
                } catch (e) {
                    console.error("Date parse error", e);
                }
                setDeliveryFormat(initialData.delivery_format || "");
                setNotes(initialData.notes || "");
                setSelectedProductId(initialData.product_id);
            } else {
                // Reset for Create mode
                setPrice(0);
                setTitle(productTitle);
                setDescription("");
                setRevisionCount(0);
                setStartDate("");
                setDeliveryDate("");
                setDeliveryFormat("");
                setNotes("");
                setSelectedProductId(undefined);
            }
            setCurrentStep("price");
            setAgreed(false);
            setCreatedOffer(null);
        }
    }, [isOpen, initialData, productTitle]);

    // Computed
    const platformFee = Math.floor(price * 0.1);
    const netAmount = price - platformFee;

    // Handlers
    const handleNext = async () => {
        // Validation per step
        if (currentStep === "price") {
            if (!selectedProductId) {
                showToast("Anda harus memilih produk terlebih dahulu", "danger");
                return;
            }
            if (price <= 0) {
                showToast("Harga pekerjaan tidak boleh 0", "danger");
                return;
            }
        } else if (currentStep === "description") {
            if (!title) {
                showToast("Judul pekerjaan harus diisi", "danger");
                return;
            }
            if (!description) {
                showToast("Deskripsi pekerjaan harus diisi", "danger");
                return;
            }
        } else if (currentStep === "results") {
            if (!startDate) {
                showToast("Tanggal mulai harus diisi", "danger");
                return;
            }
            if (!deliveryDate) {
                showToast("Tanggal pengiriman harus diisi", "danger");
                return;
            }
            if (!deliveryFormat) {
                showToast("Format pengiriman harus diisi", "danger");
                return;
            }
        } else if (currentStep === "review") {
            if (!agreed) {
                showToast("Anda harus menyetujui syarat dan ketentuan", "danger");
                return;
            }
        }

        const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
        if (currentIndex < STEPS.length - 1) {
            if (currentStep === "review") {
                // Submit
                setIsLoading(true);
                try {
                    const payload = {
                        product_id: selectedProductId,
                        price,
                        title,
                        description,
                        revision_count: revisionCount,
                        start_date: startDate,
                        delivery_date: deliveryDate,
                        delivery_format: deliveryFormat,
                        notes,
                    };

                    if (isEdit && onUpdate && initialData) {
                        await onUpdate(initialData.id, payload);
                        setCreatedOffer({ ...initialData, ...payload } as any); // Optimistic / simple update for success screen
                    } else {
                        const offer = await onSubmit(payload);
                        setCreatedOffer(offer);
                    }
                    setCurrentStep("sent");
                } catch (error) {
                    console.error("Failed to create/update offer", error);
                    showToast("Gagal menyimpan penawaran", "danger");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setCurrentStep(STEPS[currentIndex + 1].id as Step);
            }
        } else if (currentStep === "sent") {
            onClose();
        }
    };

    const handleBack = () => {
        const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
        if (currentIndex > 0 && currentStep !== "sent") {
            setCurrentStep(STEPS[currentIndex - 1].id as Step);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="text-center w-full">
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Ubah Penawaran" : "Penawaran Kerja"}</h2>
                        {createdOffer ? (
                            <p className="text-xs text-gray-500">Order ID : {createdOffer.order_code}</p>
                        ) : (
                            <p className="text-xs text-gray-400">New Order</p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full absolute right-2 top-3">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="px-6 py-4 bg-gray-50/50">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-0" />

                        {/* Progress Bar */}
                        <div
                            className="absolute left-0 top-1/2 h-0.5 bg-blue-600 transition-all duration-300 -z-0"
                            style={{
                                width: `${(STEPS.findIndex(s => s.id === currentStep) / (STEPS.length - 1)) * 100}%`
                            }}
                        />

                        {STEPS.map((step, idx) => {
                            const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
                            const stepIdx = STEPS.findIndex((s) => s.id === step.id);
                            const isActive = stepIdx <= currentIdx;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-1">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 transition-colors ${isActive
                                            ? "bg-blue-600 border-blue-600 ring-2 ring-blue-100"
                                            : "bg-white border-gray-300"
                                            }`}
                                    />
                                    <span
                                        className={`text-[10px] mt-1 font-medium ${isCurrent ? "text-blue-600" : "text-gray-400"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Step 1: Harga */}
                    {currentStep === "price" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Removed product info block */}

                            {/* Product Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pilih Produk
                                </label>
                                <select
                                    value={selectedProductId || ""}
                                    onChange={(e) => handleProductSelect(Number(e.target.value))}
                                    className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Pilih Produk --</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.real_id}>
                                            {p.title} - Rp {p.base_price.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Memilih produk akan otomatis mengisi Judul dan Harga.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga Pekerjaan
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={price || ""}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">RP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Harga Pekerjaan</span>
                                    <span>{price.toLocaleString()} RP</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Komisi Fastwork</span>
                                    <span className="text-red-500">-{platformFee.toLocaleString()} RP</span>
                                </div>
                                <div className="flex justify-between font-medium text-blue-600 pt-2 border-t">
                                    <span>Anda akan menerima</span>
                                    <span>{netAmount.toLocaleString()} RP</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Deskripsi */}
                    {currentStep === "description" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi Pekerjaan
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Langkah Kerja
                                    <span className="block text-xs font-normal text-gray-500">
                                        Jelaskan langkah-langkah kerja Anda secara detail
                                    </span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: Chat via fastwork untuk mendiskusikan design..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bisa revisi
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={revisionCount}
                                        onChange={(e) => setRevisionCount(Number(e.target.value))}
                                        className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">kali</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Hasil Pekerjaan */}
                    {currentStep === "results" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Mulai
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Pengiriman
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={deliveryDate}
                                            onChange={(e) => setDeliveryDate(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durasi Kerja
                                </label>
                                <p className="text-blue-600 font-medium text-sm">
                                    {startDate && deliveryDate ?
                                        Math.max(0, Math.ceil((new Date(deliveryDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) + " Hari"
                                        : "- Hari"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pengiriman Hasil Kerja
                                </label>
                                <input
                                    type="text"
                                    value={deliveryFormat}
                                    onChange={(e) => setDeliveryFormat(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: File dengan format .pdf .png"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catatan
                                </label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 border px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Deskripsi tambahan"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Tinjauan */}
                    {currentStep === "review" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="font-bold text-gray-900">Penawaran Kerja</h3>
                                    <span className="text-blue-600 font-bold">{price.toLocaleString()} IDR</span>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <p className="font-medium mb-1">{title}</p>
                                    <p className="text-gray-500 line-clamp-3">{description}</p>
                                </div>

                                <div className="flex justify-between text-sm py-2 border-t border-b">
                                    <span className="text-gray-600">Tanggal Pengiriman Hasil Kerja</span>
                                    <span className="font-medium">{deliveryDate}</span>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-100">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <span className="font-bold block text-gray-900 mb-1">Saya menyetujui syarat dan ketentuan ini</span>
                                        <p>• Fastwork akan menggunakan cakupan pekerjaan yang dicantumkan sebagai bukti bila terjadi pembatalan.</p>
                                        <p>• Akun anda akan di banned bila anda menghilang dan tidak dapat dihubungi.</p>
                                        <p>• Fastwork dapat mengakses informasi yang dicantumkan bila diperlukan.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Terkirim */}
                    {currentStep === "sent" && (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-300 py-10">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {isEdit ? "Penawaran Diperbarui!" : "Penawaran Terkirim!"}
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                    {isEdit
                                        ? "Perubahan penawaran kerja Anda telah berhasil disimpan."
                                        : "Penawaran kerja Anda telah berhasil dikirim ke klien. Silakan tunggu konfirmasi pembayaran."}
                                </p>
                            </div>
                            {createdOffer && (
                                <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="text-lg font-mono font-bold text-gray-900">{createdOffer.order_code}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-white flex items-center justify-between gap-4">
                    {currentStep === "sent" ? (
                        <button
                            onClick={onClose}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Tutup
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleBack}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {currentStep === "price" ? "Batalkan" : "Kembali"}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isLoading}
                                className={`flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                                    }`}
                            >
                                {isLoading ? "Mengirim..." : currentStep === "review" ? (isEdit ? "Simpan Perubahan" : "Kirim Penawaran Kerja") : "Berikutnya"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
