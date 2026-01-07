"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/api";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    priority?: boolean;
}

export default function LazyImage({
    src,
    alt,
    className = "",
    fallbackSrc = "https://via.placeholder.com/400x300?text=No+Image",
    priority = false,
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const finalSrc = hasError ? fallbackSrc : getMediaUrl(src) || fallbackSrc;

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
            {/* Shimmer Effect / Skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"
                        style={{ backgroundSize: '200% 100%' }}
                    />
                </div>
            )}

            <Image
                src={finalSrc}
                alt={alt}
                fill
                priority={priority}
                className={`object-cover transition-all duration-700 ease-in-out ${isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg"
                    }`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}
