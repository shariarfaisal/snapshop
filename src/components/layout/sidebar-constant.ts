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
      title: "Dashboard",
      url: "/admin",
      icon: GraduationCap,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
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
      title: "Programs",
      url: "/admin/programs",
      icon: BookOpen,
    },
    {
      title: "Subjects",
      url: "/admin/subjects",
      icon: Book,
    },
    {
      title: "Curriculum",
      url: "/admin/curriculum",
      icon: Map,
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
    },
  ],
};
