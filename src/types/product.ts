export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  stock: number;
  storeID: number;
  categoryID: null;
  customFields: null;
  createdAt: string;
  updatedAt: string;
  variants?: Variant[];
  attributes?: ProductAttribute[];
  media?: ProductMedia[];
}

export interface ProductAttribute {
  id: number;
  productID: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMedia {
  id: number;
  productID: number;
  url: string;
  type: string;
  altText: null;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: number;
  productID: number;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  sku: null;
  createdAt: string;
  updatedAt: string;
}
