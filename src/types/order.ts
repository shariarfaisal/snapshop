import { Customer } from "./customer";
import { Product } from "./product";
import { Store } from "./store";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  orderItems: OrderItem[];
  totalPrice: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    media: string[];
  };
}
