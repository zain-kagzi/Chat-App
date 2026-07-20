import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "./socket";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Messages from "./Message";
import MessageInput from "./MessageInput";
import { useChat } from "../hooks/useChat";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL =
  import.meta.env.VITE_API_URL || "https://chat-app-6uvx.onrender.com";

const MessageSkeleton = () => (
  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`flex items-end gap-2 max-w-[70%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
        >
          {i % 2 === 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          <div
            className={`px-4 py-3 rounded-2xl ${i % 2 === 0 ? "rounded-bl-md bg-white dark:bg-gray-800" : "rounded-br-md bg-blue-100 dark:bg-blue-900/20"} w-48`}
          >
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function Chat() {
  const {
    user,
    selectedUser,
    setMessages,
    setUsers,
    setUser,
    setUnreadCounts,
    messages,
  } = useChat();
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState<"sidebar" | "chat">("sidebar");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRoomId = useCallback(
    (id1: string, id2: string) => [id1, id2].sort().join("_"),
    [],
  );

  // Fetch users
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/auth/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        const usersList = data.users || data; // ✅ handle both formats
        setUsers(usersList.filter((u: any) => u._id !== user._id));
      })
      .catch(() => toast.error("Failed to load users"));
  }, [user, setUsers]);


// Join room + fetch messages
useEffect(() => {
  if (!selectedUser || !user) return;
  const roomId = getRoomId(user.roomId, selectedUser.roomId);
  socket.emit("joinPrivateRoom", { roomId });
  setLoadingMessages(true);

  // ✅ ADD Authorization header
  fetch(`${API_URL}/api/messages/${roomId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed");
      return res.json();
    })
    .then((data) => {
      const messagesList = data.data || data;
      const formatted = messagesList.map((msg: any) => ({
        _id: msg._id,
        text: msg.text,
        senderName: msg.sender,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
        read: msg.read,
        reactions: msg.reactions || [],
        replyTo: msg.replyTo,
      }));
      setMessages(formatted);
      socket.emit("markAsRead", { roomId, userId: user._id });
    })
    .catch(() => toast.error("Failed to load messages"))
    .finally(() => setLoadingMessages(false));

  setActiveView("chat");
}, [selectedUser, user, setMessages, getRoomId]);

  // Socket events
  useEffect(() => {
    if (!selectedUser || !user) return;
    const currentRoom = getRoomId(user.roomId, selectedUser.roomId);

    const handleMessage = (msg: any) => {
      if (msg.roomId === currentRoom) {
        setMessages((prev) => [...prev, msg]);
        // Mark as read if we're in the room
        socket.emit("markAsRead", { roomId: currentRoom, userId: user._id });
      } else {
        // Increment unread for other rooms
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    const handleTyping = (data: any) => {
      if (data.roomId === currentRoom && data.userId !== user._id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleStopTyping = (data: any) => {
      if (data.roomId === currentRoom && data.userId !== user._id)
        setIsTyping(false);
    };

    socket.on("receivePrivateMessage", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receivePrivateMessage", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser, user, setMessages, setUnreadCounts, getRoomId]);

  // Send message with reply
  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !user) return;
    const roomId = getRoomId(user.roomId, selectedUser.roomId);

    const messageData: any = {
      roomId,
      message: {
        text: message,
        senderName: user.username,
        senderId: user._id,
        createdAt: new Date().toISOString(),
      },
    };

    if (replyTo) {
      messageData.message.replyTo = {
        messageId: replyTo._id,
        text: replyTo.text,
        senderName: replyTo.senderName,
      };
    }

    socket.emit("sendPrivateMessage", messageData);

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        senderName: user.username,
        senderId: user._id,
        createdAt: new Date().toISOString(),
        read: false,
        reactions: [],
        replyTo: replyTo
          ? {
              messageId: replyTo._id,
              text: replyTo.text,
              senderName: replyTo.senderName,
            }
          : undefined,
      },
    ]);

    setMessage("");
    setReplyTo(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
    toast.success("Logged out successfully");
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950">
      <div className="hidden md:flex w-full">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col h-dvh">
          <Header />
          <AnimatePresence mode="wait">
            {loadingMessages ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MessageSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <Messages isTyping={isTyping} onReply={setReplyTo} />
              </motion.div>
            )}
          </AnimatePresence>
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>

      <div className="flex-1 md:hidden">
        {activeView === "sidebar" && <Sidebar onLogout={handleLogout} />}
        {activeView === "chat" && selectedUser && (
          <div className="flex flex-col h-dvh">
            <Header onBack={() => setActiveView("sidebar")} />
            {loadingMessages ? (
              <MessageSkeleton />
            ) : (
              <Messages isTyping={isTyping} onReply={setReplyTo} />
            )}
            <MessageInput
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
