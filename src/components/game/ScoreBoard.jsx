export default function ScoreBoard({ players }) {
  const sorted = [...(players || [])].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));

  return (
    <div>
      <h2 className="text-xl font-black mb-4">Live Leaderboard</h2>

      <div className="space-y-3">
        {sorted.map((player, index) => (
          <div
            key={player.id || player.playerId || player.username}
            className="flex items-center justify-between rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
          >
            <span className="font-semibold">
              {index + 1}. {player.username || player.playerId || "Player"}
            </span>
            <span className="font-black text-emerald-400">{Number(player.score || 0)}</span>
          </div>
        ))}

        {!sorted.length && (
          <p className="text-sm text-slate-400">Scores will appear after players join.</p>
        )}
      </div>
    </div>
  );
}
