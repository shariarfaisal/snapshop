import { Order } from "@/types/order";
import { $clientPrivate } from "./client";

export const ORDER_API = {
  async getOrders(params: {
    page?: number;
    limit?: number;
    storeId?: number;
    status?: string;
  }) {
    const { data } = await $clientPrivate.get<{
      limit: number;
      page: number;
      orders: Order[];
      total: number;
    }>("/orders", {
      params,
    });
    return data;
  },

  async getOrderById(id: number) {
    const { data } = await $clientPrivate.get<Order>(`/orders/${id}`);
    return data;
  },
};
