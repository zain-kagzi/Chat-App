import { ArrowLeft, Sun, Moon, Phone, Video, MoreVertical } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

export default function Header({ onBack }: { onBack?: () => void }) {
  const { selectedUser } = useChat();
  const { theme, toggleTheme } = useTheme();

  const name = selectedUser?.username || "Select a user";
  const profilePic = selectedUser?.profilePic
    ? selectedUser.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </motion.button>

        {/* Avatar with online indicator */}
        <div className="relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={profilePic}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
          {selectedUser && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
            >
              <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></span>
            </motion.span>
          )}
        </div>

        {/* Name + Status */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{name}</h2>
          <p className="text-xs text-green-500 font-medium">
            {selectedUser ? "Online" : ""}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hidden sm:block"
        >
          <Phone className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hidden sm:block"
        >
          <Video className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}