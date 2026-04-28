import { useChat } from "../hooks/useChat";


export default function Messages() {
  const { messages, user } = useChat();

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
      
      {messages.map((msg: any, index: number) => {
        const isMe = msg.senderName === user?._id;

        return (
          <div
            key={index}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end gap-2 max-w-xs">
              
              {/* Bubble */}
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>

                {/* Time */}
                <p
                  className={`text-[10px] mt-1 text-right ${
                    isMe ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {msg.time || "11:00"}
                </p>
              </div>

              {/* Heart icon (optional like UI) */}
              <span className="text-gray-400 text-xs cursor-pointer">♡</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}