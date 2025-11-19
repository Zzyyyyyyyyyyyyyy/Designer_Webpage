import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

// Data Models
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  online?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}

interface ChatContextType {
  // State
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Record<string, Message[]>;
  currentUser: User | null;
  isLoading: boolean;

  // Actions
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  createConversation: (participantId: string) => Promise<string | null>;

  // Computed
  selectedConversation: Conversation | null;
  selectedMessages: Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Core state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Current user from auth
  const currentUser: User | null = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      username: user.email?.split('@')[0] || "Unknown",
      avatarUrl: undefined,
      online: true,
    };
  }, [user]);

  // Fetch conversations from Supabase
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      return;
    }

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        participant1_id,
        participant2_id,
        updated_at,
        messages (
          id,
          sender_id,
          content,
          created_at,
          is_read,
          message_type
        )
      `)
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return;
    }

    if (data) {
      // Format conversations
      const formattedConversations = await Promise.all(
        data.map(async (conv: any) => {
          const otherUserId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;

          // Fetch other user details
          const { data: userData } = await supabase
            .from("users")
            .select("id, username, avatar_url")
            .eq("id", otherUserId)
            .single();

          const participants: User[] = [
            currentUser!,
            {
              id: otherUserId,
              username: userData?.username || "Unknown",
              avatarUrl: userData?.avatar_url,
              online: false,
            }
          ];

          // Get last message
          const sortedMessages = (conv.messages || []).sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          const lastMsg = sortedMessages[0];
          const lastMessage = lastMsg ? {
            id: lastMsg.id,
            conversationId: conv.id,
            senderId: lastMsg.sender_id,
            content: lastMsg.content,
            timestamp: lastMsg.created_at,
            read: lastMsg.is_read,
            type: lastMsg.message_type as 'text' | 'image' | 'file',
          } : null;

          // Count unread messages
          const unreadCount = sortedMessages.filter((msg: any) =>
            msg.sender_id !== user.id && !msg.is_read
          ).length;

          return {
            id: conv.id,
            participants,
            lastMessage,
            unreadCount,
            updatedAt: conv.updated_at,
          };
        })
      );

      setConversations(formattedConversations);
    }
  }, [user, currentUser]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    if (data) {
      const formattedMessages: Message[] = data.map((msg: any) => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        content: msg.content,
        timestamp: msg.created_at,
        read: msg.is_read,
        type: msg.message_type as 'text' | 'image' | 'file',
      }));

      setMessages(prev => ({
        ...prev,
        [conversationId]: formattedMessages,
      }));
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Setup Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages in conversations user is part of
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as any;

          // Add message to state
          setMessages(prev => {
            const conversationMessages = prev[newMessage.conversation_id] || [];
            const formatted: Message = {
              id: newMessage.id,
              conversationId: newMessage.conversation_id,
              senderId: newMessage.sender_id,
              content: newMessage.content,
              timestamp: newMessage.created_at,
              read: newMessage.is_read,
              type: newMessage.message_type,
            };
            return {
              ...prev,
              [newMessage.conversation_id]: [...conversationMessages, formatted],
            };
          });

          // Update conversation list
          fetchConversations();
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [user, fetchConversations]);

  // Actions
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);

    // Load messages if not already loaded
    if (!messages[conversationId]) {
      fetchMessages(conversationId);
    }
  }, [messages, fetchMessages]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: 'text',
        is_read: false,
      });

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }, [user]);

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    if (error) {
      console.error("Error marking as read:", error);
    } else {
      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  }, [user]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    await fetchMessages(conversationId);
    setIsLoading(false);
  }, [fetchMessages]);

  const createConversation = useCallback(async (participantId: string): Promise<string | null> => {
    if (!user) return null;

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${user.id})`)
      .single();

    if (existing) {
      return existing.id;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        participant1_id: user.id,
        participant2_id: participantId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    await fetchConversations();
    return data.id;
  }, [user, fetchConversations]);

  // Computed values
  const selectedConversation = useMemo(
    () => conversations.find(c => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const selectedMessages = useMemo(
    () => selectedConversationId ? messages[selectedConversationId] || [] : [],
    [messages, selectedConversationId]
  );

  const contextValue = useMemo(
    () => ({
      conversations,
      selectedConversationId,
      messages,
      currentUser,
      isLoading,
      selectConversation,
      sendMessage,
      markAsRead,
      loadMessages,
      createConversation,
      selectedConversation,
      selectedMessages,
    }),
    [
      conversations,
      selectedConversationId,
      messages,
      currentUser,
      isLoading,
      selectConversation,
      sendMessage,
      markAsRead,
      loadMessages,
      createConversation,
      selectedConversation,
      selectedMessages,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
