import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  email: localStorage.getItem("email"),
  role: localStorage.getItem("role"),
  id: localStorage.getItem("id"),
  login: ({ token, email, role, id }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
    set({ token, email, role, id });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, email: null, role: null, id: null });
  },
}));