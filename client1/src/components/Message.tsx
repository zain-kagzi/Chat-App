type Message = {
  text: string;
  senderName: string;
};

type Props = {
  messages: Message[];
  username: string;
};

export default function Messages({ messages, username }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, index) => {
        const isMe = msg.senderName === username;

        return (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded ${
              isMe
                ? "bg-green-500 ml-auto text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            <strong>{msg.senderName}: </strong>
            {msg.text}
          </div>
        );
      })}
    </div>
  );
}