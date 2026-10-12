import { create } from 'zustand';

const initialToken = localStorage.getItem('gc_token') || null;
const initialUser = localStorage.getItem('gc_user') ? JSON.parse(localStorage.getItem('gc_user')) : null;

export const useAuthStore = create((set) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken,

  setAuth: (token, user) => {
    localStorage.setItem('gc_token', token);
    localStorage.setItem('gc_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('gc_user', JSON.stringify(user));
    set({ user });
  }
}));
