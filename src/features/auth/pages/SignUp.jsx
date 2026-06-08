import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiUrl } from "../../../config/api";
import { useToast } from "../../../components/ui/ToastContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { login, setError } = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      addToast("Passwords do not match", { type: "error" });
      return;
    }

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
      navigate("/quizzes");
    } catch (err) {
      setError(err.message);
      addToast(err.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800">
        <h2 className="text-3xl font-black mb-6">Host Sign Up</h2>

        <label className="block mb-4">
          <span className="text-slate-400">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-slate-400">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-slate-400">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <label className="block mb-6">
          <span className="text-slate-400">Confirm Password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </label>

        <button
          onClick={signUp}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-white font-bold hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-slate-400 text-sm mt-4 text-center">
          Already have an account? <button onClick={() => navigate('/signin')} className="text-blue-400 underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}
