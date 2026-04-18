import { useState, useEffect } from "react";
import { useChat } from "../../context/ChatContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user, setUser } = useChat();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    setName(user?.username || "");
  }, [user]);

  // ✅ preview cleanup
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!isOpen) return null;

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("User not logged in");
        return;
      }

      const formData = new FormData();
      formData.append("username", name);

      if (avatar) {
        formData.append("profilePic", avatar);
      }

      const res = await fetch(
        "http://localhost:5000/api/user/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[320px] p-5 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <div className="flex flex-col items-center gap-2 mb-4">
          <img
            src={
              preview ||
              (user?.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}?t=${Date.now()}`
                : "https://i.pravatar.cc/150")
            }
            className="w-20 h-20 rounded-full object-cover"
          />

          <label className="text-sm text-blue-500 cursor-pointer">
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-green-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}