import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession } from "@/schema/auth";

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      isAuthenticated: () => {
        const { session } = get();
        if (!session) return false;
        return new Date(session.expiresAt) > new Date();
      },
    }),
    { name: "cashflow-auth" }
  )
);
