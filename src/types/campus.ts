export type Campus = {
  id: string;
  name: string;
  code: string;
  address_line1: string;
  city: string;
  country: string;
  is_main: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCampusInput = Omit<Campus, "id" | "createdAt" | "updatedAt">;
export type UpdateCampusInput = Partial<CreateCampusInput>; 