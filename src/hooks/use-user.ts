import { userService } from "@/services/user";
import { CreateUserInput, ResetPasswordInput, UpdateUserInput } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [userService.getAll.name],
    queryFn: () => userService.getAll(),
  });

  const createUser = useMutation({
    mutationKey: [userService.create.name],
    mutationFn: userService.create
  });

  const updateUser = useMutation({
    mutationKey: [userService.update.name],
    mutationFn: ({ id, data }: { id: string, data: UpdateUserInput }) => {
      return userService.update(id, data);
    }
  });

  const deleteUser = useMutation({
    mutationKey: [userService.delete.name],
    mutationFn: userService.delete
  });

  const getUserById = useMutation({
    mutationKey: [userService.getById.name],
    mutationFn: (id: string) => userService.getById(id),
  });

  const resetPassword = useMutation({
    mutationKey: [userService.resetPassword.name],
    mutationFn: ({ id, data }: { id: string, data: ResetPasswordInput }) => {
      return userService.resetPassword(id, data);
    }
  });

  const deactivateUser = useMutation({
    mutationKey: [userService.deactivate.name],
    mutationFn: userService.deactivate
  });

  return {
    users: data,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    resetPassword,
    deactivateUser,
    invalidateUsers: () => {
      queryClient.invalidateQueries({
        queryKey: [userService.getAll.name]
      });
    },
    invalidateUserById: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: [userService.getById.name, id]
      });
    }
  };
}; 