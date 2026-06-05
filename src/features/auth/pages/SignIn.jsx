import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiUrl } from "../../../config/api";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }).then((res) => res.json());

      if (!response.success) {
        throw new Error(response.message || "Sign in failed");
      }

      login(response.data.user, response.data.token);
      navigate("/quizzes");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800">
        <h2 className="text-3xl font-black mb-6">Host Sign In</h2>

        <label className="block mb-4">
          <span className="text-slate-400">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <label className="block mb-6">
          <span className="text-slate-400">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <button
          onClick={signIn}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-bold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Don't have an account? <button onClick={() => navigate('/signup')} className="text-blue-400 underline">Sign up</button>
        </p>
      </div>
    </div>
  );
}
