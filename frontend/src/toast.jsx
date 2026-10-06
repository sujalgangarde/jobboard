import { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setItems((i) => [...i, { id, message, type }]);
    setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 z-50 space-y-2" aria-live="polite">
        {items.map((t) => (
          <div key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white ${t.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
