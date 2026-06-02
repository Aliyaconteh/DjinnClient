import { useState } from "react";
import { apiUrl } from "../../../config/api";

export default function Leaderboard() {
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeaderboard = async () => {
    if (!roomCode.trim()) return setError("Enter a room code.");

    setLoading(true);
    setError("");
    try {
      const response = await fetch(apiUrl(`/api/leaderboard/${roomCode.trim().toUpperCase()}`)).then((res) => res.json());
      if (!response.success) throw new Error(response.message || "Leaderboard not found");
      setPlayers(response.data || []);
    } catch (err) {
      setError(err.message);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-slate-400 uppercase tracking-wide">Scores</p>
          <h1 className="text-4xl font-black mt-1">Room Leaderboard</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <label className="block text-sm text-slate-300 mb-2">Room Code</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 uppercase"
              placeholder="ABC123"
            />
            <button
              onClick={loadLeaderboard}
              disabled={loading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-5 py-3 font-bold"
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-950/50 px-4 py-3 text-red-100">
            {error}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-black mb-5">Players</h2>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id || player.player_id}
                className="flex items-center justify-between rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
              >
                <span className="font-semibold">{index + 1}. {player.username || player.player_id || "Player"}</span>
                <span className="font-black text-emerald-400">{Number(player.score || 0)}</span>
              </div>
            ))}

            {!players.length && (
              <p className="text-slate-400">Enter a room code to view scores.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
