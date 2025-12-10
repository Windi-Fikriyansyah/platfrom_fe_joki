"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  onboarding_step?: number;
};

export default function FreelancerRegisterPage() {
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

  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    // cleanup preview URL
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/freelancer/onboarding`, {
        credentials: "include",
      });
      if (!res.ok) {
        showToast("Gagal memuat data onboarding", "danger");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProfile(data.data as Profile);
      const s = (data.data?.onboarding_step as number) || 1;
      setStep(s);
      // populate local form values
      setSystemName(data.data?.system_name || "");
      setFreelancerType(data.data?.freelancer_type || "full_time");
      setAbout(data.data?.about || "");
      setFirstName(data.data?.first_name || "");
      setMiddleName(data.data?.middle_name || "");
      setLastName(data.data?.last_name || "");
      setNik(data.data?.nik || "");
      setKtpAddress(data.data?.ktp_address || "");
      setPostalCode(data.data?.postal_code || "");
      setKelurahan(data.data?.kelurahan || "");
      setKecamatan(data.data?.kecamatan || "");
      setCity(data.data?.city || "");
      setContactPhone(data.data?.contact_phone || "");
      setCurrentAddress(data.data?.current_address || "");
      const url = data.data?.photo_url;

      setPhotoPreview(url ? `${API.replace("/api", "")}${url}` : null);
    } catch (e) {
      showToast("Terjadi kesalahan jaringan saat memuat profil", "danger");
    } finally {
      setLoading(false);
    }
  }

  // Step actions
  async function handleUploadPhoto() {
    if (!photoFile) return showToast("Pilih foto terlebih dahulu", "danger");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await fetch(`${API}/freelancer/onboarding/photo`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.message || "Gagal upload foto", "danger");
        return;
      }
      showToast("Foto berhasil diupload", "success");
      setProfile(data.data);
      setStep(Math.max(step, data.data?.onboarding_step || 1));
    } catch (e) {
      showToast("Terjadi kesalahan saat upload foto", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSave() {
    if (!systemName) return showToast("Nama sistem diperlukan", "danger");
    setLoading(true);
    try {
      const body = { system_name: systemName, freelancer_type: freelancerType };
      const res = await fetch(`${API}/freelancer/onboarding/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        return showToast(data?.message || "Gagal menyimpan profile", "danger");
      showToast("Profile disimpan", "success");
      setProfile(data.data);
      setStep(Math.max(step, data.data?.onboarding_step || 2));
    } catch (e) {
      showToast("Terjadi kesalahan saat menyimpan profile", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleAboutSave() {
    if (about.length < 10)
      return showToast("About minimal 10 karakter", "danger");
    setLoading(true);
    try {
      const res = await fetch(`${API}/freelancer/onboarding/about`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        return showToast(data?.message || "Gagal menyimpan about", "danger");
      showToast("About disimpan", "success");
      setProfile(data.data);
      setStep(Math.max(step, data.data?.onboarding_step || 3));
    } catch (e) {
      showToast("Terjadi kesalahan saat menyimpan about", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleIdentitySave() {
    if (!firstName || !lastName)
      return showToast("Nama lengkap diperlukan", "danger");
    if (nik.length !== 16) return showToast("NIK harus 16 digit", "danger");
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
      const res = await fetch(`${API}/freelancer/onboarding/identity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        return showToast(data?.message || "Gagal menyimpan identity", "danger");
      showToast("Identity disimpan", "success");
      setProfile(data.data);
      setStep(Math.max(step, data.data?.onboarding_step || 4));
    } catch (e) {
      showToast("Terjadi kesalahan saat menyimpan identity", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleContactSave() {
    if (!contactPhone || contactPhone.length < 9)
      return showToast("Nomor telepon tidak valid", "danger");
    if (!currentAddress)
      return showToast("Alamat saat ini diperlukan", "danger");
    setLoading(true);
    try {
      const body = {
        contact_phone: contactPhone,
        current_address: currentAddress,
      };
      const res = await fetch(`${API}/freelancer/onboarding/contact`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        return showToast(data?.message || "Gagal menyimpan contact", "danger");
      showToast("Contact disimpan", "success");
      setProfile(data.data);
      setStep(Math.max(step, data.data?.onboarding_step || 5));
    } catch (e) {
      showToast("Terjadi kesalahan saat menyimpan contact", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/freelancer/onboarding/submit`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        return showToast(data?.message || "Gagal submit onboarding", "danger");
      showToast("Onboarding terkirim, menunggu review", "success");
      setProfile(data.data);
      router.push("/freelancer");
    } catch (e) {
      showToast("Terjadi kesalahan saat submit", "danger");
    } finally {
      setLoading(false);
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">
              Langkah 1 — Upload foto (jpg/png, max 2MB)
            </p>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 bg-black/5 rounded overflow-hidden flex items-center justify-center">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      photoPreview?.startsWith("http")
                        ? photoPreview
                        : `${API}${photoPreview}`
                    }
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <div className="text-xs text-black/40">Belum ada foto</div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setPhotoFile(f);
                    if (f) setPhotoPreview(URL.createObjectURL(f));
                  }}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    className="h-10 px-4 rounded bg-black text-white"
                  >
                    Upload & Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-black/60">Langkah 2 — Informasi dasar</p>
            <div>
              <label className="block text-sm mb-1">Nama Sistem</label>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Tipe Freelancer</label>
              <select
                value={freelancerType}
                onChange={(e) => setFreelancerType(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleProfileSave}
                className="h-10 px-4 rounded bg-black text-white"
              >
                Simpan & Lanjut
              </button>
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAboutSave}
                className="h-10 px-4 rounded bg-black text-white"
              >
                Simpan & Lanjut
              </button>
            </div>
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleIdentitySave}
                className="h-10 px-4 rounded bg-black text-white"
              >
                Simpan & Lanjut
              </button>
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleContactSave}
                className="h-10 px-4 rounded bg-black text-white"
              >
                Simpan & Lanjut
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-10 px-4 rounded bg-emerald-600 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Pendaftaran Freelancer</h1>
          <div className="text-sm text-black/60">Step {step} / 5</div>
        </div>

        {loading && (
          <div className="text-sm text-black/50 mb-2">Memproses…</div>
        )}

        <div>{renderStep()}</div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-black/60">
            Batal
          </Link>
          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="h-10 px-4 rounded border"
              >
                Kembali
              </button>
            )}
            {step < 5 && (
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="h-10 px-4 rounded bg-black text-white"
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
