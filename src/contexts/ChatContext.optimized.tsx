import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from "react";

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
  timestamp: string; // ISO string for better serialization
  read: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string; // ISO string for better serialization
}

interface ChatContextType {
  // State
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Record<string, Message[]>;
  currentUser: User;
  isLoading: boolean;

  // Actions
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  loadMessages: (conversationId: string) => Promise<void>;

  // Computed
  selectedConversation: Conversation | null;
  selectedMessages: Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = "chat_data";
const CURRENT_USER_ID = "current-user";
const STORAGE_DEBOUNCE_MS = 500;

// Custom hook for debounced localStorage
function useDebouncedLocalStorage(key: string, delay = STORAGE_DEBOUNCE_MS) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const save = useCallback((data: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, delay);
  }, [key, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return save;
}

// Mock data generator - MOVED OUTSIDE to prevent recreation
const generateMockData = () => {
  const currentUser: User = {
    id: CURRENT_USER_ID,
    username: "You",
    avatarUrl: undefined,
    online: true,
  };

  const mockConversations: Conversation[] = [
    {
      id: "conv-1",
      participants: [
        currentUser,
        { id: "user-1", username: "Sophie Chen", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", online: true },
      ],
      lastMessage: {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "user-1",
        content: "Hey! I loved your latest design work. Are you available for a collaboration?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        type: "text",
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "conv-2",
      participants: [
        currentUser,
        { id: "user-2", username: "Alex Turner", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", online: false },
      ],
      lastMessage: {
        id: "msg-2",
        conversationId: "conv-2",
        senderId: CURRENT_USER_ID,
        content: "Thanks for the feedback! I'll send you the updated files tomorrow.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        type: "text",
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "conv-3",
      participants: [
        currentUser,
        { id: "user-3", username: "Emma Wilson", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", online: true },
      ],
      lastMessage: {
        id: "msg-3",
        conversationId: "conv-3",
        senderId: "user-3",
        content: "Perfect! See you at the event.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        type: "text",
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  const mockMessages: Record<string, Message[]> = {
    "conv-1": [
      {
        id: "msg-conv1-1",
        conversationId: "conv-1",
        senderId: "user-1",
        content: "Hi! I saw your portfolio and I'm really impressed.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        read: true,
        type: "text",
      },
      {
        id: "msg-conv1-2",
        conversationId: "conv-1",
        senderId: CURRENT_USER_ID,
        content: "Thank you so much! I appreciate that.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 10).toISOString(),
        read: true,
        type: "text",
      },
      {
        id: "msg-conv1-3",
        conversationId: "conv-1",
        senderId: "user-1",
        content: "Hey! I loved your latest design work. Are you available for a collaboration?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        type: "text",
      },
    ],
    "conv-2": [
      {
        id: "msg-conv2-1",
        conversationId: "conv-2",
        senderId: "user-2",
        content: "Can you review the design mockups I sent?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        read: true,
        type: "text",
      },
      {
        id: "msg-conv2-2",
        conversationId: "conv-2",
        senderId: CURRENT_USER_ID,
        content: "Thanks for the feedback! I'll send you the updated files tomorrow.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        type: "text",
      },
    ],
    "conv-3": [
      {
        id: "msg-conv3-1",
        conversationId: "conv-3",
        senderId: CURRENT_USER_ID,
        content: "Are you going to the design conference next week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        read: true,
        type: "text",
      },
      {
        id: "msg-conv3-2",
        conversationId: "conv-3",
        senderId: "user-3",
        content: "Perfect! See you at the event.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        type: "text",
      },
    ],
  };

  return { currentUser, mockConversations, mockMessages };
};

// Generate once and reuse
const MOCK_DATA = generateMockData();

export function ChatProvider({ children }: { children: ReactNode }) {
  const { currentUser, mockConversations, mockMessages } = MOCK_DATA;

  // Core state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Debounced localStorage save
  const saveToStorage = useDebouncedLocalStorage(STORAGE_KEY);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setConversations(data.conversations || mockConversations);
        setMessages(data.messages || mockMessages);
      } catch (error) {
        console.error("Failed to parse chat data from storage:", error);
        setConversations(mockConversations);
        setMessages(mockMessages);
      }
    } else {
      // Initialize with mock data
      setConversations(mockConversations);
      setMessages(mockMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (conversations.length > 0) {
      saveToStorage({ conversations, messages });
    }
  }, [conversations, messages, saveToStorage]);

  // Actions - all wrapped in useCallback
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Mark as read in the same update cycle
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const timestamp = Date.now();
    const timestampISO = new Date(timestamp).toISOString();

    const newMessage: Message = {
      id: `msg-${timestamp}`,
      conversationId,
      senderId: currentUser.id,
      content,
      timestamp: timestampISO,
      read: true,
      type: 'text',
    };

    // Batch state updates to minimize re-renders
    setMessages(prev => {
      const conversationMessages = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...conversationMessages, newMessage],
      };
    });

    setConversations(prev => {
      const index = prev.findIndex(c => c.id === conversationId);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = {
        ...prev[index],
        lastMessage: newMessage,
        updatedAt: timestampISO,
      };
      return updated;
    });

    // WEBSOCKET PLACEHOLDER: Send message to server
    // const socket = io('ws://localhost:3001');
    // socket.emit('send_message', {
    //   conversationId,
    //   content,
    //   senderId: currentUser.id,
    //   timestamp: timestampISO,
    // });
  }, [currentUser.id]);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // WEBSOCKET PLACEHOLDER: Mark messages as read on server
    // socket.emit('mark_read', { conversationId });
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);

    // BACKEND API PLACEHOLDER: Load messages from server
    // try {
    //   const response = await fetch(`/api/conversations/${conversationId}/messages`);
    //   if (!response.ok) throw new Error('Failed to fetch messages');
    //   const data = await response.json();
    //   setMessages(prev => ({
    //     ...prev,
    //     [conversationId]: data.messages,
    //   }));
    // } catch (error) {
    //   console.error('Error loading messages:', error);
    // } finally {
    //   setIsLoading(false);
    // }

    setIsLoading(false);
  }, []);

  // Computed values - memoized to prevent recalculation
  const selectedConversation = useMemo(
    () => conversations.find(c => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const selectedMessages = useMemo(
    () => selectedConversationId ? messages[selectedConversationId] || [] : [],
    [messages, selectedConversationId]
  );

  // Memoize context value to prevent unnecessary provider re-renders
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

// BACKEND API ENDPOINTS NEEDED:
// TODO: POST /api/conversations - Create new conversation
// TODO: GET /api/conversations - List all conversations for current user
// TODO: GET /api/conversations/:id - Get conversation details
// TODO: GET /api/conversations/:id/messages - Get messages for conversation
// TODO: POST /api/conversations/:id/messages - Send new message
// TODO: PUT /api/conversations/:id/read - Mark conversation as read
// TODO: DELETE /api/conversations/:id - Delete conversation

// WEBSOCKET EVENTS NEEDED:
// TODO: 'send_message' - Send message to server
// TODO: 'new_message' - Receive new message from server
// TODO: 'mark_read' - Mark messages as read
// TODO: 'user_typing' - User is typing indicator
// TODO: 'user_online' - User online status updates
// TODO: 'user_offline' - User offline status updates
