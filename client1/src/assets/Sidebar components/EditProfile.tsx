import { useState } from "react";
import { useChat } from "../../context/ChatContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string, avatar: File | null) => void;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onSave,
}: Props) {
  const { user } = useChat();
  const [name, setName] = useState(user?.username || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  if (!isOpen) return null;

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    onSave(name, avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[320px] p-5 shadow-lg">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <img
            src={preview || `http://localhost:5000/uploads/${user?.profilePic}`}
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

        {/* Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none"
          placeholder="Enter name"
        />

        {/* Buttons */}
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
