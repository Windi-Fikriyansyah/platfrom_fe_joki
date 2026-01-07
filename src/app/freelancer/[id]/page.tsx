
import GigCard from "@/components/GigCard";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getFreelancerProfile(id: string) {
    try {
        const res = await fetch(`${API_BASE}/freelancer/profile/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        return null;
    }
}

export default async function FreelancerProfilePage(props: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await props.params;

    const data = await getFreelancerProfile(id);

    if (!data) {
        notFound();
    }

    const { profile, products, reviews } = data;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Header Profile */}
            <div className="rounded-3xl border bg-white p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="shrink-0">
                        {profile.photo_url ? (
                            <img
                                src={profile.photo_url}
                                alt={profile.name}
                                className="h-32 w-32 rounded-full object-cover border-4 border-gray-100"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-black/10 text-4xl font-bold text-black/30">
                                {profile.name?.charAt(0) || "?"}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold">{profile.name}</h1>
                            <p className="text-lg text-black/60">{profile.title}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="rounded-full bg-black/5 px-3 py-1 font-semibold text-black/70">
                                📍 {profile.location}
                            </div>
                            <div className="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">
                                {profile.level}
                            </div>
                            <div className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-700">
                                ⭐ {Number(profile.rating || 0).toFixed(1)}
                                <span className="ml-1 font-normal text-black/40">({profile.review_count} ulasan)</span>
                            </div>
                            <div className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-700">
                                Bergabung {new Date(profile.joined_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                            </div>
                        </div>

                        {/* About */}
                        <div className="max-w-3xl">
                            <h3 className="font-bold mb-2 text-lg">Tentang Saya</h3>
                            <p className="whitespace-pre-line text-black/70 leading-relaxed">
                                {profile.about || "Belum ada deskripsi."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Gigs */}
            <div className="mt-8">
                <h2 className="text-2xl font-extrabold mb-6">Layanan Aktif</h2>
                {products && products.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((gig: any) => (
                            <GigCard
                                key={gig.id}
                                gig={{
                                    ...gig,
                                    seller: {
                                        name: profile.name,
                                        title: profile.title,
                                        photo_url: profile.photo_url,
                                        level: profile.level,
                                    },
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-gray-50 p-8 text-center text-black/50">
                        Freelancer ini belum memiliki layanan aktif.
                    </div>
                )}
            </div>

            {/* Reviews */}
            <div className="mt-12">
                <h2 className="text-2xl font-extrabold mb-6">Ulasan Terbaru</h2>
                {reviews && reviews.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="rounded-2xl border bg-white p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/5 font-bold text-black/40">
                                            {review.reviewer?.name?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{review.reviewer?.name || "Pengguna"}</div>
                                            <div className="text-xs text-black/40">
                                                {new Date(review.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded text-xs">
                                        ⭐ {review.rating}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="mt-3 text-sm text-black/70 leading-relaxed">"{review.comment}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-black/50 italic">Belum ada ulasan untuk freelancer ini.</div>
                )}
            </div>

        </div>
    );
}
