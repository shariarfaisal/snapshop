import { userService } from "@/services/user";
import { CreateUserInput, ResetPasswordInput, UpdateUserInput } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useGetUserById = (userId?: string) => {
  return useQuery({
    queryKey: [userService.getUserById.name, userId],
    queryFn: () => userId ? userService.getUserById(userId) : Promise.resolve(null),
    enabled: !!userId,
  });
};

export const useUser = (page = 1, limit = 15, filters: any = {}) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(page);
  const [currentFilters, setCurrentFilters] = useState(filters);

  // Clean filters to remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(currentFilters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [userService.getAllUser.name, currentPage, limit, cleanFilters],
    queryFn: () => userService.getAllUser(currentPage, limit, cleanFilters),
  });

  const createUser = useMutation({
    mutationKey: [userService.createUser.name],
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  const updateUser = useMutation({
    mutationKey: [userService.updateUser.name],
    mutationFn: ({ id, data }: { id: string, data: UpdateUserInput }) => {
      return userService.updateUser(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  const deleteUser = useMutation({
    mutationKey: [userService.deleteUser.name],
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  const changeUserStatus = useMutation({
    mutationKey: [userService.changeUserStatus.name],
    mutationFn: ({ id, status }: { id: string, status: string }) => {
      return userService.changeUserStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  const resetUserPassword = useMutation({
    mutationKey: [userService.resetUserPassword.name],
    mutationFn: ({ id, data }: { id: string, data: ResetPasswordInput }) => {
      return userService.resetUserPassword(id, data);
    }
  });

  const bulkCreateUsers = useMutation({
    mutationKey: [userService.bulkCreateUsers.name],
    mutationFn: userService.bulkCreateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  const deactivateUser = useMutation({
    mutationKey: [userService.deactivateUser.name],
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    }
  });

  return {
    users: data,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus,
    resetUserPassword,
    bulkCreateUsers,
    deactivateUser,
    currentPage,
    setCurrentPage,
    setCurrentFilters,
    invalidateUsers: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAllUser.name]
      });
    },
    invalidateUserById: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: [userService.getUserById.name, id]
      });
    }
  };
}; 