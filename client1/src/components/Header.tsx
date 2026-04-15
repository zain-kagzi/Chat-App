type Props = {
  selectedUser: string | null;
  username: string;
};

export default function Header({ selectedUser, username }: Props) {
  return (
    <div className="flex justify-between items-center bg-gray-700 text-white p-4">
      <div>
        {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
      </div>

      <div className="flex gap-5 items-center">
        <h2>💬 Chat App</h2>
        <span>{username}</span>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}