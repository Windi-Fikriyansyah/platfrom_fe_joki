export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const MEDIA_BASE = API_BASE.replace(/\/api$/, "");

export function getMediaUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${MEDIA_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

export const api = {
  get: <T>(path: string, headers?: HeadersInit) =>
    apiFetch<{ success: boolean; data: T }>(path, { method: "GET", headers }),
  post: <T>(path: string, body?: any) =>
    apiFetch<{ success: boolean; data: T }>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: any) =>
    apiFetch<{ success: boolean; data: T }>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body?: any) =>
    apiFetch<{ success: boolean; data: T }>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    apiFetch<{ success: boolean; data: T }>(path, { method: "DELETE" }),
};
