import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Smile, Reply } from "lucide-react";
import { socket } from "./socket";

type Props = {
  isTyping?: boolean;
  onReply?: (msg: any) => void;
};

export default function Messages({ isTyping, onReply }: Props) {
  const { messages, user, selectedUser } = useChat();
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const emojis = ["❤️", "🔥", "👍", "😂", "😮", "😢", "🎉", "👏"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Listen for reactions
  

  const handleReaction = (messageId: string, emoji: string) => {
    if (!user) return;
    socket.emit("addReaction", {
      messageId,
      emoji,
      userId: user._id,
    });
    setShowReactionPicker(null);
  };

  const getReactionCounts = (reactions?: any[]) => {
    if (!reactions?.length) return null;
    const counts: Record<string, number> = {};
    reactions.forEach((r) => {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50 space-y-4 dark:bg-gray-900 scroll-smooth h-full min-h-0">
      {messages.length === 0 && !isTyping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-full min-h-[200px] text-center"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">👋</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No messages yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Say hello to start the conversation!</p>
        </motion.div>
      )}

      {messages.length > 0 && (
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
          <span className="px-4 text-xs text-gray-400 dark:text-gray-500 font-medium">Today</span>
          <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
        </div>
      )}

      <AnimatePresence>
        {messages.map((msg, index) => {
          const isMe = msg.senderName === user?.username;
          const reactionCounts = getReactionCounts(msg.reactions);

          return (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setHoveredMessage(index)}
              onMouseLeave={() => {
                setHoveredMessage(null);
                setShowReactionPicker(null);
              }}
            >
              <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md"
                  >
                    {msg.senderName?.charAt(0).toUpperCase()}
                  </motion.div>
                )}

                <div className="group relative">
                  {msg.replyTo && (
                    <div className={`mb-1 px-3 py-1.5 rounded-lg text-xs ${
                      isMe ? "bg-blue-700/50 text-blue-100" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      <p className="font-medium truncate">{msg.replyTo.senderName}</p>
                      <p className="truncate opacity-75">{msg.replyTo.text}</p>
                    </div>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-md relative ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[10px] ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                        {msg.createdAt
                          ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: false })
                          : "Just now"}
                      </span>
                      {isMe && (
                        <span className="text-blue-200">
                          {msg.read ? (
                            <CheckCheck className="w-3 h-3 text-blue-300" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>

                    {reactionCounts && Object.keys(reactionCounts).length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -bottom-3 ${isMe ? "left-0" : "right-0"} flex gap-0.5 bg-white dark:bg-gray-700 rounded-full px-1.5 py-0.5 shadow-md border border-gray-100 dark:border-gray-600`}
                      >
                        {Object.entries(reactionCounts).map(([emoji, count]) => (
                          <span key={emoji} className="text-xs flex items-center gap-0.5">
                            {emoji} {count > 1 && <span className="text-[9px] text-gray-500">{count}</span>}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {hoveredMessage === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`absolute -top-8 ${isMe ? "left-0" : "right-0"} flex gap-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-lg border border-gray-100 dark:border-gray-700 z-10`}
                      >
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === index ? null : index)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                        >
                          <Smile className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => onReply?.(msg)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                        >
                          <Reply className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showReactionPicker === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute -top-12 ${isMe ? "left-0" : "right-0"} flex gap-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1.5 shadow-xl border border-gray-100 dark:border-gray-700 z-20`}
                      >
                        {emojis.map((emoji) => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => msg._id && handleReaction(msg._id, emoji)}
                            className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-7 h-7 flex items-center justify-center transition"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {selectedUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1 shadow-md">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}