"use client";

import { useEffect, useState } from "react";
import { toastManager } from "./toast";

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((state) => {
      setToasts(state.toasts);
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => toastManager.getState().remove(t.id)}
          style={{
            background: "#111",
            color: "#fff",
            padding: "12px",
            marginBottom: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            minWidth: "220px",
            transition: "opacity 0.3s ease",
          }}
        >
          <strong>{t.title}</strong>
          {t.description && (
            <div style={{ fontSize: "14px", opacity: 0.8 }}>
              {t.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
