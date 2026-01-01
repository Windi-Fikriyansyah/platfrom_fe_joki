"use client";

import ChatUI from "@/components/chat/ChatUI";

export default function ChatShell(props: {
  initialMe: any;
  initialConversations: any[];
  initialActiveId: string | null;
  initialMessages: any[];
  initialPackage: string | null;
}) {
  // ChatUI kamu bisa disesuaikan agar menerima initial state
  return (
    <ChatUI
      initialMe={props.initialMe}
      initialConversations={props.initialConversations}
      initialActiveId={props.initialActiveId}
      initialMessages={props.initialMessages}
      initialPackage={props.initialPackage}
    />
  );
}
