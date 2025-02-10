import { Store } from "@/types";
import { User } from "@/types/user";
import { create } from "zustand";

interface AppStoreProps {
  stores: Store[];
}

interface AppStore extends AppStoreProps {
  user: User | null;
  setUser: (user: User | null) => void;
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  stores: [],
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
}));
