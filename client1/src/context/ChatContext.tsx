import { createContext, useContext, useState } from "react";

type Message = {
  text: string;
  senderName: string;
  roomId?: string;
};

type User = {
  _id: string;
  username: string;
};

type ChatContextType = {
  username: string;
  setUsername: (name: string) => void;

  selectedUser: string | null;
  setSelectedUser: (user: string) => void;

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
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  return (
    <ChatContext.Provider
      value={{
        username,
        setUsername,
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