import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { socket } from "../../../services/socket/socket";
import { useRoom } from "../../../context/RoomContext";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setRoom } = useRoom();

  const [roomCode, setRoomCode] = useState(searchParams.get("roomCode") || "");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const handleJoinRoom = () => {
    if (!roomCode || !username) {
      return alert("All fields are required");
    }

    setLoading(true);
    const playerId = localStorage.getItem("playerId") || `player_${Date.now()}`;
    localStorage.setItem("username", username.trim());
    localStorage.setItem("playerId", playerId);

    socket.connect();

    socket.emit(
      "join-room",
      {
        roomCode: roomCode.toUpperCase(),
        player: {
          id: playerId,
          username: username.trim()
        }
      },

      (response) => {
        setLoading(false);

        if (!response.success) {
          return alert(response.message);
        }

        const roomCode = response.room.room_code || response.room.roomCode;
        setRoom({
          code: roomCode,
          name: response.room.room_name,
          syncMode: response.room.sync_mode,
          isHost: false
        });

        navigate(`/waiting-room/${roomCode}`);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-black text-white mb-2">
          Join Room
        </h1>

        <p className="text-slate-400 mb-8">
          Enter a room code to join a quiz
        </p>

        <div className="space-y-5">

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Room Code
            </label>

            <input
              type="text"
              placeholder="ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Aliya"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 rounded-xl py-3 font-bold text-white"
          >
            {loading ? "Joining..." : "Join Room"}
          </button>

        </div>
      </div>
    </div>
  );
}
