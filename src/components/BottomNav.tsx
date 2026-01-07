"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, MessageCircle, Search, Home } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function BottomNav() {
    const pathname = usePathname();
    const { showToast } = useToast();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Initial fetch for unread count
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/unread-count`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) {
                    setUnreadCount(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch unread count:", err);
            }
        };

        fetchUnreadCount();

        // Listen to custom update event (similar to Navbar)
        const handleUpdate = (e: any) => {
            if (typeof e.detail === "number") {
                setUnreadCount(e.detail);
            }
        };
        window.addEventListener("chat-unread-count-update", handleUpdate);

        // Periodic refresh (every 60s)
        const interval = setInterval(fetchUnreadCount, 60000);

        return () => {
            window.removeEventListener("chat-unread-count-update", handleUpdate);
            clearInterval(interval);
        };
    }, []);

    const navItems = [
        {
            href: "/",
            label: "Home",
            icon: Home,
            isActive: pathname === "/",
        },
        {
            href: "/search",
            label: "Layanan",
            icon: Search,
            isActive: pathname.startsWith("/search"),
        },
        {
            href: "#",
            label: "Jobboard",
            icon: Briefcase,
            isActive: false,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                showToast("Fitur ini akan segera hadir", "info");
            },
        },
        {
            href: "/chat",
            label: "Chat",
            icon: MessageCircle,
            isActive: pathname.startsWith("/chat"),
            badge: unreadCount,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-primary/10 px-4 pb-safe-offset-2">
            <div className="flex h-16 items-center justify-around items-end">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={item.onClick}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${item.isActive ? "text-primary" : "text-black/40 hover:text-black/60"
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    className={`h-5 w-5 ${item.isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`}
                                />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white ring-2 ring-white">
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-semibold tracking-tight">
                                {item.label}
                            </span>
                            {item.isActive && (
                                <div className="absolute top-0 h-1 w-8 rounded-b-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
