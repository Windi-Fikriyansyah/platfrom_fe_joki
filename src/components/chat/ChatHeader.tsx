import { memo } from "react";
import { User } from "./types";
import { getDisplayName, getAvatarInitial } from "./utils";

interface ChatHeaderProps {
  otherUser: User | null;
  wsConnected: boolean;
}

const ChatHeader = memo(function ChatHeader({
  otherUser,
  wsConnected,
}: ChatHeaderProps) {
  const displayName = getDisplayName(otherUser);
  const avatar = getAvatarInitial(otherUser);

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{displayName}</h2>
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
  );
});

export default ChatHeader;
