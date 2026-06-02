import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { socket } from "../../../services/socket/socket";
import { useRoom } from "../../../context/RoomContext";
import { apiUrl } from "../../../config/api";

const demoHostUser = {
  id: "7c0e7d5d-bf7c-4a2f-8e7f-34d1d52caa90",
  username: "Aliya"
};

export default function CreateRoom() {
  const navigate = useNavigate();
  const { setRoom } = useRoom();

  const [roomName, setRoomName] = useState("");
  const [quizId, setQuizId] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(socket.connected);
  const [roomCreated, setRoomCreated] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const joinUrl = createdRoomCode
    ? `${window.location.origin}/join-room?roomCode=${encodeURIComponent(createdRoomCode)}`
    : "";

  useEffect(() => {
    fetch(apiUrl("/api/quizzes"))
      .then(res => res.json())
      .then(response => {
        const quizzesArray = response?.data || response || [];
        setQuizzes(quizzesArray);

        if (quizzesArray.length > 0) {
          setQuizId(quizzesArray[0].id);
        }

        setLoadingQuizzes(false);
      })
      .catch(() => {
        setError("Failed to load quizzes. Create a quiz first, then come back to create a room.");
        setLoadingQuizzes(false);
      });
  }, []);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return setError("Room name required");
    if (!quizId) return setError("Select a quiz");
    if (!connected) return setError("WebSocket not connected");

    setLoading(true);
    setError("");
    const hostUsername = roomName.trim();
    localStorage.setItem("username", hostUsername);
    localStorage.setItem("playerId", demoHostUser.id);

    const payload = {
      hostId: demoHostUser.id,
      username: hostUsername,
      quizId,
      roomName: roomName.trim(),
      syncMode: "server",
      delayLevel: "medium",
      delayMs: null
    };

    try {
      const res = await fetch(apiUrl("/api/rooms/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        const room = result.data;
        const roomCode = room.room_code;

        setCreatedRoomCode(roomCode);
        setRoomCreated(true);

        socket.emit("join-room", {
          roomCode,
          player: {
            id: demoHostUser.id,
            username: hostUsername
          }
        });

        setRoom({
          id: room.id,
          code: roomCode,
          roomCode,
          name: roomName,
          roomName,
          quizId,
          isHost: true,
          hostId: demoHostUser.id
        });
      } else {
        setError(result.message || "Room creation failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingQuizzes) {
    return <div className="text-white p-8">Loading quizzes...</div>;
  }

  if (roomCreated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
          <h1 className="text-3xl text-white mb-4">Room Created!</h1>

          <div className="bg-slate-700 p-6 rounded-xl mb-4">
            <p className="text-emerald-400 text-4xl font-mono">
              {createdRoomCode}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl mb-4 inline-block">
            <QRCodeCanvas
              value={joinUrl}
              size={210}
              level="H"
              includeMargin
            />
          </div>

          <p className="text-slate-300 text-sm mb-4">
            Scan this QR code to open the join page with the room code filled in.
          </p>

          <button
            onClick={() => navigator.clipboard.writeText(createdRoomCode)}
            className="w-full bg-emerald-600 py-2 rounded mb-3"
          >
            Copy Code
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(joinUrl)}
            className="w-full bg-slate-700 py-2 rounded mb-3 text-white"
          >
            Copy Join Link
          </button>

          <button
            onClick={() => navigate(`/waiting-room/${createdRoomCode}`)}
            className="w-full bg-blue-600 py-3 rounded"
          >
            Enter Waiting Room →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-800 p-6 rounded-xl">

        <h1 className="text-white text-2xl mb-4">Create Room</h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          placeholder="Room name"
          className="w-full mb-3 p-2 bg-slate-700 text-white"
        />

        <select
          value={quizId}
          onChange={e => setQuizId(e.target.value)}
          className="w-full mb-3 p-2 bg-slate-700 text-white"
        >
          {!quizzes.length && (
            <option value="">No quizzes available</option>
          )}
          {quizzes.map(q => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreateRoom}
          disabled={loading || !quizzes.length}
          className="w-full bg-blue-600 py-2 text-white rounded"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

        {!quizzes.length && (
          <button
            onClick={() => navigate("/quizzes/create")}
            className="w-full mt-3 bg-emerald-600 py-2 text-white rounded"
          >
            Create Quiz
          </button>
        )}

      </div>
    </div>
  );
}
