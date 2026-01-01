"use client";

import type { Conversation, Me } from "./types";

export default function ChatItem({
  me,
  conv,
  active,
  onClick,
}: {
  me: Me | null;
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  const isBuyer = me?.id === conv.buyer_id;
  const other = isBuyer ? conv.seller : conv.buyer;

  // ✅ aturan: kalau ada freelancer_profile -> system_name, kalau tidak -> name
  const displayName =
    other?.freelancer_profile?.system_name?.trim() ||
    other?.name?.trim() ||
    "User";

  const photoUrl = other?.freelancer_profile?.photo_url;

  const lastText = conv.last_message?.text ?? "";
  const unread = conv.unread_count ?? 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 flex gap-3 items-center hover:bg-black/5 ${
        active ? "bg-black/5" : ""
      }`}
    >
      <div className="h-11 w-11 rounded-full bg-black/10 overflow-hidden flex items-center justify-center">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold truncate">{displayName}</div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="text-sm text-black/60 truncate">{lastText}</div>

          {unread > 0 && (
            <div className="min-w-[22px] h-[22px] px-2 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
              {unread}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
