"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize auth on mount if needed
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </QueryClientProvider>
  );
};

export default Provider;
