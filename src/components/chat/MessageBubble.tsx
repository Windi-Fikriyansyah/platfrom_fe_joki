import { memo } from "react";
import { Message } from "./types";
import { formatChatTime } from "./utils";

interface MessageBubbleProps {
  msg: Message;
  isOwn: boolean;
}

const MessageBubble = memo(function MessageBubble({
  msg,
  isOwn,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800 border border-gray-200"
          }`}
      >
        <p className="text-sm break-words">{msg.text}</p>
        <p
          className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"
            }`}
        >
          {formatChatTime(msg.created_at)}
        </p>
      </div>
    </div>
  );
});

export default MessageBubble;
