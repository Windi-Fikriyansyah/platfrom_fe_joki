"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function ConditionalBottomNav() {
    const pathname = usePathname() || "/";

    // Hide bottom nav for any route under /auth
    if (pathname.startsWith("/auth")) return null;

    // Hide for freelancer pages
    if (pathname.startsWith("/freelancer")) return null;

    return <BottomNav />;
}
