import { Routes, Route, Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import NotFound from "./pages/NotFound";
import { useAuth } from "./auth";
import { useToast } from "./toast";

function Protected({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

const link = ({ isActive }) =>
  `px-2 py-1 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`;

export default function App() {
  const { loggedIn, logout } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    toast("Logged out");
    nav("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <nav className="bg-blue-600 text-white p-3 flex flex-wrap items-center justify-between gap-2">
        <Link to="/" className="font-bold text-lg">JobBoard</Link>
        <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base">
          <NavLink to="/" end className={link}>Jobs</NavLink>
          {loggedIn ? (
            <>
              <NavLink to="/admin" end className={link}>Dashboard</NavLink>
              <NavLink to="/admin/new" className={link}>+ Add Job</NavLink>
              <button onClick={doLogout} className="px-2 py-1 rounded hover:bg-white/10">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={link}>Admin Login</NavLink>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
          <Route path="/admin/new" element={<Protected><JobForm /></Protected>} />
          <Route path="/admin/edit/:id" element={<Protected><JobForm /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">JobBoard</footer>
    </div>
  );
}
