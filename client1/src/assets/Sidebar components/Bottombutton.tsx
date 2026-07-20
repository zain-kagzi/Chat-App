import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, Settings, User, LogOut } from "lucide-react";
import EditProfileModal from "./EditProfile";
import { useChat } from "../../hooks/useChat";
import { motion, AnimatePresence } from "framer-motion";

const Bottombutton = () => {
  const [open, setOpen] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useChat();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Profile", action: () => setOpenProfileModal(true) },
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: LogOut, label: "Logout", action: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }, danger: true },
  ];

  return (
    <div className="flex justify-around items-center pt-2 relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
      >
        <Phone className="w-5 h-5" />
      </motion.button>

      {/* SETTINGS DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-12 right-0 w-56 bg-white rounded-2xl shadow-2xl p-2 z-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                <img
                  src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "U")}&background=random&color=fff`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div>
                  <p className="text-sm font-bold dark:text-white">{user?.username}</p>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>

              {/* Menu Items */}
              {menuItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    item.danger
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EditProfileModal
        isOpen={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      />
    </div>
  );
};

export default Bottombutton;