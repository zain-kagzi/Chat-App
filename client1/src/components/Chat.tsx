import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useChat } from "../context/ChatContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Messages from "./Message";
import MessageInput from "./MessageInput";

export default function Chat() {
  const { user, selectedUser, setMessages, setUsers } = useChat();

  const username = user?.username;

  const [message, setMessage] = useState("");

  console.log("SELECTED USER:", selectedUser);

  // ✅ fetch users
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (u: any) => u.username !== user.username
        );
        setUsers(filtered);
      })
      .catch((err) => console.error(err));
  }, [user]); // 🔥 FIX

  const getRoomId = (u1: string, u2: string) =>
    [u1, u2].sort().join("_");

  // ✅ join room + fetch messages
  useEffect(() => {
    if (!selectedUser || !username) return;

    const receiverName =
      typeof selectedUser === "string"
        ? selectedUser
        : selectedUser.username;

    const roomId = getRoomId(username, receiverName);

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

    const receiverName =
      typeof selectedUser === "string"
        ? selectedUser
        : selectedUser.username;

    const currentRoom = getRoomId(username, receiverName);

    const handleMessage = (msg: any) => {
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
    if (!message.trim() || !selectedUser || !user) return;

    const receiverName =
      typeof selectedUser === "string"
        ? selectedUser
        : selectedUser.username;

    const roomId = getRoomId(user.username, receiverName);

    socket.emit("sendPrivateMessage", {
      roomId,
      message: {
        text: message,
        senderName: user.username,
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