import { useEffect, useState } from "react";
import { Server, Zap, Clock, RefreshCw, Shield, Activity, ArrowRight, Gauge } from "lucide-react";

const strategies = [
  {
    title: "Server-Authoritative",
    icon: Server,
    accent: "indigo",
    color: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/20",
    description: "The server is the single source of truth. All answers are validated server-side before scores are updated.",
    pros: [
      "Prevents cheating and invalid answers",
      "Consistent scoring across all clients",
      "Reliable final results",
    ],
    cons: [
      "Higher perceived latency for players",
      "Requires stable network connection",
      "Server becomes a bottleneck under load",
    ],
    metrics: [
      { label: "Avg Latency", value: "~120ms", tone: "text-blue-400" },
      { label: "Reconciliations", value: "0", tone: "text-emerald-400" },
      { label: "Consistency", value: "100%", tone: "text-amber-400" },
    ],
  },
  {
    title: "Optimistic (Fast-First)",
    icon: Zap,
    accent: "emerald",
    color: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/20",
    description: "The client predicts the result immediately and reconciles with the server response afterward.",
    pros: [
      "Instant feedback for players",
      "Better perceived responsiveness",
      "Works well on slow connections",
    ],
    cons: [
      "Possible score corrections after prediction",
      "Requires reconciliation logic",
      "Potential for temporary inconsistencies",
    ],
    metrics: [
      { label: "Avg Latency", value: "~15ms", tone: "text-emerald-400" },
      { label: "Reconciliations", value: "~5%", tone: "text-amber-400" },
      { label: "Consistency", value: "~95%", tone: "text-blue-400" },
    ],
  },
];

export default function SyncAnalysis() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#060a0f] text-white px-4 py-10 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      
    >
      {/* Ambient blobs */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-indigo-500/6 blur-[90px] -top-32 -right-36 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-emerald-500/6 blur-[80px] -bottom-20 -left-16 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="mb-10" style={{ animation: "slideUp 0.5s ease both" }}>
          <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 mb-3">
            <Activity size={11} />
            Analysis
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold mt-1 tracking-tight"
          >
            Synchronization{" "}
            <span className="bg-gradient-to-br from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Strategies
            </span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl text-sm leading-relaxed">
            Compare the two synchronization models implemented in Djinn. Each strategy makes different trade-offs
            between responsiveness and consistency.
          </p>
        </div>

        {/* Strategy comparison grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {strategies.map((strategy, i) => (
            <div
              key={strategy.title}
              className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-slate-700"
              style={{ animation: "slideUp 0.5s ease both", animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-2xl ${strategy.bgAccent} border ${strategy.borderAccent} flex items-center justify-center`}>
                  <strategy.icon size={22} className={strategy.color} />
                </div>
                <div>
                  <h2
                    className="text-xl font-extrabold"
                  >
                    {strategy.title}
                  </h2>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">{strategy.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {strategy.metrics.map((metric) => (
                  <div key={metric.label} className="bg-slate-800/40 rounded-xl p-3 text-center border border-slate-800">
                    <p className={`text-lg font-black ${metric.tone}`}>{metric.value}</p>
                    <p className="text-[0.65rem] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Pros */}
              <div className="mb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Advantages</p>
                <ul className="space-y-1.5">
                  {strategy.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">Trade-offs</p>
                <ul className="space-y-1.5">
                  {strategy.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div
          className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 md:p-8"
          style={{ animation: "slideUp 0.5s ease both", animationDelay: "0.3s" }}
        >
          <h2
            className="text-2xl font-extrabold mb-6 flex items-center gap-2"
          >
            <RefreshCw size={18} className="text-sky-400" />
            How Synchronization Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                <Gauge size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-1">1. Client Sends Answer</h3>
              <p className="text-sm text-slate-400">The player selects an answer and the client emits it via socket with a timestamp.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                <Shield size={20} className="text-violet-400" />
              </div>
              <h3 className="font-bold text-white mb-1">2. Server Validates</h3>
              <p className="text-sm text-slate-400">The server checks answer correctness, timing, and awards points based on speed.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Clock size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-white mb-1">3. Results Broadcast</h3>
              <p className="text-sm text-slate-400">Updated scores and feedback are broadcast to all players in the room in real-time.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-slate-600">
            <ArrowRight size={14} />
            <span className="text-xs font-medium">Run both modes in a game session to compare perceived responsiveness</span>
          </div>
        </div>
      </div>
    </div>
  );
}
