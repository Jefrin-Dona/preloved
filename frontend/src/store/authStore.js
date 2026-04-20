import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  email: localStorage.getItem("email"),
  login: ({ token, email }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    set({ token, email });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, email: null });
  },
}));