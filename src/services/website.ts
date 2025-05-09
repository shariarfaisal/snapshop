import axios from "axios";
import { BASE_API_URL } from "@/constants";
import { Product } from "@/types/product";
import { CartItem } from "@/app/subdomain/[subdomain]/useStore";
import { Customer } from "@/types/customer";
import { Store } from "@/types";
import { getCookie } from "cookies-next";
import { Order } from "@/types/order";
import { $clientPublic } from "./client";

const $client = axios.create({
  baseURL: `${BASE_API_URL}/client`,
});
$client.defaults.headers.common["Accept"] = "application/json";
$client.defaults.headers.common["X-Request-Source"] = "website";

$client.interceptors.request.use(
  async (config) => {
    const authToken = await getCookie("x-customer-token");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken.replace(
        "Bearer ",
        ""
      )}`;
    }
    
    // Add subdomain header for development environment
    if (typeof window !== "undefined") {
      const subdomain = window.location.host.split(".")[0];
      if (subdomain === "localhost:3000") {
        // For development, use a test subdomain or get it from localStorage
        config.headers["x-subdomain"] = localStorage.getItem("current-subdomain") || "test-store";
      } else {
        config.headers["x-subdomain"] = subdomain;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const WEBSITE_API = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    name?: string;
  }) => {
    const { data } = await $client.get<{
      limit: number;
      page: number;
      products: Product[];
      total: number;
    }>(`/products`, {
      params,
    });

    return data;
  },
  getProductById: async (id: number | string) => {
    const { data } = await $client.get<Product>(`/products/${id}`);
    return data;
  },
  cartDetails: async (payload: CartItem[]) => {
    const { data } = await $client.post<
      {
        id: number;
        name: string;
        price: number;
        quantity: number;
        total: number;
        variant?: {
          id: number;
          name: string;
        };
      }[]
    >("/cart", {
      items: payload,
    });
    return data;
  },
  async signup(payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const { data } = await $client.post<{
      message: string;
      token: string;
      user: Customer;
    }>("/register", payload);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await $client.post<{
      message: string;
      token: string;
      user: Customer;
    }>("/auth/login", payload);
    return data;
  },
  async getStoreDetails() {
    const { data } = await $client.get<Store>("/store");
    return data;
  },
  async makeOrder(payload: { items: CartItem[]; shippingAddress: string }) {
    const { data } = await $client.post<{ message: string; id: string }>("/orders", payload);
    return data;
  },
  async getOrders() {
    const { data } = await $client.get<Order[]>("/orders");
    return data;
  },
  async getOrderById(id: string) {
    const { data } = await $client.get<Order>(`/orders/${id}`);
    return data;
  },
  async getCustomerInfo() {
    const { data } = await $client.get<Customer>("/me");
    return data;
  },
  async updateProfile(payload: { name: string; email: string; phone?: string }) {
    const { data } = await $client.put<Customer>("/me", payload);
    return data;
  },
  async searchProducts(query: string, page = 1, limit = 12) {
    const { data } = await $client.get<{
      products: Product[];
      page: number;
      limit: number;
      total: number;
    }>("/search", {
      params: { query, page, limit },
    });
    return data;
  },
  async searchSuggestions(query: string) {
    const { data } = await $client.get<Array<{
      id: number;
      name: string;
      basePrice: number;
      media: Array<{ url: string }>;
    }>>("/search/suggestions", {
      params: { query },
    });
    return data;
  },
};
