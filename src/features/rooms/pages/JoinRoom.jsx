import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { socket } from "../../../services/socket/socket";
import { useRoom } from "../../../context/RoomContext";
import { useToast } from "../../../components/ui/ToastContext";

// ── dot-grid background ───────────────────────────────────────────────────────
function BackgroundGrid() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#10b981" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

// ── segmented 6-slot room code input ─────────────────────────────────────────
function RoomCodeInput({ value, onChange }) {
  const SLOTS = 6;
  const refs = useRef([]);
  const chars = value.toUpperCase().split("").slice(0, SLOTS);
  while (chars.length < SLOTS) chars.push("");

  const handleKey = (e, i) => {
    const k = e.key;
    if (k === "Backspace") {
      e.preventDefault();
      onChange(chars.map((c, idx) => (idx === i ? "" : c)).join(""));
      if (i > 0) refs.current[i - 1]?.focus();
      return;
    }
    if (k === "ArrowLeft" && i > 0)      { refs.current[i - 1]?.focus(); return; }
    if (k === "ArrowRight" && i < SLOTS - 1) { refs.current[i + 1]?.focus(); return; }
    if (/^[a-zA-Z0-9]$/.test(k)) {
      e.preventDefault();
      onChange(chars.map((c, idx) => (idx === i ? k.toUpperCase() : c)).join(""));
      if (i < SLOTS - 1) refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text")
      .replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, SLOTS);
    onChange(pasted);
    refs.current[Math.min(pasted.length, SLOTS - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="text"
          maxLength={1}
          value={ch}
          aria-label={`Room code digit ${i + 1}`}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          onChange={() => {}}
          onFocus={(e) => e.target.select()}
          className={[
            "w-12 h-14 rounded-xl border-[1.5px] bg-[#0f1720]",
            "text-xl font-bold text-center uppercase outline-none caret-transparent",
            "transition-all duration-150",
            "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-emerald-500/[0.06]",
            ch
              ? "border-emerald-500/40 text-emerald-400"
              : "border-slate-700/50 text-slate-100",
          ].join(" ")}
          style={{ fontFamily: "'Syne', sans-serif" }}
        />
      ))}
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function JoinRoom() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRoom }   = useRoom();
  const { addToast }  = useToast();

  const [roomCode, setRoomCode] = useState((searchParams.get("roomCode") || "").toUpperCase());
  const [username, setUsername] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const canSubmit = roomCode.length === 6 && username.trim().length > 0 && !loading;

  const handleJoinRoom = () => {
    if (roomCode.length < 6)   { addToast("Enter a 6-character room code", { type: "error" }); return; }
    if (!username.trim())       { addToast("Enter your username",           { type: "error" }); return; }

    setLoading(true);
    const playerId = localStorage.getItem("playerId") || `player_${Date.now()}`;
    localStorage.setItem("username", username.trim());
    localStorage.setItem("playerId", playerId);

    socket.connect();
    socket.emit(
      "join-room",
      { roomCode, player: { id: playerId, username: username.trim() } },
      (response) => {
        setLoading(false);
        if (!response.success) { addToast(response.message, { type: "error" }); return; }
        const code = response.room.room_code || response.room.roomCode;
        setRoom({ code, name: response.room.room_name, syncMode: response.room.sync_mode, isHost: false });
        navigate(`/waiting-room/${code}`);
      }
    );
  };

  return (
    <>
      {/* Font import + shimmer keyframe only — everything else is Tailwind */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 160%; }
        }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset-block: 0;
          left: -60%;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
          transform: skewX(-15deg);
          animation: shimmer 2.8s infinite;
        }
      `}</style>

      {/* Page */}
      <div
        className={`min-h-screen bg-[#060a0f] flex items-center justify-center p-6 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <BackgroundGrid />

        {/* Ambient blobs */}
        <div className="absolute w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[90px] -top-32 -right-36 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10  blur-[90px] -bottom-24 -left-20  pointer-events-none" />

        {/* Card */}
        <div
          className={`relative w-full max-w-[440px] bg-[#0d131c]/90 border border-emerald-500/[0.14] rounded-3xl px-8 py-10 shadow-2xl transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-full" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live Session
          </div>

          {/* Heading */}
          <h1
            className="text-[2rem] font-extrabold text-slate-100 leading-tight mb-1.5"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}
          >
            Join a{" "}
            <em className="not-italic bg-gradient-to-br from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Room
            </em>
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter a 6-character code to jump in
          </p>

          {/* Fields */}
          <div className="flex flex-col gap-5">

            {/* Room code */}
            <div>
              <div className="flex justify-between items-center text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3">
                <span>Room Code</span>
                <span className={roomCode.length === 6 ? "text-emerald-400" : ""}>
                  {roomCode.length}/6
                </span>
              </div>
              <RoomCodeInput value={roomCode} onChange={setRoomCode} />
            </div>

            {/* Username */}
            <div>
              <div className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-2">
                Your Name
              </div>
              <input
                type="text"
                placeholder="How should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canSubmit && handleJoinRoom()}
                maxLength={24}
                autoComplete="nickname"
                className="w-full bg-[#0f1720] border-[1.5px] border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 text-[0.9375rem] outline-none placeholder:text-slate-700 transition-all duration-150 focus:border-emerald-500 focus:bg-emerald-500/[0.05] focus:ring-2 focus:ring-emerald-500/10"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleJoinRoom}
              disabled={!canSubmit}
              aria-busy={loading}
              className={[
                "btn-shimmer relative w-full mt-1 py-3.5 rounded-2xl overflow-hidden",
                "text-white font-bold text-[0.9375rem] tracking-wide",
                "bg-gradient-to-br from-emerald-600 to-emerald-500",
                "shadow-[0_4px_20px_rgba(16,185,129,0.28),0_1px_3px_rgba(0,0,0,0.3)]",
                "transition-all duration-200",
                canSubmit
                  ? "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(16,185,129,0.4)] active:translate-y-0 cursor-pointer"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining…
                </span>
              ) : (
                "Join Room →"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-wide text-slate-700 mt-6">
            <span className="flex-1 h-px bg-slate-800" />
            or ask the host to share a link
            <span className="flex-1 h-px bg-slate-800" />
          </div>
        </div>
      </div>
    </>
  );
}