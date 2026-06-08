import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = "info", duration = 4000 } = {}) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const toast = { id, message, type };
    setToasts((t) => [...t, toast]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full rounded-lg p-3 shadow-lg border ${
              toast.type === "error" ? "bg-red-700 border-red-800 text-white" : "bg-slate-800 border-slate-700 text-white"
            }`}
          >
            <div className="text-sm">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
