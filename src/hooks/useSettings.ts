import { useAppStore } from "@/store/useAppStore";
import { getSettings } from "@/services/settings";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export const useSettings = () => {
  const { settings, setSettings } = useAppStore();
  const { mutate } = useMutation({
    mutationKey: ["settings"],
    mutationFn: getSettings,
    onSuccess: (data) => {
      if (data && data.logo) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const logoUrl = `${baseUrl}/${data.logo}`;
        const faviconUrl = logoUrl;

        setSettings({ ...data, faviconUrl, logoUrl})
      }
    }
  })

  useEffect(() => {
    mutate()
  }, []);

  return { settings };
};

export const useLogo = (): {
  logoUrl: string | undefined;
  hasLogo: boolean;
  isLoading: boolean;
} => {
  const { settings } = useAppStore();
  const isLoading = !settings;
  const logoUrl = settings?.logoUrl;
  return {
    logoUrl,
    hasLogo: !!logoUrl,
    isLoading,
  };
};
