import { CreateNewStoreProps, Store } from "@/types/store";
import { $clientPrivate } from "./client";

export const STORE_API = {
  async createNewStore(payload: CreateNewStoreProps) {
    const { data } = await $clientPrivate.post("/stores", payload);
    return data;
  },
  async getStores() {
    const { data } = await $clientPrivate.get<Store[]>("/stores");
    return data;
  },
  async getStoreById(id: number) {
    const { data } = await $clientPrivate.get<Store>(`/stores/${id}`);
    return data;
  },
  async getAnalytics(storeId?: number) {
    const { data } = await $clientPrivate.get("/analytics", {
      params: { storeId },
    });
    return data;
  },
  async deleteStore(id: number) {
    const { data } = await $clientPrivate.delete<{ message: string }>(`/stores/${id}`);
    return data;
  },
};
