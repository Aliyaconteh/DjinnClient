import { Trophy } from "lucide-react";

const rankStyles = [
  { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", label: "1st" },
  { bg: "bg-slate-400/15", border: "border-slate-400/30", text: "text-slate-300", label: "2nd" },
  { bg: "bg-orange-600/15", border: "border-orange-600/30", text: "text-orange-400", label: "3rd" },
];

export default function ScoreBoard({ players }) {
  const sorted = [...(players || [])].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={18} className="text-amber-400" />
        <h2 className="text-xl font-extrabold" >Live Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {sorted.map((player, index) => {
          const rank = rankStyles[index];
          return (
            <div
              key={player.id || player.playerId || player.username}
              className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all duration-300 ${
                rank
                  ? `${rank.bg} ${rank.border}`
                  : "bg-slate-800/60 border-slate-700/50"
              }`}
              style={{ animation: "staggerFade 0.3s ease both", animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                {rank ? (
                  <span className={`text-xs font-bold ${rank.text} w-6 text-center`}>{rank.label}</span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 w-6 text-center">{index + 1}</span>
                )}
                <span className="font-semibold text-slate-100">
                  {player.username || player.playerId || "Player"}
                </span>
              </div>
              <span className={`font-black ${rank ? rank.text : "text-emerald-400"}`}>
                {Number(player.score || 0)}
              </span>
            </div>
          );
        })}

        {!sorted.length && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">Scores will appear after players join.</p>
          </div>
        )}
      </div>
    </div>
  );
}
