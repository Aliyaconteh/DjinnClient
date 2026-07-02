const browserApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000";

  const { hostname } = window.location;
  return `http://${hostname}:5000`;
};

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = import.meta.env.DEV
  ? browserApiUrl()
  : (envApiBaseUrl || browserApiUrl());

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
