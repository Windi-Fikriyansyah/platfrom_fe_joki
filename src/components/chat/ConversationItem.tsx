import { memo } from "react";
import { Conversation } from "./types";
import { getDisplayName, getAvatarInitial } from "./utils";

interface ConversationItemProps {
  conv: Conversation;
  isActive: boolean;
  userId?: string;
  onClick: (id: string) => void;
  statusBadge?: { label: string; color: string } | null;
}

const ConversationItem = memo(function ConversationItem({
  conv,
  isActive,
  userId,
  onClick,
  statusBadge,
}: ConversationItemProps) {
  const isBuyer = userId ? userId === conv.buyer_id : false;
  const other = isBuyer ? conv.seller : conv.buyer;

  const otherName = getDisplayName(other);
  const otherAvatar = getAvatarInitial(other);
  const lastMsg = conv.last_message?.text || "No messages yet";
  const unread = conv.unread_count || 0;

  return (
    <div
      onClick={() => onClick(conv.id)}
      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${isActive ? "bg-gray-50" : ""
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {otherAvatar}
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 truncate">
              {otherName}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {conv.updated_at
                ? new Date(conv.updated_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 truncate flex-1">{lastMsg}</p>
            {statusBadge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            )}
          </div>
        </div>

        {/* Unread Badge */}
        {unread > 0 && (
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
            {unread}
          </div>
        )}
      </div>
    </div>
  );
});

export default ConversationItem;
