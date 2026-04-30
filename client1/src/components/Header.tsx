import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../hooks/useTheme";

export default function Header({ onBack  }: { onBack?: () => void }) {
  const { selectedUser } = useChat(); // 👈 loggedIn user bhi le liya
  const { theme, toggleTheme } = useTheme();

  // ✅ selected user ka naam
  const name = selectedUser?.username || "Select User";

  // ✅ profile pic URL
  const profilePic = selectedUser?.profilePic
    ? selectedUser.profilePic
    : `https://i.pravatar.cc/150?u=${name}`; // fallback

  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b dark:bg-gray-900 dark:text-white">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        <button onClick={onBack} className="md:hidden mr-2">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <img
            src={profilePic}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          {selectedUser && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>

        {/* Name + Status */}
        <div>
          <h2 className="text-sm font-semibold">{name}</h2>
          <p className="text-xs text-green-500">
            {selectedUser ? "Online" : ""}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}
