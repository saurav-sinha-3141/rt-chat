const apiUrl = import.meta.env.VITE_API_URL;

export function createRoom(
  username: string,
  setRoomId: (id: string) => void
): WebSocket {
  const socket = new WebSocket(apiUrl);

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established!");
    socket.send(JSON.stringify({ type: "create", payload: { username } }));
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "roomCreated" && data.roomId) {
      setRoomId(data.roomId);
    }
  });

  return socket;
}

export function joinRoom(
  roomId: string,
  username: string,
  callback: () => void
): WebSocket {
  const socket = new WebSocket(apiUrl);

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established!");
    socket.send(
      JSON.stringify({ type: "join", payload: { username, roomId } })
    );
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "joinedRoom") {
      callback();
    }
  });

  return socket;
}

export function sendChatMessage(
  roomId: string,
  message: string,
  socket: WebSocket
) {
  socket.send(JSON.stringify({ type: "chat", payload: { roomId, message } }));
}
