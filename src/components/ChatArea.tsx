import { User, ArrowLeft } from "lucide-react";
import { Message, Conversation } from "@/contexts/ChatContext.optimized";
import { useEffect, useRef } from "react";

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onBack?: () => void;
}

export function ChatArea({
  conversation,
  messages,
  currentUserId,
  onBack,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const otherUser = conversation.participants.find((p) => p.id !== currentUserId);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden text-white hover:opacity-70 transition-opacity"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* User Avatar */}
        <div className="relative flex-shrink-0">
          {otherUser?.avatarUrl ? (
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          {otherUser?.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-white font-semibold">{otherUser?.username || "Unknown User"}</h2>
          {otherUser?.online && (
            <p className="text-xs text-gray-500">Active now</p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xs text-gray-500 italic px-3 py-1 bg-gray-900 rounded-full">
                    {formatDate(date)}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message) => {
                    const isOwnMessage = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-lg ${
                            isOwnMessage
                              ? "bg-white/10 text-white"
                              : "bg-gray-900 text-white"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
}

// Helper function to format time
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
