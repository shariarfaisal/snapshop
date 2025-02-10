import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export const useAuth = () => {
  const { user, setUser } = useAppStore();
  const router = useRouter();

  const logout = async () => {
    try {
      // Clear the user from store
      setUser(null);

      // Clear the auth token cookie
      deleteCookie("x-auth-token", { path: "/" });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    logout,
  };
};
