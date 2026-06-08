import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "./ToastContext";
import { ChevronDown, LogOut, Plus, FileText,} from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleSignOut = () => {
    logout();
    addToast("Signed out", { type: "info" });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 hover:border-slate-600"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm">
          {user.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden sm:inline-block text-sm font-medium text-slate-200">{user.username}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur border border-slate-700/50 rounded-lg shadow-xl shadow-black/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-white">{user.username}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => {
                navigate('/sync-analysis');
                setOpen(false);
              }} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150 text-sm"
            >
              <FileText size={16} />
              <span>Analysis</span>
            </button>
            
            <button 
              onClick={() => {
                navigate('/quizzes/create');
                setOpen(false);
              }} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150 text-sm"
            >
              <Plus size={16} />
              <span>Create Quiz</span>
            </button>
            
            <button 
              onClick={() => {
                navigate('/create-room');
                setOpen(false);
              }} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150 text-sm"
            >
              <Plus size={16} />
              <span>Create Room</span>
            </button>

            {/* Divider */}
            <div className="border-t border-slate-700/50 my-2" />

            {/* Sign Out */}
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

