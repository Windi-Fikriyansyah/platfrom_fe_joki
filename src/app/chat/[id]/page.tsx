import ChatUI from "@/components/chat/ChatUI";

export default function ChatThreadPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold">Chat — Sesi {id}</h1>
        <p className="mt-1 text-sm text-black/60">
          Percakapan antara kamu dan mentor.
        </p>
      </div>
      <ChatUI />
    </div>
  );
}
