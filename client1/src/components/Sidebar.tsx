import Bottombutton from "../assets/Sidebar components/Bottombutton";
import {
  Search,
  Edit,
} from "lucide-react";
import { useChat } from "../hooks/useChat";

export default function Sidebar() {
  const { users, selectedUser, setSelectedUser } = useChat();
  

  // close dropdown on outside click
  

  return (
    <div className="w-[320px] h-screen bg-gray-100 flex flex-col p-4 shadow-lg relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Messages</h1>
        <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm mb-4">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {users.map((user: any) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
              selectedUser === user.username
                ? "bg-white shadow"
                : "hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePic}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-sm font-semibold">{user.username}</h2>
                <p className="text-xs text-gray-500">Tap to chat...</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Now</p>
          </div>
          
        ))}
        
      </div>
      <Bottombutton/>
    </div>
  );
}