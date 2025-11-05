import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  CreditCard,
  Settings,
  Building2,
  ClipboardList,
  Bell,
  Shield,
  UserCircle,
  Book,
  Map,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";

type ISidebarConstant = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export const sidebarConstant: ISidebarConstant = {
  items: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: GraduationCap,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Create User",
          url: "/admin/users/create",
        },
        {
          title: "Bulk Import",
          url: "/admin/users/bulk-import",
        },
      ],
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: UserCircle,
    },
    {
      title: "Roles",
      url: "/admin/roles",
      icon: Shield,
    },
    {
      title: "Academic",
      url: "/admin/academic",
      icon: BookOpen,
      items: [
        {
          title: "Programs",
          url: "/admin/programs",
        },
        {
          title: "Subjects",
          url: "/admin/subjects",
        },
        {
          title: "Curriculum",
          url: "/admin/curriculum",
        },
        {
          title: "Rooms",
          url: "/admin/academic/rooms",
        },
      ],
    },
    {
      title: "Campuses",
      url: "/admin/campuses",
      icon: Building2,
    },
    {
      title: "Admissions",
      url: "/admin/admissions",
      icon: FileText,
    },
    {
      title: "Exams",
      url: "/admin/exams",
      icon: ClipboardList,
    },
    {
      title: "Finance",
      url: "/admin/finance",
      icon: CreditCard,
    },
    {
      title: "Forms",
      url: "/admin/forms",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Institute",
        },
        {
          title: "Organization",
          url: "/settings/organization",
        },
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Branding",
          url: "/settings/branding",
        },
        {
          title: "System",
          url: "/settings/system",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
      ],
    },
  ],
};
