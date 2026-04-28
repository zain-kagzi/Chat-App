import { useEffect, useState } from "react";
import { socket } from "./socket";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Messages from "./Message";
import MessageInput from "./MessageInput";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const { user, selectedUser, setMessages, setUsers } = useChat();
  const [message, setMessage] = useState("");

  console.log("SELECTED USER:", selectedUser);
  // ✅ fetch users
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (u: any) => u._id !== user._id // 🔥 FIX (username nahi, id compare)
        );
        setUsers(filtered);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // ✅ 🔥 ROOM ID using USER roomId
  const getRoomId = (id1: string, id2: string) =>
    [id1, id2].sort().join("_");

  // ✅ join room + fetch messages
  useEffect(() => {
    if (!selectedUser || !user) return;

    const roomId = getRoomId(user.roomId, selectedUser.roomId); // 🔥 FIX

    socket.emit("joinPrivateRoom", { roomId });

    fetch(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((msg: any) => ({
          text: msg.text,
          senderName: msg.sender,
        }));
        setMessages(formatted);
      });
  }, [selectedUser, user]);

  // ✅ receive messages
  useEffect(() => {
    if (!selectedUser || !user) return;

    const currentRoom = getRoomId(user.roomId, selectedUser.roomId);

    const handleMessage = (msg: any) => {
      if (msg.roomId === currentRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receivePrivateMessage", handleMessage);

    return () => {
      socket.off("receivePrivateMessage", handleMessage);
    };
  }, [selectedUser, user]);

  // ✅ send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !user) return;

    const roomId = getRoomId(user.roomId, selectedUser.roomId);

    socket.emit("sendPrivateMessage", {
      roomId,
      message: {
        text: message,
        senderName: user._id, // UI ke liye
      },
    });

    setMessage("");
  };

  // ✅ safety UI
  if (!user) {
    return (
      <div className="text-white flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <Messages />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}