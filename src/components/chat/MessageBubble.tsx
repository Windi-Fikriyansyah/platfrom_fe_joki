import { memo } from "react";
import { Message } from "./types";
import { formatChatTime } from "./utils";
import { FileText, Download } from "lucide-react";
import { getMediaUrl } from "@/lib/api";

interface MessageBubbleProps {
  msg: Message;
  isOwn: boolean;
}

const MessageBubble = memo(function MessageBubble({
  msg,
  isOwn,
}: MessageBubbleProps) {
  const isFile = msg.type === 'file' || !!msg.file_url;
  const fileUrl = getMediaUrl(msg.file_url);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-800 border border-gray-200"
          } ${isFile ? "w-full sm:w-80" : ""}`}
      >
        {isFile ? (
          <div className="flex flex-col gap-2">
            <div className={`flex items-start gap-3 p-3 rounded-lg ${isOwn ? 'bg-blue-700' : 'bg-gray-50 border border-gray-100'}`}>
              <div className={`p-2 rounded-lg ${isOwn ? 'bg-blue-500' : 'bg-blue-50'}`}>
                <FileText className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>{msg.file_name || "Attachment"}</p>
                <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>Klik untuk unduh</p>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${isOwn ? 'hover:bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-500'}`}
                download={msg.file_name}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
            {msg.text && <p className="text-sm break-words">{msg.text}</p>}
          </div>
        ) : (
          <p className="text-sm break-words">{msg.text}</p>
        )}
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
