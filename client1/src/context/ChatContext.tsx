import { createContext, useContext, useState, useEffect } from "react";

type Message = {
  text: string;
  senderName: string;
  roomId?: string;
};

type User = {
  _id: string;
  username: string;
  profilePic: string; 
};

type ChatContextType = {
  user: User | null;
  setUser: (user: User) => void;

  username: string;

  selectedUser: User | null; // ✅ FIX
  setSelectedUser: (user: User | null) => void; // ✅ FIX

  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside provider");
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // ✅ FIX
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // ✅ persist user in localStorage
  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);


  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        username: user?.username || "",

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