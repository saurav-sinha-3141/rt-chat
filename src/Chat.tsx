import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "./ws_client";

const Chat = ({
  socket,
  roomId,
  username,
}: {
  socket: WebSocket | null;
  roomId: string;
  username: string;
}) => {
  const [chat, setChat] = useState<{ text: string; sender: string }[]>([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat" && data.message && data.sender) {
          setChat((prev) => {
            if (data.sender === username) {
              return prev;
            }
            return [...prev, { text: data.message, sender: data.sender }];
          });
        } else if (data.type === "system" && data.message) {
          showToast(data.message);
        } else {
          console.warn("Unknown message structure:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket, username]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  function handleSendMessage() {
    if (message.trim() && socket) {
      sendChatMessage(roomId, message, socket);
      setChat((prev) => [...prev, { text: message, sender: username }]);
      setMessage("");
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="bg-black h-screen text-white flex flex-col items-center p-4 relative">
      <div className="absolute top-4 bg-gray-800 px-4 py-2 rounded-lg text-center">
        <span className="text-lg font-semibold">Room ID: </span>
        <span className="text-yellow-400 font-mono">{roomId}</span>
      </div>

      {toast && (
        <div className="absolute top-16 bg-blue-500 text-white px-4 py-2 rounded-lg transition-opacity duration-300">
          {toast}
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="w-full max-w-6xl flex flex-col gap-2 overflow-y-auto h-full my-5 hide-scrollbar"
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === username ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-xs m-2 ${
                msg.sender === username ? "self-end" : "self-start"
              }`}
            >
              {msg.sender}
            </span>
            <div
              className={`p-3 rounded-lg max-w-xl break-words whitespace-pre-wrap ${
                msg.sender === username
                  ? "bg-white text-black self-end"
                  : "bg-gray-700 text-white self-start"
              }`}
            >
              <p className="mt-1">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md gap-3 mb-6">
        <input
          value={message}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 w-full rounded-lg outline-none px-3 py-2 font-light"
          placeholder="Message"
        />
        <button
          onClick={handleSendMessage}
          className="bg-white text-black px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-slate-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
