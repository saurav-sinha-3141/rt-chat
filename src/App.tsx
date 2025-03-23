import { useState } from "react";
import { createRoom, joinRoom } from "./ws_client";
import Chat from "./Chat";

function App() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [inChat, setInChat] = useState(false);

  function handleCreateRoom() {
    const newSocket = createRoom(username, (id) => {
      setRoomId(id);
      setInChat(true);
    });
    setSocket(newSocket);
  }

  function handleJoinRoom() {
    const newSocket = joinRoom(roomId, username, () => setInChat(true));
    setSocket(newSocket);
  }

  return (
    <>
      {inChat ? (
        <Chat socket={socket} roomId={roomId} username={username} />
      ) : (
        <div className="flex flex-col space-y-4 h-screen justify-center items-center bg-black text-white font-mono font-bold px-4">
          <button
            disabled={!username}
            onClick={handleCreateRoom}
            className="bg-white text-black px-6 py-3 rounded-lg hover:cursor-pointer hover:enabled:bg-slate-200 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Room
          </button>
          <div className="w-full max-w-md flex space-x-4">
            <div className="flex flex-col space-y-4 w-2/3">
              <input
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 w-full rounded-lg outline-0 px-3 py-2 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter Username"
              />
              <input
                onChange={(e) => setRoomId(e.target.value)}
                className="border-2 w-full rounded-lg outline-0 px-3 py-2 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter Room ID"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={!username || !roomId}
              className="bg-white text-black px-4 py-2 rounded-lg w-1/3 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-slate-200"
            >
              Join Room
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
