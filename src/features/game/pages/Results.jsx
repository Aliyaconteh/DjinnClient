import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "../../../context/GameContext";
import { apiUrl } from "../../../config/api";

export default function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { leaderboard, setLeaderboard, resetGame } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (leaderboard?.length) return;

    fetch(apiUrl(`/api/leaderboard/${roomCode}/final`))
      .then((res) => res.json())
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Could not load results");
        setLeaderboard(response.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [leaderboard?.length, roomCode, setLeaderboard]);

  const sorted = useMemo(
    () => [...(leaderboard || [])].sort((a, b) => Number(b.score || 0) - Number(a.score || 0)),
    [leaderboard]
  );
  const winner = sorted[0];

  const handleBackToHome = () => {
    resetGame();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-slate-400 uppercase tracking-wide text-sm">Room {roomCode}</p>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Game Results</h1>
        </div>

        {winner && (
          <div className="bg-amber-500 text-slate-950 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm font-bold uppercase tracking-wide">Winner</p>
            <h2 className="text-3xl font-black mt-1">{winner.username || "Player"}</h2>
            <p className="font-bold mt-1">{Number(winner.score || 0)} points</p>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black">Final Leaderboard</h2>
            {loading && <span className="text-sm text-slate-400">Loading...</span>}
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-700 bg-red-950/50 px-4 py-3 text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {sorted.map((player, index) => (
              <div
                key={player.id || player.player_id || player.playerId}
                className="flex items-center justify-between rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
              >
                <span className="font-semibold">
                  {index + 1}. {player.username || player.player_id || "Player"}
                </span>
                <span className="font-black text-emerald-400">{Number(player.score || 0)}</span>
              </div>
            ))}

            {!loading && !sorted.length && (
              <p className="text-slate-400">No results have been recorded for this room yet.</p>
            )}
          </div>
        </div>

        <button
          onClick={handleBackToHome}
          className="w-full mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
