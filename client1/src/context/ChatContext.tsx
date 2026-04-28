import { createContext, useState } from "react";  

export type User = {
  _id: string;
  username: string;
  profilePic?: string;
  roomId:string;
};

export type Message = {
  _id?: string;
  text: string;
  senderName: string;
  roomId?: string;
  createdAt?: string;
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};