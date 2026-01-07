"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname() || "/";

  // hide navbar for any route under /auth
  if (pathname.startsWith("/auth")) return null;

  // Hide for freelancer pages (they have their own layout/navbar)
  if (pathname.startsWith("/freelancer")) return null;

  return <Navbar />;
}
