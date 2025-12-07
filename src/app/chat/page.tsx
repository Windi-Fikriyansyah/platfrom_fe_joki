import ChatUI from "@/components/ChatUI";

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold">Chat</h1>
        <p className="mt-1 text-sm text-black/60">
          Semua order & revisi dilakukan di chat (UI-only).
        </p>
      </div>
      <ChatUI />
    </div>
  );
}
