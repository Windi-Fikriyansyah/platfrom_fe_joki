import { redirect } from "next/navigation";
import ChatShell from "@/components/chat/ChatShell";
import { apiServerFetch } from "@/lib/api-server";
import type { Metadata } from "next";
import type { Conversation, Message } from "@/components/chat/types";
import { normalizeProductId, isNextRedirectError } from "@/lib/productId";

type SP = Record<string, string | string[] | undefined>;

interface Product {
  id: number;
  user_id: string;
  [key: string]: unknown;
}

interface MeResponse {
  success: boolean;
  data: Record<string, unknown>;
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

interface MessagesResponse {
  success: boolean;
  data: Message[];
}

export const metadata: Metadata = {
  title: "Chat - Jokiin",
  description: "Chat with freelancers and clients on Jokiin",
  robots: {
    index: false, // Don't index chat pages for privacy
    follow: false,
  },
};

export default async function ChatPage(props: { searchParams: Promise<SP> }) {
  const searchParams = await props.searchParams;

  // Cek login terlebih dahulu
  let userData: Record<string, unknown>;
  try {
    const meRes = await apiServerFetch<MeResponse>("/me");
    if (!meRes.success || !meRes.data) {
      redirect("/login?redirect=/chat");
    }
    userData = meRes.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    redirect("/login?redirect=/chat");
  }

  const productId =
    typeof searchParams.product_id === "string"
      ? searchParams.product_id
      : undefined;
  const sellerId =
    typeof searchParams.seller_id === "string"
      ? searchParams.seller_id
      : undefined;
  const pkg =
    typeof searchParams.package === "string" ? searchParams.package : undefined;
  const cid =
    typeof searchParams.cid === "string" ? searchParams.cid : undefined;

  // Validasi parameter

  if (sellerId && productId) {
    const pid = Number(productId);
    if (Number.isFinite(pid)) {
      try {
        const productRes = await apiServerFetch<{
          success: boolean;
          data: Product;
        }>(
          `/products/${pid}` // ✅ pastikan angka
        );
        if (productRes.success && productRes.data.user_id !== sellerId) {
          console.warn("Seller ID mismatch with product owner");
        }
      } catch (error) {
        console.error("Failed to validate product:", error);
      }
    } else {
      // ✅ jangan validasi kalau product_id bukan angka
      console.warn(
        "Skip validate product: product_id is not numeric:",
        productId
      );
    }
  }

  // Handle pembuatan conversation baru
  // Hanya buat conversation jika ada seller_id (buyer dan seller diperlukan)
  if (!cid && sellerId) {
    try {
      const body: { seller_id: string; product_id?: number } = {
        seller_id: sellerId,
      };
      if (productId) {
        const pid = Number(productId);
        if (Number.isFinite(pid)) body.product_id = pid; // ✅ kirim number
      }

      const convRes = await apiServerFetch<{
        success: boolean;
        created: boolean;
        data: { id: string };
      }>("/chat/conversations", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!convRes.success) {
        throw new Error("Failed to create conversation");
      }

      const conversationId = convRes.data.id;

      // Build URL dengan parameter yang valid
      const params = new URLSearchParams();
      params.set("cid", conversationId);
      if (productId) params.set("product_id", productId);
      if (sellerId) params.set("seller_id", sellerId);
      if (pkg) params.set("package", pkg);

      redirect(`/chat?${params.toString()}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      // Tetap lanjut tanpa redirect jika gagal membuat conversation
    }
  }

  // Gunakan cid sebagai activeId untuk fetch messages
  const activeId = cid;

  // Fetch data secara parallel untuk performa lebih baik dengan timeout
  const fetchWithTimeout = async <T,>(
    promise: Promise<T>,
    timeoutMs: number = 5000
  ): Promise<T | null> => {
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs)
        ),
      ]);
    } catch {
      return null;
    }
  };

  try {
    const [convsRes, messagesRes] = await Promise.allSettled([
      fetchWithTimeout(
        apiServerFetch<ConversationsResponse>("/chat/conversations"),
        8000
      ),
      activeId
        ? fetchWithTimeout(
            apiServerFetch<MessagesResponse>(
              `/chat/conversations/${activeId}/messages?limit=50`
            ),
            5000
          )
        : Promise.resolve({ success: true, data: [] }),
    ]);

    const conversations =
      convsRes.status === "fulfilled" && convsRes.value?.success
        ? convsRes.value.data || []
        : [];
    const messages =
      messagesRes.status === "fulfilled" && messagesRes.value?.success
        ? messagesRes.value.data || []
        : [];

    // Cek apakah activeId valid
    const activeConv = activeId
      ? conversations.find((c: Conversation) => c.id === activeId)
      : undefined;
    const validActiveId: string | null =
      activeConv && activeId ? activeId : conversations[0]?.id ?? null;

    return (
      <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#f5f6f8]">
        <ChatShell
          initialMe={userData}
          initialConversations={conversations}
          initialActiveId={validActiveId}
          initialMessages={messages}
          initialPackage={pkg || null}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading chat data:", error);
    return (
      <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Gagal memuat chat
          </h2>
          <p className="text-gray-600">
            Terjadi kesalahan saat memuat percakapan. Silakan refresh halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }
}
