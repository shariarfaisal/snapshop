import { apiClient } from "@/lib/api-client";
import type { Room, CreateRoomRequest, RoomFilters, RoomListResponse } from "@/types/room";

const ENDPOINT = "/rooms";

interface RoomApiResponse {
  success: boolean;
  data: Room[];
  pagination?: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
  message: string;
}

export const roomService = {
  async getAll(filters?: RoomFilters): Promise<RoomApiResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", String(filters.status));
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.page) params.append("page", filters.page.toString());

    const response = await apiClient.get<RoomApiResponse>(
      filters && Object.keys(filters).length > 0
        ? `${ENDPOINT}?${params.toString()}`
        : ENDPOINT
    );
    
    return response.data;
  },

  async getAllActive(): Promise<Room[]> {
    const response = await apiClient.get<any>(`${ENDPOINT}/all`);
    return response.data?.data || [];
  },

  async get(id: number): Promise<Room> {
    const response = await apiClient.get<any>(`${ENDPOINT}/${id}`);
    return response.data?.data;
  },

  async create(data: CreateRoomRequest): Promise<Room> {
    const response = await apiClient.post<any>(ENDPOINT, data);
    return response.data?.data;
  },

  async update(id: number, data: Partial<CreateRoomRequest>): Promise<Room> {
    const response = await apiClient.put<any>(`${ENDPOINT}/${id}`, data);
    return response.data?.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
