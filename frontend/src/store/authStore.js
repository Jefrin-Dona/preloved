import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
  login: ({ token, role, userId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    set({ token, role, userId });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, role: null, userId: null });
  },
}));