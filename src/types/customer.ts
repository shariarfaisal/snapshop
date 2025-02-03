import { Store } from "./store";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  storeId: string;
  store?: Store;
}
