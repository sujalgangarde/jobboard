import axios from "axios";

// Local dev: empty (Vite proxy handles /api). Production: set VITE_API_URL, e.g. https://api.yourdomain.me
const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const api = axios.create({ baseURL: `${base}/api` });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes("/auth")) {
      localStorage.removeItem("token");
      window.location.href = "/login?expired=1";
    }
    return Promise.reject(err);
  }
);

export default api;
