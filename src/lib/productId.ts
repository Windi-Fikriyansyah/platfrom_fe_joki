// src/lib/productId.ts
export function toBase64Url(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function fromBase64Url(input: string) {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return Buffer.from(b64, "base64").toString("utf8");
}

/**
 * normalizeProductId:
 * - kalau raw numeric ("12") => urlId = base64url("12"), numericId = 12
 * - kalau raw base64url yang decode jadi digits => urlId = raw, numericId = decoded number
 * - selain itu => urlId = raw, numericId = undefined
 */
export function normalizeProductId(raw?: string) {
  if (!raw)
    return {
      urlId: undefined as string | undefined,
      numericId: undefined as number | undefined,
    };

  // raw numeric
  if (/^\d+$/.test(raw)) {
    return { urlId: toBase64Url(raw), numericId: Number(raw) };
  }

  // raw mungkin base64url -> decode
  try {
    const decoded = fromBase64Url(raw);
    if (/^\d+$/.test(decoded)) {
      return { urlId: raw, numericId: Number(decoded) };
    }
  } catch {
    // ignore
  }

  return { urlId: raw, numericId: undefined };
}

export function isNextRedirectError(err: unknown) {
  // redirect() melempar error dengan digest NEXT_REDIRECT
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as any).digest).startsWith("NEXT_REDIRECT")
  );
}
