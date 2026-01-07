import { memo, useState } from "react";
import { User } from "./types";
import { getDisplayName, getAvatarInitial } from "./utils";
import { ChevronLeft, Info, MoreVertical, Phone, Search, X } from "lucide-react";
import { getMediaUrl } from "@/lib/api";

interface ChatHeaderProps {
  otherUser: User | null;
  wsConnected: boolean;
  onSearch: (query: string) => void;
  onBack?: () => void;
  onToggleInfo?: () => void;
  showInfoButton?: boolean;
}

const ChatHeader = memo(function ChatHeader({
  otherUser,
  wsConnected,
  onSearch,
  onBack,
  onToggleInfo,
  showInfoButton,
}: ChatHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const displayName = getDisplayName(otherUser);
  const avatar = getAvatarInitial(otherUser);
  const photoUrl = otherUser?.freelancer_profile?.photo_url;

  const handleSearchToggle = () => {
    if (isSearching) {
      setQuery("");
      onSearch("");
    }
    setIsSearching(!isSearching);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0 h-[72px]">
      <div className={`flex items-center gap-2 md:gap-4 transition-opacity duration-200 ${isSearching ? 'opacity-0 pointer-events-none w-0' : 'opacity-100'}`}>
        {/* Back Button (Mobile Only) */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Profile Info */}
        <div className="relative group shrink-0">
          {photoUrl ? (
            <img
              src={getMediaUrl(photoUrl)}
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

        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 leading-tight truncate">{displayName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {wsConnected ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Container */}
      <div className={`flex-1 flex items-center transition-all duration-300 overflow-hidden ${isSearching ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'}`}>
        <div className="relative w-full mx-2">
          <input
            type="text"
            autoFocus
            placeholder="Cari pesan di percakapan ini..."
            className="w-full bg-gray-100 border-none rounded-full py-2 px-10 text-sm focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={handleQueryChange}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          {query && (
            <button
              onClick={() => { setQuery(""); onSearch(""); }}
              className="absolute right-3 top-2.5"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleSearchToggle}
          className={`p-2.5 rounded-full transition-all active:scale-95 ${isSearching ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
          title={isSearching ? "Close Search" : "Search Message"}
        >
          {isSearching ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
        {showInfoButton && onToggleInfo && (
          <button
            onClick={onToggleInfo}
            className="md:hidden p-2.5 text-blue-600 bg-blue-50 rounded-full transition-all active:scale-95"
          >
            <Info className="w-5 h-5" />
          </button>
        )}
        {!isSearching && (
          <button className="hidden md:block p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-95">
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
});

export default ChatHeader;
