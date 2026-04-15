type User = {
  _id: string;
  username: string;
};

type Props = {
  users: User[];
  selectedUser: string | null;
  setSelectedUser: (user: string) => void;
};

export default function Sidebar({ users, selectedUser, setSelectedUser }: Props) {
  return (
    <div className="w-1/4 bg-gray-800 p-4">
      <h2 className="text-white mb-3">Users</h2>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user.username)}
          className={`p-2 text-white cursor-pointer rounded 
            ${
              selectedUser === user.username
                ? "bg-green-600"
                : "hover:bg-gray-700"
            }`}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}