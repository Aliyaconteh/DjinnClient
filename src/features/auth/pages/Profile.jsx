import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, UserCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ui/ToastContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const initials = useMemo(() => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  }, [user]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!username.trim()) {
      addToast("Please enter a display name", { type: "error" });
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile(username.trim());
      addToast("Profile updated", { type: "success" });
    } catch (error) {
      addToast(error.message || "Unable to update profile", { type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Please fill in all password fields", { type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      addToast("New password must be at least 6 characters", { type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", { type: "error" });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast("Password updated", { type: "success" });
    } catch (error) {
      addToast(error.message || "Unable to change password", { type: "error" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500/50 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Account</p>
                <h1 className="text-2xl font-semibold">Your profile</h1>
                <p className="text-sm text-slate-400">Manage your identity and appearance</p>
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleProfileSave}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Display name</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <UserCircle size={16} />
                  Signed in as {user?.email || "your account"}
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profileLoading ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-blue-400" />
                <h2 className="text-xl font-semibold">Change password</h2>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handlePasswordChange}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                  placeholder="New password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                  placeholder="Confirm password"
                />

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 font-semibold text-slate-100 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordLoading ? "Updating..." : "Change password"}
                </button>
              </form>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
