import { createContext, useState } from "react";

export type User = {
  _id: string;
  username: string;
  profilePic?: string;
  roomId: string;
};

export type Reaction = {
  emoji: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id?: string;
  text: string;
  senderName: string;
  senderId?: string;
  roomId?: string;
  createdAt?: string;
  read?: boolean;
  reactions?: Reaction[];
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
  };
};

export type ChatContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onlineUsers: string[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
};

const ChatContext = createContext<ChatContextType | null>(null);
export default ChatContext;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const setUser = (userData: User | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        users,
        setUsers,
        unreadCounts,
        setUnreadCounts,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};