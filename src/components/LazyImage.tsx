
"use client";

import React, { useState, useEffect, useRef } from "react";
import { getMediaUrl } from "@/lib/api";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}

export default function LazyImage({
    src,
    alt,
    className = "",
    fallbackSrc = "https://via.placeholder.com/400x300?text=No+Image",
    ...props
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true); // Stop skeleton
    };

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden bg-gray-100 ${className}`}
        >
            {/* Skeleton / Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 z-10" />
            )}

            {isVisible && (
                <img
                    src={hasError ? fallbackSrc : getMediaUrl(src)}
                    alt={alt}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    {...props}
                />
            )}
        </div>
    );
}
