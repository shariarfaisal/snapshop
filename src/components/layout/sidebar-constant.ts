import {
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";

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
    {
      title: "Products",
      url: "/products",
      icon: ShoppingBag,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: User,
    },
  ],
};
