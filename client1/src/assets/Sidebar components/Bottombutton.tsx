import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, SlidersHorizontal } from "lucide-react";
import EditProfileModal from "./EditProfile";
import { useChat } from "../../hooks/useChat";

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

  return (
    <div className="flex justify-around items-center pt-3 border-t mt-2 relative">
      <MessageCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
      <Phone className="w-5 h-5 text-gray-500 cursor-pointer" />

      {/* SETTINGS */}
      <div className="relative" ref={dropdownRef}>
        <SlidersHorizontal
          onClick={() => setOpen(!open)}
          className="w-5 h-5 text-gray-500 cursor-pointer"
        />

        {open && (
          <div className="absolute bottom-10 right-0 w-52 bg-white rounded-xl shadow-lg p-3 z-50">
            
            {/* PROFILE */}
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user?.profilePic
                      ? user.profilePic
                      : "https://i.pravatar.cc/150"
                  }
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{user?.username}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setOpenProfileModal(true)}
              >
                ✏️
              </button>
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ✅ Modal OUTSIDE dropdown (IMPORTANT) */}
      <EditProfileModal
        isOpen={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      />
    </div>
  );
};

export default Bottombutton;