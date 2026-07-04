import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiUrl } from "../../../config/api";
import { supabase } from "../../../services/supabase/supabaseClient";
import { useToast } from "../../../components/ui/ToastContext";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const { login, setError } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const finishGoogleRedirect = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const oauthError = searchParams.get("error_description") || hashParams.get("error_description");
      const hasOAuthResponse = searchParams.has("code") || hashParams.has("access_token") || Boolean(oauthError);

      if (!hasOAuthResponse) return;

      setGoogleLoading(true);
      setError(null);

      try {
        if (oauthError) {
          throw new Error(oauthError.replace(/\+/g, " "));
        }

        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const accessToken = sessionData?.session?.access_token;
        if (!accessToken) {
          throw new Error("Google sign-in did not return a session");
        }

        const response = await fetch(apiUrl("/auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken })
        }).then((res) => res.json());

        if (!response.success) {
          throw new Error(response.message || "Google sign-in failed");
        }

        login(response.data.user, response.data.token);
        addToast("Signed in with Google!", { type: "success" });
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate("/quizzes");
      } catch (err) {
        window.history.replaceState({}, document.title, window.location.pathname);
        setError(err.message);
        addToast(err.message, { type: "error" });
      } finally {
        setGoogleLoading(false);
      }
    };

    finishGoogleRedirect();
  }, [addToast, login, navigate, setError]);

  const continueWithGoogle = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/signin`,
          queryParams: { prompt: "select_account" }
        }
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message);
      addToast(err.message, { type: "error" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const signIn = async () => {
    if (loading || googleLoading) return;
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
        <p className="text-sm text-slate-500 mb-6">Sign in to manage your quizzes and rooms</p>

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={googleLoading || loading}
          className="w-full mb-6 py-3.5 rounded-2xl font-bold text-[0.9375rem] tracking-wide text-slate-900 bg-white border border-slate-200 shadow-[0_4px_18px_rgba(15,23,42,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {googleLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400/40 border-t-slate-900 rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-2.5 text-[0.7rem] tracking-wide text-slate-700 mb-6">
          <span className="flex-1 h-px bg-slate-800" />
          or sign in with email
          <span className="flex-1 h-px bg-slate-800" />
        </div>

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
            disabled={loading || googleLoading}
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
        <p className="text-center text-sm text-slate-500 mt-6">
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