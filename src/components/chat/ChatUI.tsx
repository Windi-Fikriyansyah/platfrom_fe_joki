"use client";

import { useChat } from "./useChat";
import { useRef, useEffect, useState, memo, useMemo } from "react";
import { Conversation, Message } from "./types";
import { getDisplayName, getAvatarInitial } from "./utils";
import ConversationItem from "./ConversationItem";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import ViewOfferModal from "./ViewOfferModal";
import CreateOfferModal from "./CreateOfferModal";
import OfferMessage from "./OfferMessage";
import OrderStatusSidebar from "./OrderStatusSidebar";
import { FileText } from "lucide-react";
import { JobOffer } from "./types";



interface ChatUIProps {
  initialMe: any;
  initialConversations: Conversation[];
  initialActiveId: string | null;
  initialMessages: Message[];
  initialPackage: string | null;
}

const ChatUI = memo(function ChatUI({
  initialMe,
  initialConversations,
  initialActiveId,
  initialMessages,
  initialPackage,
}: ChatUIProps) {
  const {
    me,
    conversations,
    activeId,
    setActiveId,
    messages,
    message,
    setMessage,
    sendMessage,
    otherUser,
    wsConnected,
    activeConv,
    offers,
    createOffer,
    updateOffer,
  } = useChat({
    initialMe,
    initialConversations,
    initialActiveId,
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editOffer, setEditOffer] = useState<JobOffer | null>(null);
  const [viewOffer, setViewOffer] = useState<any>(null); // Using any temporarily for JobOffer type compatibility if needed

  // Auto-send package message
  const autoSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (initialPackage && activeId && autoSentRef.current !== initialPackage) {
      autoSentRef.current = initialPackage;
      const map: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };
      const pkg = map[initialPackage.toLowerCase()] || initialPackage;
      sendMessage(`Halo, saya mau order Paket ${pkg}`);

      // Cleanup URL to avoid duplicate send on refresh
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("package");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [initialPackage, activeId, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || !activeId) return;

    setSending(true);
    try {
      await sendMessage();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const getConversationDisplay = (conv: Conversation) => {
    // Ensure me is available
    if (!me) {
      return {
        name: "Unknown User",
        avatar: "?",
        lastMsg: conv.last_message?.text || "No messages yet",
        timestamp: conv.updated_at,
        unread: conv.unread_count || 0,
      };
    }

    // Determine if current user is buyer or seller
    const isBuyer = me.id === conv.buyer_id;
    const other = isBuyer ? conv.seller : conv.buyer;

    const otherName = getDisplayName(other);
    const otherAvatar = getAvatarInitial(other);

    return {
      name: otherName,
      avatar: otherAvatar,
      lastMsg: conv.last_message?.text || "No messages yet",
      timestamp: conv.updated_at,
      unread: conv.unread_count || 0,
    };
  };

  if (!me) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Conversation List */}
      <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v14m7-7H5"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                userId={me?.id}
                onClick={setActiveId}
                statusBadge={(() => {
                  const status = conv.latest_offer_status;
                  if (!status) return null;
                  const map: Record<string, { label: string, color: string }> = {
                    pending: { label: "Menunggu Pembayaran", color: "bg-orange-100 text-orange-700" },
                    paid: { label: "Dibayar", color: "bg-green-100 text-green-700" },
                    working: { label: "Dalam Pengerjaan", color: "bg-blue-100 text-blue-700" },
                    delivered: { label: "Dikirim", color: "bg-purple-100 text-purple-700" },
                    completed: { label: "Selesai", color: "bg-gray-100 text-gray-700" },
                    cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700" }
                  };
                  return map[status] || null;
                })()}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex bg-gray-50 overflow-hidden">
        {activeId && activeConv ? (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {getAvatarInitial(otherUser)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {getDisplayName(otherUser)}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {wsConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 7.391a1 1 0 00.502.756l2.73 1.365a11.902 11.902 0 01-5.85 5.85l-1.365-2.73a1 1 0 00-.756-.502L3.684 11.28A1 1 0 003 10.28V5z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const offer = msg.offer || (msg.text.startsWith("[OFFER]") ? offers.find(o => msg.text.includes(o.id)) : null);

                    if (offer) {
                      return (
                        <OfferMessage
                          key={msg.id}
                          offer={offer}
                          isMine={msg.sender_id === me?.id}
                          onViewDetails={() => setViewOffer(offer)}
                          onEdit={() => setEditOffer(offer)}
                        />
                      );
                    }

                    return (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        isOwn={msg.sender_id === me?.id}
                      />
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-4 relative">
                {/* Freelancer Offer Button */}
                {me?.role === "freelancer" && (
                  <div className="absolute -top-12 left-0 right-0 px-4 flex justify-center pointer-events-none">
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className="pointer-events-auto bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm transition-colors mb-2"
                    >
                      <FileText className="w-4 h-4" />
                      Buat Penawaran
                    </button>
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sending}
                  />

                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-6 h-6 ${message.trim() ? "text-blue-600" : "text-gray-400"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99021575 L3.03521743,10.4312088 C3.03521743,10.5883061 3.19218622,10.7454035 3.50612381,10.7454035 L16.6915026,11.5308905 C16.6915026,11.5308905 17.1624089,11.5308905 17.1624089,12.0021827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Order Status Sidebar */}
            {offers.length > 0 && (
              <OrderStatusSidebar
                offers={offers}
                isLoading={false}
                isFreelancer={me?.role === 'freelancer'}
                onEdit={(offer) => setEditOffer(offer)}
              />
            )}

            {/* View Offer Modal */}
            <ViewOfferModal
              isOpen={!!viewOffer}
              onClose={() => setViewOffer(null)}
              offer={viewOffer}
              isFreelancer={me?.role === 'freelancer'}
            />

            {/* Offer Modal (Create) */}
            <CreateOfferModal
              isOpen={showOfferModal}
              onClose={() => setShowOfferModal(false)}
              onSubmit={createOffer}
              productTitle={activeConv.product_id ? "Project " + activeConv.product_id : undefined}
            />

            {/* Offer Modal (Edit) */}
            <CreateOfferModal
              isOpen={!!editOffer}
              onClose={() => setEditOffer(null)}
              onSubmit={async () => { throw new Error("Should use onUpdate"); }} // Placeholder, won't be called due to logic in modal
              onUpdate={updateOffer}
              initialData={editOffer}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatUI;
