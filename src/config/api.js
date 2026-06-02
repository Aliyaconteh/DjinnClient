const browserApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000";

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000`;
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || browserApiUrl();

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
