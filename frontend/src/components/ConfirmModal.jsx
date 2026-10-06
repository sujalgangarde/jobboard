import { useEffect } from "react";

export default function ConfirmModal({ title, message, confirmText = "Delete", busy, onConfirm, onCancel }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg p-5 w-full max-w-sm" role="dialog" aria-modal="true"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold text-lg mb-1">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={onConfirm} disabled={busy}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60">
            {busy ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
