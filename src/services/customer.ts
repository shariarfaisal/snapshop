import { $clientPrivate } from "./client";
import { Customer } from "@/types/customer";

export const CUSTOMER_API = {
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    storeId?: number;
  }) {
    const { data } = await $clientPrivate.get<{
      limit: number;
      page: number;
      customers: Customer[];
      total: number;
    }>("/customers", {
      params,
    });
    return data;
  },

  async getCustomersById(id: number) {
    const { data } = await $clientPrivate.get<Customer>(`/customers/${id}`);
    return data;
  },
};
