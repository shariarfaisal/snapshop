import { create } from "zustand";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { authService, LoginResponse } from "@/services/api/auth";
import { Permission } from "@/types/role";

export interface User {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  username?: string;
  roleId?: number | string;
  status?: string;
  role?: {
    id: number;
    name: string;
    permissions?: Permission[];
  };
  teacher?: any | null;
  student?: any | null;
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
  getDisplayName: () => string;
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
        login: email, // Backend expects 'login' field, not 'email'
        password,
        remember_me: rememberMe,
      });

      console.log('Login response:', response); // Debug log

      // Validate response has required fields
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Store tokens
      setCookie("auth_token", response.token, {
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (response.refresh_token) {
        setCookie("refresh_token", response.refresh_token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
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
      console.error('Login error:', error); // Debug log
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = apiError?.response?.data?.message || apiError?.message || "Login failed";
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
    if (!user || !user.role) return false;
    return user.role.name.toLowerCase() === role.toLowerCase();
  },

  // Check if user has permission
  hasPermission: (permission?: string) => {
    const { user } = get();
    if (!user || !permission) return false;

    // If user has no role or no permissions, deny access
    if (!user.role || !user.role.permissions) return false;

    // Check if user has the specific permission
    return user.role.permissions.some(
      (p) => p.name.toLowerCase() === permission.toLowerCase()
    );
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
}));
