import { userService } from "@/services/user";
import { CreateUserInput, ResetPasswordInput, UpdateUserInput } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [userService.getAllUser.name],
    queryFn: () => userService.getAllUser(),
  });

  const createUser = useMutation({
    mutationKey: [userService.createUser.name],
    mutationFn: userService.createUser
  });

  const updateUser = useMutation({
    mutationKey: [userService.updateUser.name],
    mutationFn: ({ id, data }: { id: string, data: UpdateUserInput }) => {
      return userService.updateUser(id, data);
    }
  });

  const deleteUser = useMutation({
    mutationKey: [userService.deleteUser.name],
    mutationFn: userService.deleteUser
  });

  const getUserById = useMutation({
    mutationKey: [userService.getUserById.name],
    mutationFn: (id: string) => userService.getUserById(id),
  });

  const resetUserPassword = useMutation({
    mutationKey: [userService.resetUserPassword.name],
    mutationFn: ({ id, data }: { id: string, data: ResetPasswordInput }) => {
      return userService.resetUserPassword(id, data);
    }
  });

  const adminResetUserPassword = useMutation({
    mutationKey: [userService.adminResetUserPassword.name],
    mutationFn: ({ id, data }: { id: string, data: ResetPasswordInput }) => {
      return userService.adminResetUserPassword(id, data);
    }
  });

  const deactivateUser = useMutation({
    mutationKey: [userService.deactivateUser.name],
    mutationFn: userService.deactivateUser
  });

  return {
    users: data,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    resetUserPassword,
    adminResetUserPassword,
    deactivateUser,
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