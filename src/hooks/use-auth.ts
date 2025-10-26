import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

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
