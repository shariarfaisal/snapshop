import { ProductFormValues } from "@/app/(user)/stores/[id]/add-product/schema";
import { $clientPrivate } from "./client";
import { Product } from "@/types/product";

export const PRODUCT_API = {
  async addProduct(
    payloads: ProductFormValues & {
      storeId: number;
    }
  ) {
    const { data } = await $clientPrivate.post<Product>("/products", payloads);
    return data;
  },
  async getProducts(params: {
    page?: number;
    limit?: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    storeId?: number;
  }) {
    const { data } = await $clientPrivate.get<{
      limit: number;
      page: number;
      products: Product[];
      total: number;
    }>("/products", {
      params,
    });
    return data;
  },
  async getProductById(id: number | string) {
    const { data } = await $clientPrivate.get<Product>(`/products/${id}`);
    return data;
  },
};
