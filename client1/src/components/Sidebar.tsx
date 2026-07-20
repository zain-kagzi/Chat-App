import { useState, useEffect } from "react";
import { Search, Moon, Sun, LogOut, MessageSquare, Users } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import Bottombutton from "../assets/Sidebar components/Bottombutton";
import { socket } from "../components/socket";

type Props = {
  onLogout: () => void;
};

export default function Sidebar({ onLogout }: Props) {
  const { users, selectedUser, setSelectedUser, user, unreadCounts, onlineUsers, setOnlineUsers } = useChat();
  const { theme, toggleTheme } = useTheme();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "users">("chats");

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    };
    const handleOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [setOnlineUsers]);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  return (
    <div className="lg:w-[320px] h-dvh bg-white flex flex-col shadow-xl relative dark:bg-gray-900 dark:text-white">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chats
            </h1>
            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold dark:bg-blue-900/30 dark:text-blue-400">
              {users.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onLogout} className="p-2 rounded-xl hover:bg-red-50 text-red-500 dark:hover:bg-red-900/20 transition" title="Logout">
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-800 dark:text-white transition"
          />
        </div>

        <div className="flex gap-1 mb-2">
          <button onClick={() => setActiveTab("chats")} className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${activeTab === "chats" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
            <MessageSquare className="w-3.5 h-3.5" /> Chats
          </button>
          <button onClick={() => setActiveTab("users")} className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${activeTab === "users" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
            <Users className="w-3.5 h-3.5" /> Users
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" /> No users found
            </motion.div>
          ) : (
            filteredUsers.map((u, index) => {
              const unread = unreadCounts[u._id] || 0;
              const online = isUserOnline(u._id);

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedUser(u)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedUser?._id === u._id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={u?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=random&color=fff`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                      alt={u.username}
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(u.profilePic ?? null); }}
                    />
                    {online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900">
                        <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold truncate">{u.username}</h2>
                      {unread > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center"
                        >
                          {unread > 99 ? "99+" : unread}
                        </motion.span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${selectedUser?._id === u._id ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
                      {online ? "Online" : "Offline"}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="border-4 border-white rounded-full overflow-hidden shadow-2xl">
              <img src={previewImage} className="w-64 h-64 object-cover" alt="Preview" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "U")}&background=random&color=fff`}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
              alt={user?.username}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.username}</p>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <div className="mt-2">
          <Bottombutton />
        </div>
      </div>
    </div>
  );
}