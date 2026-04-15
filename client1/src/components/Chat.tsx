import { useEffect, useState } from "react";
import { socket } from "./socket";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Messages from "./Message";
import MessageInput from "./MessageInput";

type Message = {
  text: string;
  senderName: string;
};

type User = {
  _id: string;
  username: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const name = localStorage.getItem("username") || "Anonymous";
    setUsername(name);
  }, []);

  useEffect(() => {
    if (!username) return;

    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (user: User) => user.username !== username
        );
        setUsers(filtered);
      });
  }, [username]);

  const getRoomId = (u1: string, u2: string) =>
    [u1, u2].sort().join("_");

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
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex-1 flex flex-col">
        <Header selectedUser={selectedUser} username={username} />
        <Messages messages={messages} username={username} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
}