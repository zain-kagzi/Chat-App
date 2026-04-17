import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, SlidersHorizontal } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import EditProfileModal from "./EditProfile";

const Bottombutton = () => {
  const [open, setOpen] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { username, setUser, user } = useChat();

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(user)
  return (
    //   {/* Bottom Buttons */}
    <div className="flex justify-around items-center pt-3 border-t mt-2 relative">
      <MessageCircle className="w-5 h-5 text-gray-500 cursor-pointer" />
      <Phone className="w-5 h-5 text-gray-500 cursor-pointer" />

      {/* SETTINGS ICON */}
      <div className="relative" ref={dropdownRef}>
        <SlidersHorizontal
          onClick={() => setOpen(!open)}
          className="w-5 h-5 text-gray-500 cursor-pointer"
        />

        {/* DROPDOWN */}
        {open && (
          <div className="absolute bottom-10 right-0 w-52 bg-white rounded-xl shadow-lg p-3 z-50">
            {/* Profile */}
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              {/* Left: Profile Info */}
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5000/uploads/${user?.profilePic}`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{username}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Right: Edit Icon */}
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setOpenProfileModal(true)}
              >
                ✏️
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded"
            >
              Logout
            </button>
            <EditProfileModal
              isOpen={openProfileModal}
              onClose={() => setOpenProfileModal(false)}
              currentName={username}
              onSave={async (name, avatar) => {
                try {
                  const formData = new FormData();
                  formData.append("name", name);

                  if (avatar) {
                    formData.append("avatar", avatar);
                  }

                  const res = await fetch(
                    "http://localhost:5000/api/user/update-profile",
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: formData,
                    },
                  );

                  const data = await res.json();

                  console.log(data);

                  // 👉 UI update
                  setUser(data);
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bottombutton;
