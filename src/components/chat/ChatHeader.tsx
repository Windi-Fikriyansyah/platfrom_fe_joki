import { memo } from "react";
import { User } from "./types";
import { getDisplayName, getAvatarInitial } from "./utils";
import { MoreVertical, Phone, Search } from "lucide-react";

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
  const photoUrl = otherUser?.freelancer_profile?.photo_url;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Profile Info */}
        <div className="relative group">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform">
              {avatar}
            </div>
          )}
          {/* Presence Indicator */}
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${wsConnected ? 'bg-green-500' : 'bg-gray-300'} shadow-sm`}></div>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 leading-tight">{displayName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {wsConnected ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-95" title="Search Message">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-95" title="Audio Call">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-95">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

export default ChatHeader;
