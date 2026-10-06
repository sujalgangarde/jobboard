import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth";
import { useToast } from "../toast";
import { errMsg } from "../utils";

export default function Login() {
  const { loggedIn, login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Admin Login - JobBoard"; }, []);

  if (loggedIn) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Enter username and password");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/auth/login", form);
      login(r.data.token);
      toast("Welcome back!");
      nav("/admin");
    } catch (err) {
      setError(err.response?.status === 401 ? "Invalid username or password" : errMsg(err));
      setBusy(false);
    }
  };

  const input = "w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-5 mt-10 bg-white border rounded-lg">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>

      {params.get("expired") && !error && (
        <p className="bg-yellow-50 text-yellow-800 p-2 rounded mb-3 text-sm">
          Your session expired. Please log in again.
        </p>
      )}
      {error && <p className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}

      <label className="block text-sm font-medium mb-1" htmlFor="u">Username</label>
      <input id="u" autoFocus autoComplete="username" className={`${input} mb-3`}
        value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />

      <label className="block text-sm font-medium mb-1" htmlFor="p">Password</label>
      <div className="relative mb-4">
        <input id="p" type={show ? "text" : "password"} autoComplete="current-password"
          className={`${input} pr-16`}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-2 top-2.5 text-sm text-blue-600">
          {show ? "Hide" : "Show"}
        </button>
      </div>

      <button disabled={busy} className="w-full bg-blue-600 text-white p-2.5 rounded disabled:opacity-60">
        {busy ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
