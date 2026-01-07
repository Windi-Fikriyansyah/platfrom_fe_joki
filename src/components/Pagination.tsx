import Link from 'next/link';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string; // e.g. "/search"
    queryParams?: Record<string, string>; // e.g. { q: "skripsi", cat: "Olah Data" }
}

export default function Pagination({
    currentPage,
    totalPages,
    baseUrl = "/search",
    queryParams = {}
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        // Simple algorithm for visible pages
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pages.push(
                <Link
                    key={1}
                    href={createPageUrl(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    1
                </Link>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="start-ellipsis" className="flex h-9 w-9 items-center justify-center text-gray-400">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrent = i === currentPage;
            pages.push(
                <Link
                    key={i}
                    href={createPageUrl(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${isCurrent
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    aria-current={isCurrent ? "page" : undefined}
                >
                    {i}
                </Link>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="end-ellipsis" className="flex h-9 w-9 items-center justify-center text-gray-400">
                        ...
                    </span>
                );
            }
            pages.push(
                <Link
                    key={totalPages}
                    href={createPageUrl(totalPages)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {totalPages}
                </Link>
            );
        }

        return pages;
    };

    const prevUrl = currentPage > 1 ? createPageUrl(currentPage - 1) : "#";
    const nextUrl = currentPage < totalPages ? createPageUrl(currentPage + 1) : "#";

    return (
        <nav
            className="flex flex-wrap items-center justify-center gap-2 mt-10"
            aria-label="Pagination Navigation"
        >
            <Link
                href={prevUrl}
                className={`flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold transition-colors ${currentPage === 1
                    ? "pointer-events-none opacity-50 text-gray-400"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                aria-disabled={currentPage === 1}
            >
                Sebelumnya
            </Link>

            <div className="flex flex-wrap gap-1 justify-center">
                {renderPageNumbers()}
            </div>

            <Link
                href={nextUrl}
                className={`flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold transition-colors ${currentPage === totalPages
                    ? "pointer-events-none opacity-50 text-gray-400"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                aria-disabled={currentPage === totalPages}
            >
                Selanjutnya
            </Link>
        </nav>
    );
}
