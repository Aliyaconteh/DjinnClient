import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../../services/socket/socket";
import { useRoom } from "../../../context/RoomContext";
import { apiUrl } from "../../../config/api";
import { useToast } from "../../../components/ui/ToastContext";

export default function WaitingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { room, setRoom } = useRoom();
  const initialHostRef = useRef(room?.isHost || false);

  const { addToast } = useToast();

  const [loading, setLoading] = useState(!room || !room.players);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    // 1. Fetch current room details on mount
    fetch(apiUrl(`/api/rooms/${roomCode}`))
      .then((res) => {
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      })
      .then((response) => {
        if (response.success) {
          const roomData = response.data.room;
          const dbPlayers = response.data.players || [];
          const mappedPlayers = dbPlayers.map((p) => ({
            id: p.id,
            userId: p.user_id,
            username: p.username,
            isHost: p.user_id === roomData.host_id || p.username === roomData.host_id,
            score: p.score || 0
          }));

          // Determine if current player is host
          const currentUsername = localStorage.getItem("username");
          const isHost = initialHostRef.current || roomData.host_id === currentUsername;

          setRoom({
            id: roomData.id,
            roomCode: roomData.room_code,
            roomName: roomData.room_name,
            quizId: roomData.quiz_id,
            syncMode: roomData.sync_mode,
            delayLevel: roomData.delay_level,
            delayMs: roomData.delay_ms,
            players: mappedPlayers,
            isHost: isHost
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading waiting room:", err);
        setError(err.message);
        setLoading(false);
      });

    // 2. Setup socket listeners
    const handleRoomUpdate = (updatedRoom) => {
      console.debug("Room update received via socket:", updatedRoom);
      setRoom((prev) => ({
        ...prev,
        ...updatedRoom,
        isHost: prev?.isHost || updatedRoom.players.find(p => p.username === localStorage.getItem("username"))?.isHost
      }));
    };

    const handleRoomStarted = (data) => {
      console.debug("Room started event received:", data);
      navigate(`/game/${roomCode}`);
    };

    socket.on("room:update", handleRoomUpdate);
    socket.on("room:started", handleRoomStarted);

    // Make sure socket is connected and joins room roomCode
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join-room", { 
      roomCode, 
      player: { 
        id: localStorage.getItem("playerId") || socket.id || `player_${Date.now()}`,
        username: localStorage.getItem("username") || "Guest"
      } 
    });

    return () => {
      socket.off("room:update", handleRoomUpdate);
      socket.off("room:started", handleRoomStarted);
    };
  }, [navigate, roomCode, setRoom]);

  const handleStartQuiz = async () => {
    setStarting(true);
    try {
      const res = await fetch(apiUrl("/api/rooms/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode })
      });
      const result = await res.json();
      if (result.success) {
        // Emit socket event to notify all connected sockets to start
        socket.emit("start-game", { roomCode, quizId: room?.quizId });
      } else {
        addToast(result.message || "Failed to start quiz", { type: "error" });
      }
    } catch (err) {
      addToast("Error starting quiz: " + err.message, { type: "error" });
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
        <span>Loading waiting room...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6">
        <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6 text-center max-w-md">
          <p className="text-2xl mb-2">⚠️ Error</p>
          <p className="text-red-200 mb-6">{error}</p>
          <button onClick={() => navigate("/")} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <span className="text-blue-500 font-bold tracking-wider uppercase text-xs">Waiting Lobby</span>
            <h1 className="text-3xl md:text-5xl font-black mt-1">{room?.roomName || "Quiz Lobby"}</h1>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold">Room Code</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 tracking-wider mt-0.5">{roomCode}</p>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-slate-400 text-xs uppercase font-semibold block mb-1">Sync Strategy</span>
            <span className="text-lg font-bold text-blue-400">{room?.syncMode === "server" ? "Server-Authoritative" : "Optimistic (Fast-First)"}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-slate-400 text-xs uppercase font-semibold block mb-1">Simulated Delay</span>
            <span className="text-lg font-bold text-amber-500">{room?.delayLevel === "custom" ? `${room?.delayMs} ms` : room?.delayLevel || "None"}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-slate-400 text-xs uppercase font-semibold block mb-1">Players Connected</span>
            <span className="text-lg font-bold text-emerald-400">{room?.players?.length || 0}</span>
          </div>
        </div>

        {/* PLAYERS LIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Connected Players</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-400">Waiting for host...</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {room?.players && room.players.length > 0 ? (
              room.players.map((player) => (
                <div
                  key={player.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl px-5 py-4 flex justify-between items-center hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                      {player.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">{player.username}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {player.isHost ? "👑 Host" : "Player"}
                      </p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-slate-500">
                No players connected yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER HOST ACTIONS */}
      <div className="max-w-3xl mx-auto w-full mt-8 border-t border-slate-800 pt-6">
        {room?.isHost ? (
          <button
            onClick={handleStartQuiz}
            disabled={starting || !room?.players || room.players.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-slate-500 font-black py-4 rounded-2xl transition duration-300 shadow-xl shadow-blue-500/10 text-lg flex items-center justify-center gap-2"
          >
            {starting ? "Starting..." : "Start Quiz Session"}
          </button>
        ) : (
          <div className="text-center bg-slate-900/50 border border-slate-800 rounded-2xl py-4 text-slate-400 text-sm">
            Please wait. The host will start the quiz shortly...
          </div>
        )}
      </div>
    </div>
  );
}
