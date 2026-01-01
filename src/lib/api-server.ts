import { cookies } from "next/headers";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiServerFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const cookieStore = await cookies(); // ✅ WAJIB di Next 16
  const token = cookieStore.get("jm_token")?.value;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { cookie: `jm_token=${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
