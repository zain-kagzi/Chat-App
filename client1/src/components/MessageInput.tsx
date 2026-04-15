type Props = {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  selectedUser: string | null;
};

export default function MessageInput({
  message,
  setMessage,
  sendMessage,
  selectedUser,
}: Props) {
  if (!selectedUser) return null;

  return (
    <div className="p-3 bg-gray-700 flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 rounded bg-gray-800 text-white outline-none"
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-green-500 px-4 py-2 rounded text-white"
      >
        Send
      </button>
    </div>
  );
}