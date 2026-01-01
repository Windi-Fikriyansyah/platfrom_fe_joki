"use client";

import ChatUI from "@/components/chat/ChatUI";
import { memo } from "react";

interface ChatShellProps {
  initialMe: any;
  initialConversations: any[];
  initialActiveId: string | null;
  initialMessages: any[];
  initialPackage: string | null;
}

const ChatShell = memo(function ChatShell({
  initialMe,
  initialConversations,
  initialActiveId,
  initialMessages,
  initialPackage,
}: ChatShellProps) {
  return (
    <ChatUI
      initialMe={initialMe}
      initialConversations={initialConversations}
      initialActiveId={initialActiveId}
      initialMessages={initialMessages}
      initialPackage={initialPackage}
    />
  );
});

export default ChatShell;
