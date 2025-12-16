"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import ImageEditModal, { ImageTransform } from "@/components/ImageEditModal";
import {
  Trash2,
  Eye,
  Package,
  FolderOpen,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const BASE = API.replace("/api", "");

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  pos: { x: 0, y: 0 },
  flipH: false,
  flipV: false,
};

type ApiResp<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type FreelancerProfile = {
  system_name?: string;
  photo_url?: string;
};

type ViewMode = "main" | "visibility" | "packages" | "portfolio";

type PortfolioItem = {
  id: number;
  preview: string;
  description: string;
  file?: File;
  fileName: string;
};

type ProductPackage = {
  title?: string;
  description?: string;
  delivery_days?: number;
  revisions?: number;
  price?: number;
  benefits?: string[];
};

type ProductFromApi = {
  id: number | string;
  title?: string;
  category?: string;
  base_price?: number;
  visibility_description?: string;
  cover_url?: string;
  cover_transform?: ImageTransform;

  packages?: {
    basic?: ProductPackage;
    standard?: ProductPackage;
    premium?: ProductPackage;
  };

  portfolio?: {
    video_url?: string;
    images?: {
      file_name: string;
      description: string;
    }[];
  };

  status?: string;
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id ?? "") as string;
  const { showToast } = useToast();

  const inputCoverRef = useRef<HTMLInputElement | null>(null);
  const portfolioInputRef = useRef<HTMLInputElement | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("main");

  const [systemName, setSystemName] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [originalCoverPreview, setOriginalCoverPreview] = useState<
    string | null
  >(null);
  const [coverTransform, setCoverTransform] =
    useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("");

  // form fields
  const [title, setTitle] = useState("");
  const [kategori, setSubcategory] = useState("");
  const [priceDigits, setPriceDigits] = useState(""); // "1500000" dsb

  // visibility / deskripsi
  const [description, setDescription] = useState("");
  const MAX_DESC = 5000;

  // paket
  const [packagesNote, setPackagesNote] = useState("");
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

  // portfolio
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioVideoUrl, setPortfolioVideoUrl] = useState("");
  const MAX_PORTFOLIO_IMAGES = 30;

  const [saving, setSaving] = useState(false);

  // ========= HELPERS =========
  function buildPackagesNote() {
    const prices = [
      { label: basicTitle || "Basic", digits: basicPriceDigits },
      { label: standardTitle || "Standard", digits: standardPriceDigits },
      { label: premiumTitle || "Premium", digits: premiumPriceDigits },
    ].filter((p) => p.digits && Number(p.digits) > 0);

    if (!prices.length) return "";

    const min = prices.reduce(
      (acc, p) => {
        const v = Number(p.digits);
        return v < acc.value ? { label: p.label, value: v } : acc;
      },
      { label: prices[0].label, value: Number(prices[0].digits) }
    );

    return `${prices.length} paket aktif, mulai dari Rp ${formatRupiahDigits(
      String(min.value)
    )}`;
  }

  function computePackagesNoteFromProduct(p: ProductFromApi): string {
    const pkg = p.packages;
    if (!pkg) return "";

    const prices = [
      {
        label: pkg.basic?.title || "Basic",
        digits: pkg.basic?.price ? String(pkg.basic.price) : "",
      },
      {
        label: pkg.standard?.title || "Standard",
        digits: pkg.standard?.price ? String(pkg.standard.price) : "",
      },
      {
        label: pkg.premium?.title || "Premium",
        digits: pkg.premium?.price ? String(pkg.premium.price) : "",
      },
    ].filter((p) => p.digits && Number(p.digits) > 0);

    if (!prices.length) return "";

    const min = prices.reduce(
      (acc, p) => {
        const v = Number(p.digits);
        return v < acc.value ? { label: p.label, value: v } : acc;
      },
      { label: prices[0].label, value: Number(prices[0].digits) }
    );

    return `${prices.length} paket aktif, mulai dari Rp ${formatRupiahDigits(
      String(min.value)
    )}`;
  }

  function revokeIfBlob(url: string | null) {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  // style transform untuk img
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

  // ========= EFFECTS =========

  // scroll ke atas kalau ganti view
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [viewMode]);

  // ambil profil freelancer
  useEffect(() => {
    if (!API) return;

    (async () => {
      try {
        const resp = await fetch(`${API}/freelancer/profile/me`, {
          method: "GET",
          credentials: "include",
        });

        const data: ApiResp<FreelancerProfile> = await resp
          .json()
          .catch(() => ({ success: false } as any));

        if (resp.ok && data.success && data.data) {
          if (data.data.system_name) {
            setSystemName(data.data.system_name);
          }
          if (data.data.photo_url) {
            setPhotoUrl(data.data.photo_url);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil profil freelancer:", err);
      }
    })();
  }, []);

  // ambil data produk untuk EDIT
  useEffect(() => {
    if (!API || !id) return;

    (async () => {
      try {
        const resp = await fetch(`${API}/freelancer/products/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data: ApiResp<ProductFromApi> = await resp
          .json()
          .catch(() => ({ success: false } as any));

        if (!resp.ok || !data?.success || !data.data) {
          console.error("Gagal load product", data?.message);
          return;
        }

        const p = data.data;

        // field utama
        setTitle(p.title || "");
        setSubcategory(p.category || "");
        setPriceDigits(p.base_price ? String(p.base_price) : "");

        setDescription(p.visibility_description || "");

        // cover
        if (p.cover_url) {
          setCoverUrl(p.cover_url);
          setCoverPreview(p.cover_url);
          setOriginalCoverPreview(p.cover_url);
        }
        if (p.cover_transform) {
          setCoverTransform(p.cover_transform);
        }

        const pkg = p.packages;

        if (pkg?.basic) {
          setBasicTitle(pkg.basic.title || "Basic");
          setBasicDesc(pkg.basic.description || "");
          setBasicDelivery(
            pkg.basic.delivery_days ? String(pkg.basic.delivery_days) : ""
          );
          setBasicRevisions(
            pkg.basic.revisions ? String(pkg.basic.revisions) : ""
          );
          setBasicPriceDigits(pkg.basic.price ? String(pkg.basic.price) : "");
          setBasicBenefits(
            pkg.basic.benefits?.length ? pkg.basic.benefits : [""]
          );
        }

        if (pkg?.standard) {
          setStandardTitle(pkg.standard.title || "Standard");
          setStandardDesc(pkg.standard.description || "");
          setStandardDelivery(
            pkg.standard.delivery_days ? String(pkg.standard.delivery_days) : ""
          );
          setStandardRevisions(
            pkg.standard.revisions ? String(pkg.standard.revisions) : ""
          );
          setStandardPriceDigits(
            pkg.standard.price ? String(pkg.standard.price) : ""
          );
          setStandardBenefits(
            pkg.standard.benefits?.length ? pkg.standard.benefits : [""]
          );
        }

        if (pkg?.premium) {
          setPremiumTitle(pkg.premium.title || "Premium");
          setPremiumDesc(pkg.premium.description || "");
          setPremiumDelivery(
            pkg.premium.delivery_days ? String(pkg.premium.delivery_days) : ""
          );
          setPremiumRevisions(
            pkg.premium.revisions ? String(pkg.premium.revisions) : ""
          );
          setPremiumPriceDigits(
            pkg.premium.price ? String(pkg.premium.price) : ""
          );
          setPremiumBenefits(
            pkg.premium.benefits?.length ? pkg.premium.benefits : [""]
          );
        }

        // ================ PORTFOLIO ================
        if (Array.isArray(p.portfolio?.images)) {
          setPortfolioItems(
            p.portfolio.images.map((img) => ({
              id: Date.now() + Math.random(),
              preview: img.file_name,
              fileName: img.file_name,
              description: img.description,
            }))
          );
        }

        setPortfolioVideoUrl(p.portfolio?.video_url || "");

        // ringkasan paket
        setPackagesNote(computePackagesNoteFromProduct(p));
      } catch (err) {
        console.error("Gagal load product", err);
      }
    })();
  }, [id]);

  // ========= HANDLERS =========

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

    // kosongkan coverUrl supaya upload baru saat menyimpan
    setCoverUrl("");
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
    setCoverUrl("");

    if (inputCoverRef.current) inputCoverRef.current.value = "";
  }

  function handlePortfolioFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setPortfolioItems((prev) => {
      const next: PortfolioItem[] = [...prev];
      for (const f of files) {
        if (next.length >= MAX_PORTFOLIO_IMAGES) break;
        const url = URL.createObjectURL(f);
        next.push({
          id: Date.now() + Math.random(),
          preview: url,
          description: "",
          file: f,
        });
      }
      return next;
    });

    if (e.target) e.target.value = "";
  }

  function removePortfolioItem(id: number) {
    setPortfolioItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) revokeIfBlob(found.preview);
      return prev.filter((p) => p.id !== id);
    });
  }

  function updatePortfolioDescription(id: number, value: string) {
    setPortfolioItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description: value } : p))
    );
  }

  async function uploadCoverIfNeeded(): Promise<string> {
    // kalau tidak ada file baru, pakai url sekarang (entah dari DB atau sebelumnya)
    if (!coverFile) return coverUrl;

    const fd = new FormData();
    fd.append("cover", coverFile);

    const resp = await fetch(`${API}/freelancer/products/cover`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok || !data?.success || !data?.url) {
      throw new Error(data?.message || "Gagal mengupload cover");
    }

    setCoverUrl(data.url as string);
    return data.url as string;
  }

  async function uploadPortfolioImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("image", file);

    const resp = await fetch(`${API}/freelancer/products/portfolio/image`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const data = await resp.json();
    if (!resp.ok || !data?.success) {
      throw new Error(data?.message || "Upload portofolio gagal");
    }

    return data.url;
  }

  async function updateProduct() {
    if (!title.trim() || !kategori.trim()) {
      showToast("Judul dan kategori wajib diisi.", "danger");
      return;
    }

    const finalCoverUrl = await uploadCoverIfNeeded();

    // bersihkan angka
    const basePriceNum = Number(onlyDigits(priceDigits) || "0");

    const basicPriceNum = Number(onlyDigits(basicPriceDigits) || "0");
    const standardPriceNum = Number(onlyDigits(standardPriceDigits) || "0");
    const premiumPriceNum = Number(onlyDigits(premiumPriceDigits) || "0");

    const basicDeliveryNum = Number(onlyDigits(basicDelivery) || "0");
    const standardDeliveryNum = Number(onlyDigits(standardDelivery) || "0");
    const premiumDeliveryNum = Number(onlyDigits(premiumDelivery) || "0");

    const basicRevisionsNum = Number(onlyDigits(basicRevisions) || "0");
    const standardRevisionsNum = Number(onlyDigits(standardRevisions) || "0");
    const premiumRevisionsNum = Number(onlyDigits(premiumRevisions) || "0");
    const portfolioImagesPayload = [];

    for (const item of portfolioItems) {
      let fileName = item.fileName;

      if (item.file && !fileName) {
        fileName = await uploadPortfolioImage(item.file);
      }

      if (fileName) {
        portfolioImagesPayload.push({
          file_name: fileName,
          description: item.description.trim(),
        });
      }
    }

    const cleanBasicBenefits = basicBenefits
      .map((b) => b.trim())
      .filter(Boolean);
    const cleanStandardBenefits = standardBenefits
      .map((b) => b.trim())
      .filter(Boolean);
    const cleanPremiumBenefits = premiumBenefits
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category: kategori,
      base_price: basePriceNum,
      visibility_description: description.trim(),
      cover_url: finalCoverUrl,
      cover_transform: coverTransform,

      basic: {
        title: (basicTitle || "Basic").trim(),
        description: basicDesc.trim(),
        delivery_days: basicDeliveryNum,
        revisions: basicRevisionsNum,
        price: basicPriceNum,
        benefits: cleanBasicBenefits,
      },
      standard: {
        title: (standardTitle || "Standard").trim(),
        description: standardDesc.trim(),
        delivery_days: standardDeliveryNum,
        revisions: standardRevisionsNum,
        price: standardPriceNum,
        benefits: cleanStandardBenefits,
      },
      premium: {
        title: (premiumTitle || "Premium").trim(),
        description: premiumDesc.trim(),
        delivery_days: premiumDeliveryNum,
        revisions: premiumRevisionsNum,
        price: premiumPriceNum,
        benefits: cleanPremiumBenefits,
      },

      portfolio_video_url: portfolioVideoUrl.trim(),
      portfolio_images: portfolioImagesPayload,
    };

    try {
      setSaving(true);

      const resp = await fetch(`${API}/freelancer/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResp<unknown> = await resp.json().catch(() => null);

      if (!resp.ok || !data?.success) {
        throw new Error(data?.message || "Gagal memperbarui produk");
      }

      showToast("Produk berhasil diperbarui.", "success");
      router.push("/freelancer/dashboard/product");
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.message || "Terjadi kesalahan saat memperbarui produk",
        "danger"
      );
    } finally {
      setSaving(false);
    }
  }

  // ========= VIEW: VISIBILITY =========
  if (viewMode === "visibility") {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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

  // ========= VIEW: PACKAGES =========
  if (viewMode === "packages") {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                    onClick={() => {
                      const note = buildPackagesNote();
                      setPackagesNote(note);
                      setViewMode("main");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Simpan & Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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

  // ========= VIEW: PORTFOLIO =========
  if (viewMode === "portfolio") {
    const imageCount = portfolioItems.length;

    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("main")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
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
                <div>
                  <h1 className="mt-1 text-xl font-bold text-gray-900">
                    Album Portofolio
                  </h1>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Portofolio</div>
                  <div className="text-xs text-gray-500">
                    Pilih gambar yang mewakili pekerjaan Anda. Gambar tersebut
                    akan ditampilkan pada produk pekerjaan Anda.
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-800">
                    Gambar ({imageCount} / {MAX_PORTFOLIO_IMAGES})
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={portfolioInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePortfolioFiles}
                    />

                    <button
                      type="button"
                      onClick={() => portfolioInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/80">
                        +
                      </span>
                      Upload foto pekerjaan
                    </button>
                  </div>
                </div>

                {imageCount === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl px-6 py-10 text-center text-sm text-gray-500 bg-gray-50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M4 5h16v14H4z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M4 15l4-4 4 4 4-5 4 5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="font-semibold text-gray-700">
                        Belum ada foto portofolio
                      </div>
                      <div className="text-xs text-gray-500 max-w-sm">
                        Upload hingga {MAX_PORTFOLIO_IMAGES} gambar berkualitas
                        tinggi yang menunjukkan hasil pekerjaan terbaik Anda.
                      </div>
                      <button
                        type="button"
                        onClick={() => portfolioInputRef.current?.click()}
                        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Upload foto pekerjaan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-xl overflow-hidden bg-gray-50"
                      >
                        <div className="relative aspect-[16/10] bg-black/5 overflow-hidden">
                          <img
                            src={item.preview}
                            alt="portfolio-image"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => removePortfolioItem(item.id)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 border-t bg-white">
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updatePortfolioDescription(
                                item.id,
                                e.target.value
                              )
                            }
                            placeholder="Tambahkan deskripsi foto (opsional)"
                            className="w-full text-xs border rounded-lg px-2 py-2 min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Video Portofolio
                  </div>
                  <div className="text-xs text-gray-500">
                    Salin tautan video pekerjaan Anda dari YouTube untuk
                    ditampilkan di halaman produk.
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tautan video
                </label>
                <input
                  type="url"
                  value={portfolioVideoUrl}
                  onChange={(e) => setPortfolioVideoUrl(e.target.value)}
                  placeholder="Masukkan tautan video"
                  className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Contoh: https://www.youtube.com/watch?v=xxxxxxxxxxx
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setViewMode("main")}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Simpan & Kembali
              </button>
            </div>
          </div>
        </div>

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

  // ========= VIEW: MAIN (UTAMA) =========
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link
                  href="/freelancer/dashboard/product"
                  className="text-blue-600 font-semibold"
                >
                  Layanan Saya
                </Link>
                <span className="mx-2 text-gray-400">›</span>
                <span className="font-semibold text-gray-700">
                  Edit Detail Pekerjaan
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-4">
                Edit Detail Pekerjaan
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Foto Cover{" "}
                  <span className="text-xs text-gray-400">
                    (Direkomendasikan 1280x720px)
                  </span>
                </label>

                <div className="flex items-start gap-4">
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
                      Kategori *
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full border px-3 py-2 rounded-md"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Skripsi">Skripsi</option>
                      <option value="Makalah">Makalah</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Coding/IT">Coding/IT</option>
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
                    {/* VISIBILITY */}
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
                            {packagesNote.trim() && (
                              <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                                ✓ {packagesNote}
                              </div>
                            )}
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
                        onClick={() => setViewMode("portfolio")}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Portofolio</div>
                            <div className="text-xs text-gray-500">
                              Unggah contoh pekerjaan atau tautan video.
                            </div>
                            {portfolioItems.length > 0 && (
                              <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                                ✓ {portfolioItems.length} gambar ditambahkan
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 border rounded-md"
                  type="button"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={updateProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW */}
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
                      {kategori || "Kategori"}
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
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={systemName || "Foto profil"}
                        className="h-7 sm:h-8 w-7 sm:w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-7 sm:h-8 w-7 sm:w-8 shrink-0 rounded-full bg-black/10" />
                    )}
                    <div className="leading-tight min-w-0">
                      <div className="font-semibold text-black truncate">
                        {systemName || "Nama Anda"}
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
