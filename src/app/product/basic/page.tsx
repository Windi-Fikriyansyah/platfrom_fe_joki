"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageEditModal, { ImageTransform } from "@/components/ImageEditModal";
import {
  Trash2,
  Eye,
  Package,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  pos: { x: 0, y: 0 },
  flipH: false,
  flipV: false,
};

function onlyDigits(v: string) {
  return v.replace(/[^\d]/g, "");
}

function formatRupiahDigits(digits: string) {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("id-ID").format(n);
}

type ViewMode = "main" | "visibility" | "packages";

export default function ProductBasicPage() {
  const router = useRouter();
  const inputCoverRef = useRef<HTMLInputElement | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("main");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // original = blob url sumber modal
  const [originalCoverPreview, setOriginalCoverPreview] = useState<
    string | null
  >(null);

  // transform hasil edit
  const [coverTransform, setCoverTransform] =
    useState<ImageTransform>(DEFAULT_TRANSFORM);

  // modal
  const [showCoverModal, setShowCoverModal] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [priceDigits, setPriceDigits] = useState(""); // contoh: "1500000"

  // extra fields
  const [description, setDescription] = useState(""); // <- DESKRIPSI (visibility)
  const MAX_DESC = 5000;

  // accordion states lain (tetap)
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [packagesNote, setPackagesNote] = useState("");
  const [portfolioNote, setPortfolioNote] = useState("");

  // STATE UNTUK HALAMAN INFORMASI PAKET
  const [basicTitle, setBasicTitle] = useState("Basic");
  const [standardTitle, setStandardTitle] = useState("Standard");
  const [premiumTitle, setPremiumTitle] = useState("Premium");

  const [basicDesc, setBasicDesc] = useState("");
  const [standardDesc, setStandardDesc] = useState("");
  const [premiumDesc, setPremiumDesc] = useState("");

  const [basicDelivery, setBasicDelivery] = useState("");
  const [standardDelivery, setStandardDelivery] = useState("");
  const [premiumDelivery, setPremiumDelivery] = useState("");

  const [basicRevisions, setBasicRevisions] = useState("");
  const [standardRevisions, setStandardRevisions] = useState("");
  const [premiumRevisions, setPremiumRevisions] = useState("");

  const [basicPriceDigits, setBasicPriceDigits] = useState("");
  const [standardPriceDigits, setStandardPriceDigits] = useState("");
  const [premiumPriceDigits, setPremiumPriceDigits] = useState("");

  const [basicBenefits, setBasicBenefits] = useState<string[]>([""]);
  const [standardBenefits, setStandardBenefits] = useState<string[]>([""]);
  const [premiumBenefits, setPremiumBenefits] = useState<string[]>([""]);

  useEffect(() => {
    // setiap ganti view (main <-> visibility <-> packages), scroll ke atas
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [viewMode]);

  function revokeIfBlob(url: string | null) {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;

    revokeIfBlob(coverPreview);
    revokeIfBlob(originalCoverPreview);

    setCoverFile(f);

    if (!f) {
      setCoverPreview(null);
      setOriginalCoverPreview(null);
      setCoverTransform(DEFAULT_TRANSFORM);
      return;
    }

    const preview = URL.createObjectURL(f);
    setOriginalCoverPreview(preview);
    setCoverPreview(preview);

    setCoverTransform(DEFAULT_TRANSFORM);
    setShowCoverModal(true);
  }

  function handleSaveImageTransform(t: ImageTransform) {
    setCoverTransform(t);
  }

  function removeCover() {
    revokeIfBlob(coverPreview);
    revokeIfBlob(originalCoverPreview);

    setCoverFile(null);
    setCoverPreview(null);
    setOriginalCoverPreview(null);
    setCoverTransform(DEFAULT_TRANSFORM);

    if (inputCoverRef.current) inputCoverRef.current.value = "";
  }

  // style transform untuk <img> preview (upload box + preview)
  const coverImgStyle: React.CSSProperties = coverPreview
    ? {
        transform: `translate(${coverTransform.pos.x}px, ${
          coverTransform.pos.y
        }px)
          scale(${coverTransform.scale})
          scaleX(${coverTransform.flipH ? -1 : 1})
          scaleY(${coverTransform.flipV ? -1 : 1})`,
        transformOrigin: "center",
        willChange: "transform",
      }
    : {};

  // =========================
  // VIEW: VISIBILITY (DESKRIPSI)
  // =========================
  if (viewMode === "visibility") {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* HEADER DI ATAS DESKRIPSI (ARROW + JUDUL) */}
                <div className="p-5 sm:p-6 border-b">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setViewMode("main")}
                      className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                      aria-label="Kembali"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 18l-6-6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight truncate">
                        Informasi Tambahan
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-gray-700 leading-tight truncate">
                        Meningkatkan Visibilitas Produk
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-HEADER DESKRIPSI */}
                <div className="p-5 sm:p-6 border-b flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M8 8h8M8 12h8M8 16h6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">
                    Deskripsi
                  </div>
                </div>

                {/* CONTENT DESKRIPSI */}
                <div className="p-5 sm:p-6">
                  <div className="text-sm text-gray-700 font-semibold">
                    Jelaskan detail pekerjaan atau layanan Anda.{" "}
                    <span className="text-blue-600 font-semibold">
                      (Petunjuk Judul)
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Tonjolkan kelebihan pekerjaan Anda untuk membantu klien
                    mengambil keputusan.
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value.slice(0, MAX_DESC))
                      }
                      placeholder="Masukkan Deskripsi"
                      className="w-full min-h-[260px] rounded-xl border bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-end">
                      {description.length}/{MAX_DESC}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode("main")}
                      className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("main")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Simpan & Kembali
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        <ImageEditModal
          src={originalCoverPreview || ""}
          open={showCoverModal}
          onClose={() => setShowCoverModal(false)}
          onSave={handleSaveImageTransform}
          initialTransform={coverTransform}
        />
      </>
    );
  }

  // =========================
  // VIEW: INFORMASI PAKET
  // =========================
  if (viewMode === "packages") {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* HEADER */}
              <div className="p-5 sm:p-6 border-b">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("main")}
                    className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                    aria-label="Kembali"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight truncate">
                      Informasi Paket
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-700 leading-tight truncate">
                      Atur opsi paket dan harga layanan Anda
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 sm:p-6">
                <div className="text-sm text-gray-600">
                  Buat paket <span className="font-semibold">Basic</span>,{" "}
                  <span className="font-semibold">Standard</span>, dan{" "}
                  <span className="font-semibold">Premium</span> untuk
                  memberikan pilihan yang jelas kepada klien.
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Sesuaikan harga, durasi pengerjaan, jumlah revisi, deskripsi
                  singkat, dan apa saja yang akan diterima pemberi kerja.
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {/* BASIC */}
                  <div className="border rounded-xl p-4 bg-gray-50/70 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">
                          Paket
                        </div>
                        <input
                          value={basicTitle}
                          onChange={(e) => setBasicTitle(e.target.value)}
                          className="mt-1 w-full border px-2 py-1.5 rounded-md text-sm font-semibold"
                        />
                      </div>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold">
                        Entry
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Cocok untuk kebutuhan dasar dan budget terbatas.
                    </div>

                    <div className="space-y-3">
                      {/* HARGA */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Harga Paket
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            Rp
                          </span>
                          <input
                            inputMode="numeric"
                            value={formatRupiahDigits(basicPriceDigits)}
                            onChange={(e) =>
                              setBasicPriceDigits(onlyDigits(e.target.value))
                            }
                            placeholder="0"
                            className="w-full border px-3 py-2 rounded-md pl-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* DURASI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Durasi Pengerjaan (hari)
                        </label>
                        <input
                          value={basicDelivery}
                          onChange={(e) => setBasicDelivery(e.target.value)}
                          placeholder="Misal: 3"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* REVISI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Jumlah Revisi
                        </label>
                        <input
                          value={basicRevisions}
                          onChange={(e) => setBasicRevisions(e.target.value)}
                          placeholder="Misal: 1"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* DESKRIPSI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Deskripsi Singkat
                        </label>
                        <textarea
                          value={basicDesc}
                          onChange={(e) => setBasicDesc(e.target.value)}
                          placeholder="Jelaskan apa yang didapat di paket Basic."
                          className="w-full border px-3 py-2 rounded-md text-xs min-h-[80px]"
                        />
                      </div>

                      {/* APA YANG AKAN DITERIMA PEMBERI KERJA */}
                      <div className="mt-2 border rounded-lg bg-white">
                        <div className="px-3 py-2 border-b text-[13px] font-semibold text-gray-800">
                          Apa yang akan diterima pemberi kerja
                        </div>
                        <div className="p-3 space-y-2">
                          {basicBenefits.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                            >
                              <span className="text-gray-400 text-lg select-none">
                                ⋮⋮
                              </span>
                              <input
                                value={item}
                                onChange={(e) =>
                                  setBasicBenefits((prev) =>
                                    prev.map((v, i) =>
                                      i === idx ? e.target.value : v
                                    )
                                  )
                                }
                                placeholder="Apa yang akan diterima pemberi kerja"
                                className="flex-1 text-sm bg-transparent outline-none"
                              />
                              {basicBenefits.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setBasicBenefits((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                  aria-label="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              setBasicBenefits((prev) =>
                                prev.length >= 10 ? prev : [...prev, ""]
                              )
                            }
                            disabled={basicBenefits.length >= 10}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 text-xs font-semibold text-blue-600 py-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="text-base leading-none">+</span>
                            <span>
                              Masukan apa yang akan diterima pemberi kerja (
                              {basicBenefits.length}/10)
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STANDARD */}
                  <div className="border rounded-xl p-4 bg-blue-50/70 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">
                          Paket
                        </div>
                        <input
                          value={standardTitle}
                          onChange={(e) => setStandardTitle(e.target.value)}
                          className="mt-1 w-full border px-2 py-1.5 rounded-md text-sm font-semibold"
                        />
                      </div>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-blue-600 text-white font-semibold">
                        Terpopuler
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      Paket seimbang dengan fitur lebih lengkap dan harga
                      kompetitif.
                    </div>

                    <div className="space-y-3">
                      {/* HARGA */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Harga Paket
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            Rp
                          </span>
                          <input
                            inputMode="numeric"
                            value={formatRupiahDigits(standardPriceDigits)}
                            onChange={(e) =>
                              setStandardPriceDigits(onlyDigits(e.target.value))
                            }
                            placeholder="0"
                            className="w-full border px-3 py-2 rounded-md pl-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* DURASI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Durasi Pengerjaan (hari)
                        </label>
                        <input
                          value={standardDelivery}
                          onChange={(e) => setStandardDelivery(e.target.value)}
                          placeholder="Misal: 5"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* REVISI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Jumlah Revisi
                        </label>
                        <input
                          value={standardRevisions}
                          onChange={(e) => setStandardRevisions(e.target.value)}
                          placeholder="Misal: 2"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* DESKRIPSI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Deskripsi Singkat
                        </label>
                        <textarea
                          value={standardDesc}
                          onChange={(e) => setStandardDesc(e.target.value)}
                          placeholder="Jelaskan apa yang didapat di paket Standard."
                          className="w-full border px-3 py-2 rounded-md text-xs min-h-[80px]"
                        />
                      </div>

                      {/* APA YANG AKAN DITERIMA PEMBERI KERJA */}
                      <div className="mt-2 border rounded-lg bg-white">
                        <div className="px-3 py-2 border-b text-[13px] font-semibold text-gray-800">
                          Apa yang akan diterima pemberi kerja
                        </div>
                        <div className="p-3 space-y-2">
                          {standardBenefits.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2"
                            >
                              <span className="text-gray-400 text-lg select-none">
                                ⋮⋮
                              </span>
                              <input
                                value={item}
                                onChange={(e) =>
                                  setStandardBenefits((prev) =>
                                    prev.map((v, i) =>
                                      i === idx ? e.target.value : v
                                    )
                                  )
                                }
                                placeholder="Apa yang akan diterima pemberi kerja"
                                className="flex-1 text-sm bg-transparent outline-none"
                              />
                              {standardBenefits.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStandardBenefits((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                  aria-label="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              setStandardBenefits((prev) =>
                                prev.length >= 10 ? prev : [...prev, ""]
                              )
                            }
                            disabled={standardBenefits.length >= 10}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-white text-xs font-semibold text-blue-700 py-2 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="text-base leading-none">+</span>
                            <span>
                              Masukan apa yang akan diterima pemberi kerja (
                              {standardBenefits.length}/10)
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM */}
                  <div className="border rounded-xl p-4 bg-emerald-50/70 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">
                          Paket
                        </div>
                        <input
                          value={premiumTitle}
                          onChange={(e) => setPremiumTitle(e.target.value)}
                          className="mt-1 w-full border px-2 py-1.5 rounded-md text-sm font-semibold"
                        />
                      </div>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500 text-white font-semibold">
                        Lengkap
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      Paket paling lengkap dengan dukungan dan fitur maksimal.
                    </div>

                    <div className="space-y-3">
                      {/* HARGA */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Harga Paket
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            Rp
                          </span>
                          <input
                            inputMode="numeric"
                            value={formatRupiahDigits(premiumPriceDigits)}
                            onChange={(e) =>
                              setPremiumPriceDigits(onlyDigits(e.target.value))
                            }
                            placeholder="0"
                            className="w-full border px-3 py-2 rounded-md pl-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* DURASI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Durasi Pengerjaan (hari)
                        </label>
                        <input
                          value={premiumDelivery}
                          onChange={(e) => setPremiumDelivery(e.target.value)}
                          placeholder="Misal: 7"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* REVISI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Jumlah Revisi
                        </label>
                        <input
                          value={premiumRevisions}
                          onChange={(e) => setPremiumRevisions(e.target.value)}
                          placeholder="Misal: 3"
                          className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                      </div>

                      {/* DESKRIPSI */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Deskripsi Singkat
                        </label>
                        <textarea
                          value={premiumDesc}
                          onChange={(e) => setPremiumDesc(e.target.value)}
                          placeholder="Jelaskan apa yang didapat di paket Premium."
                          className="w-full border px-3 py-2 rounded-md text-xs min-h-[80px]"
                        />
                      </div>

                      {/* APA YANG AKAN DITERIMA PEMBERI KERJA */}
                      <div className="mt-2 border rounded-lg bg-white">
                        <div className="px-3 py-2 border-b text-[13px] font-semibold text-gray-800">
                          Apa yang akan diterima pemberi kerja
                        </div>
                        <div className="p-3 space-y-2">
                          {premiumBenefits.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2"
                            >
                              <span className="text-gray-400 text-lg select-none">
                                ⋮⋮
                              </span>
                              <input
                                value={item}
                                onChange={(e) =>
                                  setPremiumBenefits((prev) =>
                                    prev.map((v, i) =>
                                      i === idx ? e.target.value : v
                                    )
                                  )
                                }
                                placeholder="Apa yang akan diterima pemberi kerja"
                                className="flex-1 text-sm bg-transparent outline-none"
                              />
                              {premiumBenefits.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPremiumBenefits((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                  aria-label="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              setPremiumBenefits((prev) =>
                                prev.length >= 10 ? prev : [...prev, ""]
                              )
                            }
                            disabled={premiumBenefits.length >= 10}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300 bg-white text-xs font-semibold text-emerald-700 py-2 hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="text-base leading-none">+</span>
                            <span>
                              Masukan apa yang akan diterima pemberi kerja (
                              {premiumBenefits.length}/10)
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode("main")}
                    className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("main")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Simpan & Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        <ImageEditModal
          src={originalCoverPreview || ""}
          open={showCoverModal}
          onClose={() => setShowCoverModal(false)}
          onSave={handleSaveImageTransform}
          initialTransform={coverTransform}
        />
      </>
    );
  }

  // =========================
  // VIEW: MAIN
  // =========================
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Pekerjaan</h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Foto Cover{" "}
                  <span className="text-xs text-gray-400">
                    (Direkomendasikan 1280x720px)
                  </span>
                </label>

                <div className="flex items-start gap-4">
                  {/* BOX PREVIEW */}
                  <label className="group cursor-pointer">
                    <input
                      ref={inputCoverRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />

                    <div
                      className="
                        relative overflow-hidden rounded-xl bg-gray-50 border-2 border-dashed border-gray-200
                        hover:bg-gray-100 transition
                        w-[320px] max-w-full
                      "
                      style={{ aspectRatio: "16/10" }}
                    >
                      {coverPreview ? (
                        <>
                          <img
                            src={coverPreview}
                            alt="cover"
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover select-none"
                            style={coverImgStyle}
                          />

                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowCoverModal(true);
                              }}
                              className="bg-blue-600 text-white rounded-lg px-2 py-1 text-xs hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeCover();
                              }}
                              className="bg-black/60 text-white rounded-lg px-2 py-1 text-xs hover:bg-black/80"
                            >
                              Hapus
                            </button>
                          </div>

                          <div className="absolute bottom-2 left-2 text-[11px] font-semibold text-gray-700 bg-white/90 px-2 py-1 rounded-lg">
                            16:10 (Card Layanan)
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                            />
                            <path
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7l4 4 4-4"
                            />
                          </svg>
                          <div className="mt-2 text-sm font-medium">
                            Upload Foto Cover
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Ukuran tampil: 16:10
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* INFO SAMPING */}
                  <div className="flex-1 text-sm text-gray-600">
                    <div className="font-semibold text-gray-800">Panduan</div>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-gray-500">
                      <li>
                        Preview dibuat sama seperti ukuran card layanan (16:10).
                      </li>
                      <li>
                        Upload 1280×720 tetap oke, nanti akan di-crop sesuai
                        card.
                      </li>
                      <li>Klik “Edit” untuk atur posisi & zoom.</li>
                    </ul>

                    {coverFile && (
                      <div className="mt-3 text-xs text-gray-500">
                        <div>File: {coverFile.name}</div>
                        <div>
                          Ukuran: {Math.round(coverFile.size / 1024)} KB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Pekerjaan *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul pekerjaan"
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>

                {/* SUBCATEGORY + PRICE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subkategori *
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full border px-3 py-2 rounded-md"
                    >
                      <option value="">Pilih subkategori</option>
                      <option value="design">Design</option>
                      <option value="writing">Writing</option>
                      <option value="dev">Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Awal
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        Rp
                      </span>

                      <input
                        inputMode="numeric"
                        value={formatRupiahDigits(priceDigits)}
                        onChange={(e) =>
                          setPriceDigits(onlyDigits(e.target.value))
                        }
                        placeholder="0"
                        className="w-full border px-4 py-2 rounded-md pl-10 pr-20"
                      />

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        Rupiah
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Ketik angka saja. Format Rupiah akan otomatis.
                    </p>
                  </div>
                </div>

                {/* EXTRA INFO */}
                <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-800">
                    Informasi Tambahan
                  </h3>
                  <p className="text-sm text-gray-600">
                    Opsional — tambahkan detail yang membuat pekerjaan Anda
                    lebih menarik.
                  </p>

                  <div className="mt-4 space-y-3">
                    {/* VISIBILITY -> MASUK KE VIEW DESKRIPSI */}
                    <div className="border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setViewMode("visibility")}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Eye className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">
                              Meningkatkan Visibilitas Produk
                            </div>
                            <div className="text-xs text-gray-500">
                              Tambahkan deskripsi agar lebih mudah ditemukan.
                            </div>
                            {description.trim() && (
                              <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                                ✓ Deskripsi sudah diisi
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-gray-400">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </div>

                    {/* PACKAGES */}
                    <div className="border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setViewMode("packages")}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Informasi Paket</div>
                            <div className="text-xs text-gray-500">
                              Tambahkan opsi harga dan hasil.
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </div>

                    {/* PORTFOLIO */}
                    <div className="border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPortfolioOpen((s) => !s)}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Portofolio</div>
                            <div className="text-xs text-gray-500">
                              Unggah contoh pekerjaan atau tautan.
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {portfolioOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      {portfolioOpen && (
                        <div className="p-3 bg-gray-50">
                          <textarea
                            value={portfolioNote}
                            onChange={(e) => setPortfolioNote(e.target.value)}
                            placeholder="Tautan portofolio atau catatan"
                            className="w-full border p-2 rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 border rounded-md"
                >
                  Kembali
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border rounded-md">
                    Simpan Sebagai Draft
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Kirim untuk Ditinjau
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW (CARD) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">
                Preview Pekerjaan
              </h4>

              <div className="group rounded-xl sm:rounded-2xl border bg-white p-3 sm:p-4 shadow-sm">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black/5 relative">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="cover-preview"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover select-none"
                      style={coverImgStyle}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                      Cover preview
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Preview
                  </div>
                </div>

                <div className="mt-2 sm:mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-xs font-semibold text-black/50">
                      {subcategory || "Subkategori"}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs sm:text-sm font-bold">
                      {title || "Judul Pekerjaan Anda"}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-600">
                    ⭐ 5.0
                  </div>
                </div>

                <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-black/60 min-w-0">
                    <span className="h-7 sm:h-8 w-7 sm:w-8 shrink-0 rounded-full bg-black/10" />
                    <div className="leading-tight min-w-0">
                      <div className="font-semibold text-black truncate">
                        Nama Anda
                      </div>
                      <div className="text-[10px] sm:text-xs truncate">
                        Penjual
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] sm:text-xs text-black/50">
                      Mulai dari
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-emerald-600">
                      {priceDigits
                        ? `Rp ${formatRupiahDigits(priceDigits)}`
                        : "Rp —"}
                    </div>
                  </div>
                </div>

                <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs text-black/50">
                  <span>0+ terjual</span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 font-semibold whitespace-nowrap">
                    Baru
                  </span>
                </div>

                <div className="mt-3 sm:mt-4 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-black text-center text-xs sm:text-sm font-semibold text-white leading-9 sm:leading-10 opacity-0 transition group-hover:opacity-100">
                  Lihat Detail
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Preview ini akan terupdate secara langsung saat Anda mengisi
                form.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL */}
      <ImageEditModal
        src={originalCoverPreview || ""}
        open={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        onSave={handleSaveImageTransform}
        initialTransform={coverTransform}
      />
    </>
  );
}
