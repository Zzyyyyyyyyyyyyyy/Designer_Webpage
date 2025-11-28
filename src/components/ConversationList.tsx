import { User } from "lucide-react";
import { Conversation } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  return (
    <div className="h-full bg-black border-r border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-wider">MESSAGES</h1>
      </div>

      {/* Conversation List */}
      <div className="overflow-y-auto h-[calc(100%-5rem)]">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = conversation.participants.find(
              (p) => p.id !== currentUserId
            );
            const isSelected = conversation.id === selectedConversationId;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full px-6 py-4 flex items-start gap-4 transition-colors border-b border-white/5 ${
                  isSelected
                    ? "bg-white/5"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {otherUser?.avatarUrl ? (
                    <img
                      src={otherUser.avatarUrl}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {otherUser?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-semibold ${
                        conversation.unreadCount > 0
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {otherUser?.username || "Unknown User"}
                    </span>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDistanceToNow(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  {/* Last Message Preview */}
                  {conversation.lastMessage && (
                    <p
                      className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? "text-gray-300 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage.senderId === currentUserId && "You: "}
                      {conversation.lastMessage.content}
                    </p>
                  )}

                  {/* Unread Badge */}
                  {conversation.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 bg-white text-black text-xs font-bold rounded-full">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
