import axios from "axios";
import { BASE_API_URL } from "@/constants";
import { Product } from "@/types/product";
import { CartItem } from "@/app/subdomain/[subdomain]/useStore";
import { Customer } from "@/types/customer";
import { Store } from "@/types";
import { getCookie } from "cookies-next";

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
    }>("/login", payload);
    return data;
  },
  async getStoreDetails() {
    const { data } = await $client.get<Store>("/store");
    return data;
  },
  async makeOrder(payload: { items: CartItem[]; shippingAddress: string }) {
    const { data } = await $client.post<{ message: string }>("/order", payload);
    return data;
  },
};
