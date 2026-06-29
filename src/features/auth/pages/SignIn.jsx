import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiUrl } from "../../../config/api";
import { useToast } from "../../../components/ui/ToastContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, setError } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const signIn = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }).then((res) => res.json());

      if (!response.success) {
        throw new Error(response.message || "Sign in failed");
      }

      login(response.data.user, response.data.token);
      addToast("Welcome back!", { type: "success" });
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
      className={`min-h-screen bg-[#060a0f] flex items-center justify-center p-6 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      
    >
      {/* Background grid */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none">
        <defs>
          <pattern id="si-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#6366f1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#si-dots)" />
      </svg>

      {/* Ambient blobs */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-[90px] -top-32 -right-36 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-indigo-500/10 blur-[80px] -bottom-20 -left-16 pointer-events-none" />

      {/* Card */}
      <div
        className={`relative w-full max-w-[440px] bg-[#0d131c]/90 border border-blue-500/[0.14] rounded-3xl px-8 py-10 shadow-2xl transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full" />

        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <LogIn size={11} />
            Sign In
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-[2rem] font-extrabold text-slate-100 leading-tight mb-1.5"
          
        >
          Welcome{" "}
          <em className="not-italic bg-gradient-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Back
          </em>
        </h1>
        <p className="text-sm text-slate-500 mb-8">Sign in to manage your quizzes and rooms</p>

        <div className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <div className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-2">Email</div>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
              className={`w-full bg-[#0f1720] border-[1.5px] rounded-xl px-4 py-3 text-slate-100 text-[0.9375rem] outline-none placeholder:text-slate-700 transition-all duration-150 focus:border-blue-500 focus:bg-blue-500/[0.05] focus:ring-2 focus:ring-blue-500/10 ${errors.email ? "border-red-500/70" : "border-slate-700/50"}`}
              
            />
            {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-2">Password</div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
                className={`w-full bg-[#0f1720] border-[1.5px] rounded-xl px-4 py-3 pr-11 text-slate-100 text-[0.9375rem] outline-none placeholder:text-slate-700 transition-all duration-150 focus:border-blue-500 focus:bg-blue-500/[0.05] focus:ring-2 focus:ring-blue-500/10 ${errors.password ? "border-red-500/70" : "border-slate-700/50"}`}
                
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={signIn}
            disabled={loading}
            className="btn-shimmer w-full mt-1 py-3.5 rounded-2xl font-bold text-[0.9375rem] tracking-wide text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_4px_20px_rgba(59,130,246,0.28),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(59,130,246,0.4)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2.5 text-[0.7rem] tracking-wide text-slate-700 mt-6">
          <span className="flex-1 h-px bg-slate-800" />
          or
          <span className="flex-1 h-px bg-slate-800" />
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
