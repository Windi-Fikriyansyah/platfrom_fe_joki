"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // allow public routes: root, search, and auth pages
    const publicPrefixes = ["/", "/search", "/auth"];
    if (
      publicPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))
    ) {
      setReady(true);
      return;
    }

    // check token in localStorage
    try {
      const token = localStorage.getItem("jm_token");
      if (!token) {
        // redirect to login with next param
        const next = encodeURIComponent(pathname + window.location.search);
        router.replace(`/auth/login?next=${next}`);
        return;
      }
      // optionally could validate token here
      setReady(true);
    } catch (e) {
      router.replace("/auth/login");
    }
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
