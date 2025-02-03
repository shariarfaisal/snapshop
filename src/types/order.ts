import { Customer } from "./customer";
import { Product } from "./product";
import { Store } from "./store";

export interface Order {
  id: number;
  storeID: number;
  store?: Store;
  customerID: number;
  totalPrice: number;
  orderStatus: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  customer?: Customer;
}

export interface OrderItem {
  id: number;
  orderID: number;
  productID: number;
  quantity: number;
  price: number;
  product?: Product;
}
