import { create } from "zustand";
import type { User } from "@/schema/user";

interface UserState {
  selectedUser: User | null;
  editingUser: User | null;
  setSelectedUser: (user: User | null) => void;
  setEditingUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  editingUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  setEditingUser: (user) => set({ editingUser: user }),
}));
