import { create } from "zustand";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { authService, LoginResponse } from "@/services/api/auth";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  username?: string;
  institute_id?: string;
  roles?: { id: string; name: string }[];
  institute?: {
    id: string;
    name: string;
    email: string;
    logo?: string;
    primary_color?: string;
  };
}

export interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;

  // Auth methods
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
  initialize: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Setters
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // Login
  login: async (email: string, password: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({
        email,
        password,
        remember_me: rememberMe,
      });

      // Store tokens
      setCookie("auth_token", response.token, {
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (response.refresh_token) {
        setCookie("refresh_token", response.refresh_token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refresh_token || null,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "Login failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear cookies and state
      deleteCookie("auth_token");
      deleteCookie("refresh_token");
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // Refresh token
  refreshAuthToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const response = await authService.refreshToken(refreshToken);
      setCookie("auth_token", response.token);
      setCookie("refresh_token", response.refresh_token);
      set({
        token: response.token,
        refreshToken: response.refresh_token,
      });
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      get().logout();
      return false;
    }
  },

  // Initialize auth state from cookies
  initialize: async () => {
    const token = getCookie("auth_token");
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      set({ isLoading: true });
      const user = await authService.getProfile();
      const refreshToken = getCookie("refresh_token");
      set({
        user: user as unknown as User,
        token: token as string,
        refreshToken: (refreshToken as string) || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      deleteCookie("auth_token");
      deleteCookie("refresh_token");
      set({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Check if user has role
  hasRole: (role: string) => {
    const { user } = get();
    if (!user) return false;
    return (user.roles || []).some((r) => r.name.toLowerCase() === role.toLowerCase());
  },

  // Check if user has permission
  hasPermission: (permission?: string) => {
    void permission; // Intentionally unused, for future implementation
    const { user } = get();
    if (!user) return false;
    // TODO: Implement permission checking based on roles
    return true;
  },

  // Get display name
  getDisplayName: () => {
    const { user } = get();
    if (!user) return "Guest";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email;
  },

  // Get institute name
  getInstituteName: () => {
    const { user } = get();
    return user?.institute?.name || "Institute";
  },
}));
