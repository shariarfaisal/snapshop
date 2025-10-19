import { $clientPublic } from "./client";

export const getSettings = async () => {
  const response = await $clientPublic.get("/settings");
  return response.data;
};
