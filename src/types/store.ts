export type CreateNewStoreProps = {
  name: string;
  address: string;
  domain: string;
  currency: string;
  description?: string;
};

export type Store = {
  id: number;
  userId: number;
  name: string;
  domain: string;
  currency: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
