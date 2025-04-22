import { z } from "zod";

export const campusFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address_line1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  is_main: z.boolean(),
});

export type CampusFormValues = z.infer<typeof campusFormSchema>; 