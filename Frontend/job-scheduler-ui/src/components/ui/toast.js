import { create } from "zustand";

export const toastManager = create((set, get) => ({
  toasts: [],

  add: (toast) => {
    const id = Date.now();
    const newToast = { id, ...toast };

    // Add the toast
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      get().remove(id);
    }, 3000);
  },

  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
