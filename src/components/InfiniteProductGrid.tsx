
"use client";

import React, { useEffect, useState, useRef } from "react";
import GigCard from "@/components/GigCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

type Props = {
    initialGigs: any[];
    meta: {
        total_pages: number;
        page: number;
    };
    searchParams: Record<string, string>;
};

export default function InfiniteProductGrid({ initialGigs, meta, searchParams }: Props) {
    const [gigs, setGigs] = useState<any[]>(initialGigs);
    const [page, setPage] = useState(meta.page + 1);
    const [hasMore, setHasMore] = useState(meta.page < meta.total_pages);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset state when search params change (comparatively simple approach)
        setGigs(initialGigs);
        setPage(meta.page + 1);
        setHasMore(meta.page < meta.total_pages);
        setLoading(false);
    }, [initialGigs, meta]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page]);

    const loadMore = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams(searchParams);
            qs.set("page", page.toString());
            qs.set("limit", "20");

            const res = await fetch(`${API_BASE}/products?${qs.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            const newGigs = (json.data || []).map((g: any) => ({
                ...g,
                seller: {
                    name: g?.seller?.name ?? "Mentor",
                    title: g?.seller?.title ?? "Freelancer",
                    photo_url: g?.seller?.photo_url ?? "",
                },
            }));

            setGigs((prev) => [...prev, ...newGigs]);

            const newMeta = json.meta || {};
            setPage((prev) => prev + 1);
            setHasMore(newMeta.page < newMeta.total_pages);
        } catch (error) {
            console.error("Load more error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (gigs.length === 0) {
        return (
            <div className="rounded-2xl border bg-white p-6 text-sm text-black/70">
                Tidak ada layanan yang cocok.
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gigs.map((g, i) => (
                    // Use index in key to avoid duplicate key issues if API returns duplicates
                    <GigCard key={`${g.id}-${i}`} gig={{ ...g, priority: i < 6 }} />
                ))}
            </div>

            {/* Sentinel / Loader */}
            <div ref={observerTarget} className="mt-8 flex justify-center py-4">
                {loading && (
                    <div className="flex items-center gap-2 text-sm text-black/50 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-black/30 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-black/30 animate-bounce delay-100" />
                        <div className="h-2 w-2 rounded-full bg-black/30 animate-bounce delay-200" />
                        Memuat lebih banyak...
                    </div>
                )}
                {!hasMore && gigs.length > 0 && (
                    <div className="text-sm text-black/40">Semua layanan sudah ditampilkan</div>
                )}
            </div>
        </>
    );
}
