import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiUrl } from "../../../config/api";
import { useToast } from "../../../components/ui/ToastContext";

// Original flat-style illustration for the sign-up hero panel.
// A single character mid-wave with a burst of sparkles — no reference
// to any existing IP, purely generic shapes/colors for this screen.
function JoinIllustration() {
  return (
    <svg viewBox="0 0 300 190" className="w-full h-full" aria-hidden="true">
      {/* Sparkle bursts */}
      <g stroke="#FDE68A" strokeWidth="3" strokeLinecap="round">
        <path d="M70 40 l0 16 M62 48 l16 0" />
        <path d="M232 100 l0 14 M225 107 l14 0" />
        <path d="M220 34 l0 12 M214 40 l12 0" />
      </g>

      {/* Character */}
      <g transform="translate(150,60)">
        <path d="M-36 110 Q-36 50 0 50 Q36 50 36 110 Z" fill="#FFFFFF" fillOpacity="0.95" />
        <circle cx="0" cy="18" r="30" fill="#FFD9A8" />
        <path d="M-30 8 Q-33 -26 0 -28 Q33 -26 30 8 Q17 -10 0 -10 Q-17 -10 -30 8 Z" fill="#16213E" />
        <circle cx="-10" cy="20" r="3" fill="#16213E" />
        <circle cx="10" cy="20" r="3" fill="#16213E" />
        <path d="M-8 32 Q0 38 8 32" stroke="#16213E" strokeWidth="2.4" fill="none" strokeLinecap="round" />

        {/* Waving arm */}
        <path d="M28 62 Q54 46 58 20" stroke="#FFFFFF" strokeOpacity="0.95" strokeWidth="16" fill="none" strokeLinecap="round" />
        <circle cx="58" cy="18" r="11" fill="#FFD9A8" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="150" cy="182" rx="110" ry="9" fill="#0B1330" opacity="0.35" />
    </svg>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const { login, setError, theme } = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const signUp = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username })
      }).then((res) => res.json());

      if (!response.success) {
        throw new Error(response.message || "Sign up failed");
      }

      login(response.data.user, response.data.token);
      addToast("Account created successfully!", { type: "success" });
      navigate("/quizzes");
    } catch (err) {
      setError(err.message);
      addToast(err.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[100dvh] w-full flex flex-col relative transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"} ${theme === "dark" ? "bg-slate-950" : "bg-white"}`}
    >
      {/* Illustration panel — full width hero band */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 w-full h-[200px] sm:h-[240px] overflow-hidden shrink-0">
        <JoinIllustration />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div
          className={`w-full max-w-[420px] transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          {/* Heading */}
          <h1 className={`text-[1.7rem] font-extrabold text-center leading-tight ${theme === "dark" ? "text-slate-100" : "text-[#16213E]"}`}>
            Join QuizRoom
          </h1>
          <p className="text-sm text-slate-400 text-center mt-1.5 mb-6">
            Create your account to start hosting quizzes
          </p>

          <div className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <div className={`flex items-center gap-2.5 border-[1.5px] rounded-2xl px-4 py-3 transition-all duration-150 ${theme === "dark" ? "bg-slate-900/80 focus-within:border-indigo-400 focus-within:bg-indigo-500/[0.06]" : "bg-[#F7F8FC] focus-within:border-[#2F5FFF] focus-within:bg-[#2F5FFF]/[0.04]"} ${errors.username ? "border-red-400" : theme === "dark" ? "border-slate-800" : "border-transparent"}`}>
                <User size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: undefined })); }}
                  className={`w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-slate-400 ${theme === "dark" ? "text-slate-100" : "text-[#16213E]"}`}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <div className={`flex items-center gap-2.5 border-[1.5px] rounded-2xl px-4 py-3 transition-all duration-150 ${theme === "dark" ? "bg-slate-900/80 focus-within:border-indigo-400 focus-within:bg-indigo-500/[0.06]" : "bg-[#F7F8FC] focus-within:border-[#2F5FFF] focus-within:bg-[#2F5FFF]/[0.04]"} ${errors.email ? "border-red-400" : theme === "dark" ? "border-slate-800" : "border-transparent"}`}>
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  className={`w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-slate-400 ${theme === "dark" ? "text-slate-100" : "text-[#16213E]"}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className={`flex items-center gap-2.5 border-[1.5px] rounded-2xl px-4 py-3 transition-all duration-150 ${theme === "dark" ? "bg-slate-900/80 focus-within:border-indigo-400 focus-within:bg-indigo-500/[0.06]" : "bg-[#F7F8FC] focus-within:border-[#2F5FFF] focus-within:bg-[#2F5FFF]/[0.04]"} ${errors.password ? "border-red-400" : theme === "dark" ? "border-slate-800" : "border-transparent"}`}>
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  className={`w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-slate-400 ${theme === "dark" ? "text-slate-100" : "text-[#16213E]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-300 transition-colors shrink-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className={`flex items-center gap-2.5 border-[1.5px] rounded-2xl px-4 py-3 transition-all duration-150 ${theme === "dark" ? "bg-slate-900/80 focus-within:border-indigo-400 focus-within:bg-indigo-500/[0.06]" : "bg-[#F7F8FC] focus-within:border-[#2F5FFF] focus-within:bg-[#2F5FFF]/[0.04]"} ${errors.confirm ? "border-red-400" : theme === "dark" ? "border-slate-800" : "border-transparent"}`}>
                <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
                  onKeyDown={(e) => e.key === "Enter" && signUp()}
                  className={`w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-slate-400 ${theme === "dark" ? "text-slate-100" : "text-[#16213E]"}`}
                />
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.confirm}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={signUp}
              disabled={loading}
              className="w-full mt-1 py-3.5 rounded-full font-bold text-[0.9375rem] tracking-wide text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-purple-500/40 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-wide text-slate-400 mt-6">
            <span className={`flex-1 h-px ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
            or
            <span className={`flex-1 h-px ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
