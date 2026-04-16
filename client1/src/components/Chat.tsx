import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useChat } from "../context/ChatContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Messages from "./Message";
import MessageInput from "./MessageInput";


export default function Chat() {
  const {
    username,
    setUsername,
    selectedUser,
    setMessages,
    setUsers,
  } = useChat();

  const [message, setMessage] = useState("");

  // ✅ get username
  useEffect(() => {
    const name = localStorage.getItem("username") || "Anonymous";
    setUsername(name);
  }, []);

  // ✅ fetch users
  useEffect(() => {
    if (!username) return;

    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (user: any) => user.username !== username
        );
        setUsers(filtered);
      });
  }, [username]);

  const getRoomId = (u1: string, u2: string) =>
    [u1, u2].sort().join("_");

  // ✅ join room + fetch messages
  useEffect(() => {
    if (!selectedUser || !username) return;

    const roomId = getRoomId(username, selectedUser);

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
  }, [selectedUser, username]);

  // ✅ receive messages
  useEffect(() => {
    if (!selectedUser || !username) return;

    const handleMessage = (msg: any) => {
      const currentRoom = getRoomId(username, selectedUser);

      if (msg.roomId === currentRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receivePrivateMessage", handleMessage);

    return () => {
      socket.off("receivePrivateMessage", handleMessage);
    };
  }, [selectedUser, username]);

  // ✅ send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const roomId = getRoomId(username, selectedUser);

    socket.emit("sendPrivateMessage", {
      roomId,
      message: { text: message, senderName: username },
    });

    setMessage("");
  };

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