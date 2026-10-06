import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const login = (t) => { localStorage.setItem("token", t); setToken(t); };
  const logout = () => { localStorage.removeItem("token"); setToken(null); };
  return (
    <AuthCtx.Provider value={{ loggedIn: !!token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
