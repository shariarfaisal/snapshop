import { Settings } from "@/types/settings";
import { User } from "@/types/user";
import { create } from "zustand";

interface AppStoreProps {
  user: User | null;
  authToken: string | null;
  settings: Settings | null;
}

interface AppStore extends AppStoreProps {
  setUser: (user: User | null) => void;
  setAuthToken: (token: string) => void;
  setSettings: (settings: Settings | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  authToken: null,
  settings: null,
  setUser: (user) => set({ user }),
  setAuthToken: (token) => set({ authToken: token }),
  setSettings: (settings) => set({ settings }),
}));
