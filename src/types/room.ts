export interface Room {
  id: number;
  room_number: string;
  room_name: string;
  floor?: number;
  capacity: number;
  room_type: string;
  description?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateRoomRequest {
  room_number: string;
  room_name: string;
  floor?: number;
  capacity: number;
  room_type: string;
  description?: string;
  status?: boolean;
}

export interface RoomFilters {
  search?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface RoomListResponse {
  current_page: number;
  data: Room[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
