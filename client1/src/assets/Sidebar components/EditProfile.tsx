import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useChat } from "../../hooks/useChat";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "https://chat-app-6uvx.onrender.com";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user, setUser } = useChat();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.username || "");
    setPreview(user?.profilePic || "");
  }, [user, isOpen]);

  useEffect(() => {
    return () => {
      if (preview && preview !== user?.profilePic) URL.revokeObjectURL(preview);
    };
  }, [preview, user?.profilePic]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setAvatar(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      toast.success("Image ready!");
    } catch (err) {
      toast.error("Image processing failed");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("username", name);
      if (avatar) formData.append("profilePic", avatar);

      const res = await fetch(`${API_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated!", { id: toastId });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl dark:bg-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">Edit Profile</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tap camera to change photo</p>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              placeholder="Your username"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}