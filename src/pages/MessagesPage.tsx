import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { ConversationList } from "@/components/ConversationList";
import { ChatArea } from "@/components/ChatArea";
import { MessageInput } from "@/components/MessageInput";
import { useChat } from "@/contexts/ChatContext";

export function MessagesPage() {
  const {
    conversations,
    selectedConversationId,
    selectedConversation,
    selectedMessages,
    currentUser,
    selectConversation,
    sendMessage,
  } = useChat();

  // Redirect to login if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please log in to view messages</p>
          <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  // State for mobile view: whether to show conversation list or chat
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
    // On mobile, show the chat view after selecting a conversation
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = (content: string) => {
    if (selectedConversationId) {
      sendMessage(selectedConversationId, content);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <NavigationBar />

      {/* Main Content - Split View */}
      <main className="pt-16 h-screen">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Left Side - Conversation List */}
          <div
            className={`
              w-full lg:w-96 flex-shrink-0
              ${showMobileChat ? "hidden lg:block" : "block"}
            `}
          >
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              currentUserId={currentUser.id}
            />
          </div>

          {/* Right Side - Chat Area */}
          <div
            className={`
              flex-1 flex flex-col
              ${!showMobileChat ? "hidden lg:flex" : "flex"}
            `}
          >
            <div className="flex-1 overflow-hidden">
              <ChatArea
                conversation={selectedConversation}
                messages={selectedMessages}
                currentUserId={currentUser.id}
                onBack={handleBackToList}
              />
            </div>

            {/* Message Input - Only show when a conversation is selected */}
            {selectedConversation && (
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!selectedConversationId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
