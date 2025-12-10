"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "";
type OnboardingStatus = "draft" | "pending_review" | "approved" | "rejected";

type Profile = {
  id?: string;
  photo_url?: string;
  system_name?: string;
  freelancer_type?: string;
  about?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  nik?: string;
  ktp_address?: string;
  postal_code?: string;
  kelurahan?: string;
  kecamatan?: string;
  city?: string;
  contact_phone?: string;
  current_address?: string;
  email?: string;
  onboarding_step?: number;
  onboarding_status?: OnboardingStatus;
};

type ApiResp<T> = {
  success: boolean;
  message?: string;
  data?: T;
  missing?: string[];
  errors?: Record<string, string[]>;
};

function safeJoinUrl(base: string, path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export default function ApplyFreelancePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState(1);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [systemName, setSystemName] = useState("");
  const [freelancerType, setFreelancerType] = useState("full_time");
  const [about, setAbout] = useState("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nik, setNik] = useState("");

  const [ktpAddress, setKtpAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [city, setCity] = useState("");

  const [contactPhone, setContactPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [email, setEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedPromo, setAgreedPromo] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  // origin untuk static /uploads (API biasanya .../api)
  const publicOrigin = useMemo(() => API.replace(/\/api\/?$/, ""), []);

  // helper fetch: validasi error bisa status 200 => cek data.success
  async function apiFetch<T>(
    path: string,
    init?: RequestInit
  ): Promise<{ ok: boolean; status: number; data: ApiResp<T> | null }> {
    const res = await fetch(`${API}${path}`, {
      credentials: "include",
      ...init,
    });

    let data: ApiResp<T> | null = null;
    try {
      data = (await res.json()) as ApiResp<T>;
    } catch {
      data = null;
    }

    // Unauthorized / Forbidden tetap dari backend (401/403)
    if (res.status === 401 || res.status === 403) {
      showToast(data?.message || "Sesi habis / tidak punya akses", "danger");
      router.push("/auth/login");
      return { ok: false, status: res.status, data };
    }

    // Untuk kasus validasi error (200 tapi success=false) => ok=false
    const ok = res.ok && !!data?.success;

    return { ok, status: res.status, data };
  }

  useEffect(() => {
    fetchProfile();

    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function redirectByStatus(p: Profile) {
    if (p?.onboarding_status === "pending_review") {
      router.replace("/apply-freelance/pending-review");
      return true;
    }

    // optional (kalau ada alur approved/rejected)
    if (p?.onboarding_status === "approved") {
      router.replace("/freelancer"); // atau dashboard freelancer
      return true;
    }

    if (p?.onboarding_status === "rejected") {
      router.replace("/apply-freelance/rejected"); // halaman info ditolak
      return true;
    }

    return false;
  }

  async function fetchProfile() {
    setLoading(true);
    try {
      const { ok, data } = await apiFetch<Profile>("/freelancer/onboarding");
      if (!ok || !data?.data) {
        showToast(data?.message || "Gagal memuat data onboarding", "danger");
        return;
      }

      const p = data.data;
      if (redirectByStatus(p)) {
        return;
      }
      setProfile(p);

      const s = (p.onboarding_step as number) || 1;
      setStep(s);

      // populate local form values
      setSystemName(p.system_name || "");
      setFreelancerType(p.freelancer_type || "full_time");
      setAbout(p.about || "");

      setFirstName(p.first_name || "");
      setMiddleName(p.middle_name || "");
      setLastName(p.last_name || "");
      setNik(p.nik || "");

      setKtpAddress(p.ktp_address || "");
      setPostalCode(p.postal_code || "");
      setKelurahan(p.kelurahan || "");
      setKecamatan(p.kecamatan || "");
      setCity(p.city || "");

      setContactPhone(p.contact_phone || "");
      setCurrentAddress(p.current_address || "");

      // email (kalau backend belum kirim email di profile, ambil dari /me)
      setEmail(p.email || "");

      // photo preview
      if (p.photo_url) {
        setPhotoPreview(safeJoinUrl(publicOrigin, p.photo_url));
      } else {
        setPhotoPreview(null);
      }

      if (!p.email) {
        try {
          const me = await apiFetch<{
            email?: string;
            data?: { email?: string };
          }>("/me");
          if (me.ok && me.data) {
            const userEmail = me.data.data?.email || me.data.email;
            if (userEmail) {
              setEmail(userEmail);
              setProfile((prev) => ({ ...(prev || {}), email: userEmail }));
            }
          }
        } catch {
          // ignore
        }
      } else {
        setProfile((prev) => ({ ...(prev || {}), email: p.email }));
      }
    } catch {
      showToast("Terjadi kesalahan jaringan saat memuat profil", "danger");
    } finally {
      setLoading(false);
    }
  }

  // Step actions
  async function handleUploadPhoto(): Promise<boolean> {
    if (!photoFile) {
      showToast("Pilih foto terlebih dahulu", "danger");
      return false;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);

      const res = await fetch(`${API}/freelancer/onboarding/photo`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      let data: ApiResp<Profile> | null = null;
      try {
        data = (await res.json()) as ApiResp<Profile>;
      } catch {
        data = null;
      }

      // 401/403 tetap hard fail
      if (res.status === 401 || res.status === 403) {
        showToast(data?.message || "Sesi habis / tidak punya akses", "danger");
        router.push("/auth/login");
        return false;
      }

      // validasi error bisa 200 => cek success
      if (!res.ok || !data?.success) {
        showToast(data?.message || "Gagal upload foto", "danger");
        return false;
      }

      setProfile(data.data || null);

      const uploadedPhotoUrl = data.data?.photo_url;
      if (uploadedPhotoUrl) {
        setPhotoPreview(safeJoinUrl(publicOrigin, uploadedPhotoUrl));
      }

      setPhotoFile(null);
      return true;
    } catch {
      showToast("Terjadi kesalahan saat upload foto", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSave(): Promise<boolean> {
    setLoading(true);
    try {
      const body = { system_name: systemName, freelancer_type: freelancerType };

      const { ok, data } = await apiFetch<Profile>(
        "/freelancer/onboarding/profile",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!ok || !data?.data) {
        showToast(data?.message || "Gagal menyimpan profile", "danger");
        return false;
      }

      setProfile(data.data);
      return true;
    } catch {
      showToast("Terjadi kesalahan saat menyimpan profile", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleAboutSave(): Promise<boolean> {
    setLoading(true);
    try {
      const { ok, data } = await apiFetch<Profile>(
        "/freelancer/onboarding/about",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ about }),
        }
      );

      if (!ok || !data?.data) {
        showToast(data?.message || "Gagal menyimpan about", "danger");
        return false;
      }

      setProfile(data.data);
      return true;
    } catch {
      showToast("Terjadi kesalahan saat menyimpan about", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleIdentitySave(): Promise<boolean> {
    setLoading(true);
    try {
      const body = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        nik,
        ktp_address: ktpAddress,
        postal_code: postalCode,
        kelurahan,
        kecamatan,
        city,
      };

      const { ok, data } = await apiFetch<Profile>(
        "/freelancer/onboarding/identity",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!ok || !data?.data) {
        showToast(data?.message || "Gagal menyimpan identity", "danger");
        return false;
      }

      setProfile(data.data);
      return true;
    } catch {
      showToast("Terjadi kesalahan saat menyimpan identity", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleContactSave(): Promise<boolean> {
    setLoading(true);
    try {
      const body = {
        contact_phone: contactPhone,
        current_address: currentAddress,
      };

      const { ok, data } = await apiFetch<Profile>(
        "/freelancer/onboarding/contact",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!ok || !data?.data) {
        showToast(data?.message || "Gagal menyimpan contact", "danger");
        return false;
      }

      setProfile(data.data);
      setContactPhone(data.data.contact_phone || "");
      setCurrentAddress(data.data.current_address || "");
      return true;
    } catch {
      showToast("Terjadi kesalahan saat menyimpan contact", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleStepSave() {
    // fallback value dari profile
    const hasPhoto = !!photoFile || !!profile?.photo_url;
    const systemNameVal = systemName || (profile?.system_name ?? "");
    const aboutVal = about || (profile?.about ?? "");
    const firstNameVal = firstName || (profile?.first_name ?? "");
    const lastNameVal = lastName || (profile?.last_name ?? "");
    const nikVal = nik || (profile?.nik ?? "");
    const contactPhoneVal = contactPhone || (profile?.contact_phone ?? "");
    const currentAddressVal =
      currentAddress || (profile?.current_address ?? "");

    // Validations
    if (step === 1 && !hasPhoto)
      return showToast("Pilih foto terlebih dahulu", "danger");
    if (step === 2 && !systemNameVal)
      return showToast("Nama sistem diperlukan", "danger");
    if (step === 3 && (aboutVal || "").length < 10)
      return showToast("About minimal 10 karakter", "danger");
    if (step === 4 && (!firstNameVal || !lastNameVal))
      return showToast("Nama lengkap diperlukan", "danger");
    if (step === 4 && (nikVal || "").length !== 16)
      return showToast("NIK harus 16 digit", "danger");
    if (step === 5 && (contactPhoneVal || "").length < 9)
      return showToast("Nomor telepon tidak valid", "danger");
    if (step === 5 && !currentAddressVal)
      return showToast("Alamat saat ini diperlukan", "danger");

    let success = false;

    switch (step) {
      case 1:
        success = photoFile ? await handleUploadPhoto() : true;
        break;
      case 2:
        success =
          systemName && systemName !== profile?.system_name
            ? await handleProfileSave()
            : true;
        break;
      case 3:
        success =
          about && about !== profile?.about ? await handleAboutSave() : true;
        break;
      case 4:
        if (
          firstName !== profile?.first_name ||
          middleName !== profile?.middle_name ||
          lastName !== profile?.last_name ||
          nik !== profile?.nik ||
          ktpAddress !== profile?.ktp_address ||
          postalCode !== profile?.postal_code ||
          kelurahan !== profile?.kelurahan ||
          kecamatan !== profile?.kecamatan ||
          city !== profile?.city
        ) {
          success = await handleIdentitySave();
        } else {
          success = true;
        }
        break;
      case 5:
        if (
          !profile?.contact_phone ||
          !profile?.current_address ||
          contactPhone !== profile?.contact_phone ||
          currentAddress !== profile?.current_address ||
          email !== profile?.email ||
          !profile?.email
        ) {
          success = await handleContactSave();
        } else {
          success = true;
        }
        break;
    }

    if (success && step < 5) setStep((s) => Math.min(5, s + 1));
  }

  async function handleSubmit(): Promise<boolean> {
    setLoading(true);
    try {
      const { ok, data } = await apiFetch<Profile>(
        "/freelancer/onboarding/submit",
        {
          method: "POST",
        }
      );

      if (!ok) {
        // kalau backend kirim missing fields
        if (data?.missing?.length) {
          showToast(`Data belum lengkap: ${data.missing.join(", ")}`, "danger");
        } else {
          showToast(data?.message || "Gagal submit onboarding", "danger");
        }
        return false;
      }

      showToast("Onboarding terkirim, menunggu review", "success");
      const newProfile = (data?.data as Profile) || null;
      setProfile(newProfile);

      if (newProfile?.onboarding_status === "pending_review") {
        router.replace("/apply-freelance/pending-review");
        return true;
      }

      router.push("/freelancer");
      return true;
    } catch {
      showToast("Terjadi kesalahan saat submit", "danger");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalSubmit() {
    const contactMissing = !profile?.contact_phone || !profile?.current_address;
    const contactChanged =
      contactPhone !== profile?.contact_phone ||
      currentAddress !== profile?.current_address ||
      email !== profile?.email;

    if (contactMissing || contactChanged) {
      const ok = await handleContactSave();
      if (!ok) return;
    }

    // show confirmation modal instead of submitting immediately
    setShowConfirmModal(true);
  }

  async function handleConfirmedSubmit() {
    // check that all checkboxes are agreed
    if (!agreedTerms || !agreedPrivacy || !agreedPromo) {
      showToast("Harap setujui semua syarat dan ketentuan", "danger");
      return;
    }

    setShowConfirmModal(false);
    const ok = await handleSubmit();
    if (ok) {
      showToast("Pendaftaran freelancer berhasil!", "success");
      router.push("/apply-freelance/landing");
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">
              Langkah 1 — Upload foto profile (jpg/png, max 2MB)
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <div className="w-40 h-40 bg-linear-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreview}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-300 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="text-xs text-gray-400">
                        Belum ada foto
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full">
                <label
                  htmlFor="photo-upload"
                  className="relative block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-linear-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition cursor-pointer group"
                >
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setPhotoFile(f);

                      // revoke old blob preview
                      setPhotoPreview((prev) => {
                        if (prev?.startsWith("blob:"))
                          URL.revokeObjectURL(prev);
                        return prev;
                      });

                      if (f) setPhotoPreview(URL.createObjectURL(f));
                    }}
                  />
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 group-hover:text-gray-600 transition mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700">
                      Klik atau drag foto ke sini
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG (Max 2MB)
                    </p>
                  </div>
                </label>

                {photoFile && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      ✓ File terpilih: {photoFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-sm text-black/60">
              Langkah 2 — Berikan informasi dasar untuk membangun kredibilitas
              Anda
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Nama yang digunakan untuk ditampilkan di sistem
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Nama ini akan terlihat oleh klien saat mereka mencari atau
                melihat profil Anda.
              </p>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Masukan nama lengkap atau nama perusahaan anda"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Tipe Freelancer
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Full Time untuk komitmen penuh, Part Time untuk pekerjaan
                sampingan.
              </p>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="freelancer_type"
                    value="full_time"
                    checked={freelancerType === "full_time"}
                    onChange={(e) => setFreelancerType(e.target.value)}
                    className="w-5 h-5 text-black cursor-pointer"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">
                      Full Time
                    </span>
                    <span className="block text-xs text-gray-500">
                      Komitmen penuh untuk pekerjaan di platform
                    </span>
                  </span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="freelancer_type"
                    value="part_time"
                    checked={freelancerType === "part_time"}
                    onChange={(e) => setFreelancerType(e.target.value)}
                    className="w-5 h-5 text-black cursor-pointer"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">
                      Part Time
                    </span>
                    <span className="block text-xs text-gray-500">
                      Pekerjaan sampingan, fleksibel dengan jadwal Anda
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">
              Langkah 3 — Deskripsi singkat tentang layanan (minimal 10
              karakter)
            </p>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border rounded p-2 min-h-[120px]"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">Langkah 4 — Identitas (KTP)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="border p-2 rounded"
              />
              <input
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Middle name (optional)"
                className="border p-2 rounded"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="border p-2 rounded"
              />
              <input
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="NIK (16 digit)"
                className="border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">KTP Address</label>
              <input
                value={ktpAddress}
                onChange={(e) => setKtpAddress(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal code"
                className="border p-2 rounded"
              />
              <input
                value={kelurahan}
                onChange={(e) => setKelurahan(e.target.value)}
                placeholder="Kelurahan"
                className="border p-2 rounded"
              />
              <input
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                placeholder="Kecamatan"
                className="border p-2 rounded"
              />
            </div>

            <div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">
              Langkah 5 — Kontak & Konfirmasi
            </p>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                value={email}
                disabled
                aria-disabled="true"
                className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                placeholder="Email terkait akun"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Nomor Telepon</label>
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Alamat Saat Ini</label>
              <input
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl relative">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-10">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-linear-to-br from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-linear-to-br from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg relative z-10">
          {/* Modern Stepper UI */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Pendaftaran Freelancer</h1>
              <div className="text-sm text-black/60">Step {step} / 5</div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 font-bold text-lg
                    ${
                      step === s
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                        : step > s
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-gray-200 border-gray-300 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  {i < 4 && (
                    <div
                      className={`h-1 w-full mt-1 rounded transition-all duration-300
                    ${step > s ? "bg-emerald-500" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-sm text-black/50 mb-2">Memproses…</div>
          )}

          <div>{renderStep()}</div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="cursor-pointer h-10 px-4 rounded border border-gray-300 transition hover:bg-gray-50"
                >
                  Kembali
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {step < 5 && (
                <button
                  onClick={handleStepSave}
                  className="cursor-pointer h-10 px-4 rounded bg-black text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Simpan & Lanjut
                </button>
              )}

              {step === 5 && (
                <button
                  onClick={handleFinalSubmit}
                  className="cursor-pointer h-10 px-4 rounded bg-emerald-600 text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* contoh link (kalau kamu butuh) */}
          {/* <div className="mt-4 text-sm text-black/60">
            Sudah punya akun? <Link href="/auth/login" className="underline">Login</Link>
          </div> */}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-100 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl shadow">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Konfirmasi Pendaftaran</h2>
              </div>
              <div className="space-y-4 mb-6 text-sm text-gray-700">
                <h3 className="font-semibold text-gray-900">
                  Syarat & Ketentuan Fastwork
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Tanggung Jawab Pekerjaan</strong> — Menjamin
                    kualitas dan penyelesaian proyek sesuai kesepakatan.
                  </li>
                  <li>
                    <strong>Produk Pekerjaan</strong> — Freelancer dapat
                    menawarkan berbagai layanan dan portofolio.
                  </li>
                  <li>
                    <strong>Postingan Lowongan</strong> — Pemberi kerja dapat
                    memposting lowongan untuk merekrut freelancer.
                  </li>
                  <li>
                    <strong>Chat</strong> — Komunikasi antara pemberi kerja dan
                    freelancer difasilitasi oleh platform.
                  </li>
                  <li>
                    <strong>Order</strong> — Order dibuat setelah pemberi kerja
                    tertarik pada layanan freelancer.
                  </li>
                </ul>
              </div>
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Saya telah membaca dan menerima syarat & ketentuan Fastwork
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Saya telah membaca dan menerima{" "}
                    <span className="underline">
                      kebijakan privasi Fastwork
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPromo}
                    onChange={(e) => setAgreedPromo(e.target.checked)}
                    className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Saya tertarik menerima berita, diskon, dan promosi dari
                    Fastwork.
                  </span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-11 px-4 rounded-lg border border-gray-300 transition hover:bg-gray-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmedSubmit}
                  className="flex-1 h-11 px-4 rounded-lg bg-blue-600 text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Daftar sebagai freelancer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
