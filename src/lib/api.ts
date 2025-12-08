const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {};
  // jangan set Content-Type jika body FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as any),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // backend kamu biasanya balikin message
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}
