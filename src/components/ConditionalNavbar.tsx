"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname() || "/";

  // hide navbar for any route under /auth
  if (pathname.startsWith("/auth")) return null;

  if (pathname.startsWith("/freelancer/dashboard")) return null;

  return <Navbar />;
}
