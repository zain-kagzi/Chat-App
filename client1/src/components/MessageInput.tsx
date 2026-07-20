import { useState, useRef } from "react";
import { Mic, Send, Paperclip, Smile, X } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "./socket";

type Props = {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  replyTo?: any;
  onCancelReply?: () => void;
};

export default function MessageInput({
  message,
  setMessage,
  sendMessage,
  replyTo,
  onCancelReply,
}: Props) {
  const { selectedUser, user } = useChat();
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!selectedUser) return null;

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "😭", "😍", "🎉", "🤔", "👏"];

  const handleInputChange = (value: string) => {
    setMessage(value);
    if (!user || !selectedUser) return;
    const getRoomId = (id1: string, id2: string) => [id1, id2].sort().join("_");
    const roomId = getRoomId(user.roomId, selectedUser.roomId);
    socket.emit("typing", { roomId, userId: user._id });
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage();
  };

  return (
    <div className="p-3 bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{replyTo.senderName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{replyTo.text}</p>
            </div>
            <button onClick={onCancelReply} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-2 mb-2 px-2">
            {emojis.map((emoji) => (
              <button key={emoji} onClick={() => { setMessage(message + emoji); inputRef.current?.focus(); }} className="text-xl hover:scale-125 transition-transform">
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition">
          <Paperclip className="w-5 h-5" />
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowEmoji(!showEmoji)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition">
          <Smile className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 shadow-sm dark:bg-gray-800">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={replyTo ? "Reply..." : "Type a message..."}
            className="flex-1 outline-none text-sm bg-transparent dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        <AnimatePresence mode="wait">
          {message.trim() ? (
            <motion.button key="send" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 45 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSend} className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-700 transition">
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-gray-200 p-3 rounded-full text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}