import { create } from "zustand";
import type { User } from "@/utils/types";

export type UserStore = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};

export const useUser = create<UserStore>()((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
