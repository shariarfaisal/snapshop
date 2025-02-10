import { z } from "zod";

export const attributeSchema = z.object({
  key: z.string().min(1, "Attribute key is required"),
  value: z.string().min(1, "Attribute value is required"),
});

export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.coerce.number().nonnegative("Price must be a non-negative number"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  attributes: z.record(z.string()).optional(),
  sku: z.string().optional(),
});

export const mediaSchema = z.object({
  url: z.string().url("Invalid URL"),
  type: z.enum(["image", "video"]),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  basePrice: z.coerce
    .number()
    .nonnegative("Base price must be a non-negative number"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  //   storeId: z.number().positive("Store ID is required"),
  //   categoryId: z.number().optional(),
  //   customFields: z.record(z.string()).optional(),
  attributes: z.array(attributeSchema),
  variants: z.array(variantSchema),
  media: z.array(mediaSchema),
});

export type ProductFormValues = z.infer<typeof productSchema>;
