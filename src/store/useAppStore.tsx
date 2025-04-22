import { User } from "@/types/user";
import { create } from "zustand";

interface AppStoreProps {
  user: User | null;
  authToken: string | null;
}

interface AppStore extends AppStoreProps {
  setUser: (user: User | null) => void;
  setAuthToken: (token: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  authToken: null,
  setUser: (user) => set({ user }),
  setAuthToken: (token) => set({ authToken: token })
}));
