import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeProductId } from "@/lib/productId";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getGigDetail(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Gig tidak ditemukan");

  const json = await res.json();
  return json.data;
}

async function getProductReviews(id: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}/reviews`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function GigDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const gig = await getGigDetail(id);
  const reviews = await getProductReviews(id);

  // Parse packages data
  const packages = gig.packages || {};
  const basic = packages.basic || {};
  const standard = packages.standard || {};
  const premium = packages.premium || {};
  const productIdForUrl = normalizeProductId(String(gig.id)).urlId;

  // Parse portfolio data
  let portfolio: any = {};
  try {
    portfolio =
      typeof gig.portfolio === "string"
        ? JSON.parse(gig.portfolio)
        : gig.portfolio ?? {};
  } catch {
    portfolio = {};
  }

  const portfolioImages = Array.isArray(portfolio?.images)
    ? portfolio.images
    : [];

  const portfolioVideo =
    typeof portfolio?.video_url === "string" ? portfolio.video_url : "";

  function isValidPackage(pkg: any) {
    if (!pkg) return false;

    return (
      typeof pkg.title === "string" &&
      pkg.title.trim() !== "" &&
      Number(pkg.price) > 0 &&
      Number(pkg.delivery_days) > 0
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ================= MAIN ================= */}
        <div className="space-y-6">
          {/* Main Card */}
          <div className="rounded-3xl border bg-white p-6">
            <div className="text-sm font-semibold text-black/50">
              {gig.category}
            </div>

            <h1 className="mt-2 text-3xl font-extrabold">{gig.title}</h1>

            {/* Cover Image */}
            {gig.cover_url && (
              <div className="mt-4 overflow-hidden rounded-2xl">
                <img
                  src={gig.cover_url}
                  alt={gig.title}
                  className="h-64 w-full object-cover"
                />
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-black/5 p-4">
                <div className="text-xs font-semibold text-black/50">
                  Rating
                </div>
                <div className="mt-1 text-xl font-extrabold flex items-center gap-1">
                  <span>⭐ {Number(gig.rating || 0).toFixed(1)}</span>
                  <span className="text-sm text-black/40 font-normal">
                    ({gig.review_count || 0})
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-black/5 p-4">
                <div className="text-xs font-semibold text-black/50">
                  Terjual
                </div>
                <div className="text-sm text-gray-500">
                  • {gig.sold || 0} Terjual
                </div>
              </div>

              <div className="rounded-2xl bg-black/5 p-4">
                <div className="text-xs font-semibold text-black/50">Mulai</div>
                <div className="mt-1 text-xl font-extrabold">
                  Rp {Number(gig.base_price).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-extrabold">Deskripsi</h2>
              <p className="mt-2 leading-relaxed text-black/60">
                {gig.visibility_description || "Deskripsi belum tersedia."}
              </p>
            </div>

          </div>

          {/* Packages */}
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-extrabold">Paket Layanan</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {/* Basic Package */}
              {isValidPackage(basic) && (
                <div className="rounded-2xl border-2 border-black/10 p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/50">
                    {basic.title}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold">{basic.title}</h3>
                  <p className="mt-2 text-sm text-black/60">
                    {basic.description}
                  </p>

                  <div className="mt-4 text-2xl font-extrabold">
                    Rp {Number(basic.price).toLocaleString("id-ID")}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{basic.delivery_days} hari pengerjaan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
                      <span>{basic.revisions} revisi</span>
                    </div>
                  </div>

                  {basic.benefits && basic.benefits.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {basic.benefits.map((benefit: string, i: number) => (
                        <div key={i} className="text-sm text-black/70">
                          ✅ {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/chat?product_id=${gig.id}&seller_id=${gig.freelancer?.id}&package=basic`}
                    className="mt-4 block rounded-xl border border-black px-4 py-2 text-center text-sm font-semibold hover:bg-black hover:text-white transition"
                  >
                    💬 Chat Paket {basic.title}
                  </Link>
                </div>
              )}

              {/* Standard Package */}
              {isValidPackage(standard) && (
                <div className="rounded-2xl border-2 border-blue-500 p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {standard.title}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/60">
                    {standard.description}
                  </p>

                  <div className="mt-4 text-2xl font-extrabold">
                    Rp {Number(standard.price).toLocaleString("id-ID")}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{standard.delivery_days} hari pengerjaan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
                      <span>{standard.revisions} revisi</span>
                    </div>
                  </div>

                  {standard.benefits && standard.benefits.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {standard.benefits.map((benefit: string, i: number) => (
                        <div key={i} className="text-sm text-black/70">
                          ✅ {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/chat?product_id=${gig.id}&seller_id=${gig.freelancer?.id}&package=standard`}
                    className="mt-4 block rounded-xl border border-black px-4 py-2 text-center text-sm font-semibold hover:bg-black hover:text-white transition"
                  >
                    💬 Chat Paket {standard.title}
                  </Link>
                </div>
              )}

              {/* Premium Package */}
              {isValidPackage(premium) && (
                <div className="rounded-2xl border-2 border-amber-500 p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-amber-600">
                    {premium.title}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold">
                    {premium.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/60">
                    {premium.description}
                  </p>

                  <div className="mt-4 text-2xl font-extrabold">
                    Rp {Number(premium.price).toLocaleString("id-ID")}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{premium.delivery_days} hari pengerjaan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
                      <span>{premium.revisions} revisi</span>
                    </div>
                  </div>

                  {premium.benefits && premium.benefits.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {premium.benefits.map((benefit: string, i: number) => (
                        <div key={i} className="text-sm text-black/70">
                          ✅ {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/chat?product_id=${gig.id}&seller_id=${gig.freelancer?.id}&package=premium`}
                    className="mt-4 block rounded-xl border border-black px-4 py-2 text-center text-sm font-semibold hover:bg-black hover:text-white transition"
                  >
                    💬 Chat Paket {premium.title}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio */}
          {/* Portfolio */}
          {portfolioImages.length > 0 && (
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-xl font-extrabold">Portfolio</h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {portfolioImages.map((img: any, i: number) => {
                  if (!img.file_name) return null;

                  return (
                    <div key={i} className="overflow-hidden rounded-2xl">
                      <img
                        src={img.file_name}
                        alt={img.description?.trim() || `Portfolio ${i + 1}`}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />

                      {img.description?.trim() && (
                        <p className="mt-2 text-sm text-black/60">
                          {img.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-extrabold mb-4">
              Ulasan Pembeli ({reviews?.length || 0})
            </h2>

            <div className="space-y-4">
              {!reviews || reviews.length === 0 ? (
                <div className="rounded-xl bg-black/5 p-6 text-center text-black/60">
                  Belum ada ulasan untuk layanan ini.
                </div>
              ) : (
                reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 font-bold text-black/40">
                          {review.reviewer?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-bold">
                            {review.reviewer?.name || "Pengguna"}
                          </div>
                          <div className="text-xs text-black/40">
                            {new Date(review.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
                        ⭐ {review.rating}
                      </div>
                    </div>
                    {review.comment && (
                      <div className="mt-3 text-sm leading-relaxed text-black/70">
                        {review.comment}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="h-fit rounded-3xl border bg-white p-6">
          <div className="flex items-center gap-3">
            {gig.freelancer?.photo_url ? (
              <img
                src={gig.freelancer.photo_url}
                alt={gig.freelancer.name}
                className="h-12 w-12 rounded-2xl object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-black/10" />
            )}
            <div>
              <div className="font-extrabold">
                {gig.freelancer?.name ?? "Freelancer"}
              </div>
              <div className="text-sm text-black/60">
                {gig.freelancer?.title ?? "Freelancer"}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/5 p-4">
            <div className="text-xs font-semibold text-black/50">
              Harga mulai dari
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              Rp {Number(gig.base_price).toLocaleString("id-ID")}
            </div>
            <div className="mt-2 text-sm text-black/60">
              Termasuk revisi & support chat.
            </div>
          </div>

          <Link
            href={`/chat?product_id=${gig.id}&seller_id=${gig.freelancer?.id}&package=basic`}
            className="mt-4 block w-full rounded-2xl bg-black px-4 py-3 text-center text-sm font-semibold text-white hover:bg-black/90"
          >
            Order Sekarang
          </Link>

          <Link
            href={`/chat?seller_id=${gig.freelancer?.id}${gig.id ? `&product_id=${gig.id}` : ""
              }`}
            className="mt-3 block w-full rounded-2xl border bg-white px-4 py-3 text-center text-sm font-semibold hover:bg-black/5"
          >
            Chat Freelancer
          </Link>

          <Link
            href={`/freelancer/${gig.freelancer?.id ?? ""}`}
            className="mt-3 block text-center text-sm font-semibold text-black/60 hover:text-black"
          >
            Lihat profil freelancer →
          </Link>
        </aside>
      </div>
    </div>
  );
}
