"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "/";
  // hide footer for any route under /auth
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/freelancer")) return null;
  if (pathname === "/chat" || pathname.startsWith("/chat/")) return null;
  return <Footer />;
}
