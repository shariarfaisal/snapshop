"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "admin@demo.com",
    password: "admin@123",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.login || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login(formData.login, formData.password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">E-Campus</h1>
          <p className="mt-2 text-sm text-gray-600">Education Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-lg bg-white border border-gray-200 p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign in to your account</h2>

          {/* Error Alert */}
          {(formError || error) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError || error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Credentials Info */}
          <div className="mb-6 rounded-md bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p className="text-gray-600">Email: admin@demo.com</p>
            <p className="text-gray-600">Password: admin@123</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-900 mb-2">
                Email or Username
              </label>
              <Input
                id="login"
                name="login"
                type="text"
                placeholder="admin@demo.com"
                value={formData.login}
                onChange={handleChange}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Need help? <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">Contact support</a>
          </p>
        </div>

        {/* Version Info */}
        <p className="mt-6 text-center text-xs text-gray-500">v1.0.0 | Education Management System</p>
      </div>
    </div>
  );
}
