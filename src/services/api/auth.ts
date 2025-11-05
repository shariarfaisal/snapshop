import { api } from "@/lib/api-client";

export interface LoginRequest {
  login: string; // Can be email or username
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  token: string;
  token_type?: string;
  refresh_token?: string;
  user: {
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
    roles?: { id: string; name: string }[];
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
}

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response;
  },

  /**
   * Register new user (if public registration is enabled)
   */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/register", data);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/forgot-password", data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/reset-password", data);
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return api.post<RefreshTokenResponse>("/auth/refresh", { refresh_token: refreshToken });
  },

  /**
   * Logout (if backend needs to invalidate token)
   */
  logout: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/logout");
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return api.get("/auth/me");
  },

  /**
   * Update profile
   */
  updateProfile: async (data: any) => {
    return api.put("/auth/profile", data);
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    return api.post("/auth/change-password", data);
  },
};
