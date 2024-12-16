import { Store, type LucideIcon } from "lucide-react";

type ISidebarConstant = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: (projectId: string) => string;
    }[];
  }[];
};

export const sidebarConstant: ISidebarConstant = {
  items: [
    {
      title: "Stores",
      url: "/stores",
      icon: Store,
    },
  ],
};
