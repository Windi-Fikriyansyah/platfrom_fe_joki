"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const publicPrefixes = ["/", "/search", "/auth"];
    if (
      publicPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))
    ) {
      setReady(true);
      return;
    }

    fetch("http://127.0.0.1:8080/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          const next = encodeURIComponent(pathname);
          router.replace(`/auth/login?next=${next}`);
          return;
        }
        setReady(true);
      })
      .catch(() => {
        router.replace("/auth/login");
      });
  }, [pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
