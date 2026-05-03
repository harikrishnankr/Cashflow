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
      isAuthenticated: () => !!get().session?.user,
    }),
    { name: "cashflow-auth" }
  )
);
