import { useChat } from "../context/ChatContext";
import { Mic, MoreHorizontal, Send } from "lucide-react";

type Props = {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
};

export default function MessageInput({
  message,
  setMessage,
  sendMessage,
}: Props) {
  const { selectedUser } = useChat();

  if (!selectedUser) return null;

  return (
    <div className="p-3 bg-gray-100 border-t flex items-center gap-3">
      
      {/* Left icon */}
      <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />

      {/* Input box */}
      <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 shadow-sm">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here..."
          className="flex-1 outline-none text-sm bg-transparent"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* Mic icon */}
        <Mic className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* Send button (only show when typing) */}
      {message.trim() ? (
        <button
          onClick={sendMessage}
          className="bg-green-500 p-2 rounded-full text-white hover:bg-green-600 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}