import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "@/services/api/room";
import type { CreateRoomRequest, RoomFilters } from "@/types/room";

export const useRooms = (filters?: RoomFilters) => {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => roomService.getAll(filters),
  });
};

export const useActiveRooms = () => {
  return useQuery({
    queryKey: ["active-rooms"],
    queryFn: () => roomService.getAllActive(),
  });
};

export const useRoom = (id: number | null) => {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => roomService.get(id!),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomRequest) => roomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["active-rooms"] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateRoomRequest> }) =>
      roomService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["active-rooms"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["active-rooms"] });
    },
  });
};
