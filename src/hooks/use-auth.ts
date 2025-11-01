import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/auth";

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const login = useCallback(
    async (email: string, password: string, rememberMe?: boolean) => {
      try {
        await authStore.login(email, password, rememberMe);
        router.push("/dashboard");
      } catch (error) {
        throw error;
      }
    },
    [authStore, router]
  );

  const logout = useCallback(async () => {
    await authStore.logout();
    router.push("/login");
  }, [authStore, router]);

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login,
    logout,
    hasRole: authStore.hasRole,
    hasPermission: authStore.hasPermission,
  };
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phone?: string }) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the auth store with the new user data
      if (updatedUser) {
        authStore.setUser(updatedUser);
      }
    },
  });
};
