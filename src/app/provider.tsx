"use client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default Provider;
