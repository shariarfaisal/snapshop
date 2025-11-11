/**
 * Navigation Permissions Configuration
 *
 * This file maps navigation routes to required permissions.
 * Each route can require:
 * - A single permission (string)
 * - Multiple permissions where ANY is required (string[])
 * - Multiple permissions where ALL are required (string[] with requireAll: true)
 */

export interface NavigationPermission {
  /**
   * The route path
   */
  path: string;

  /**
   * Permission(s) required to access this route
   */
  permissions: string | string[];

  /**
   * If true, ALL permissions are required. If false or undefined, ANY permission is sufficient.
   */
  requireAll?: boolean;

  /**
   * Label for UI display
   */
  label?: string;

  /**
   * Description of what this route does
   */
  description?: string;
}

/**
 * Navigation permissions configuration
 *
 * Each route is mapped to one or more permissions that control access
 */
export const NAVIGATION_PERMISSIONS: NavigationPermission[] = [
  // Admin Dashboard (no specific permission required - allow access to all logged-in users)
  {
    path: "/admin",
    permissions: "readAll-user",
    label: "Dashboard",
    description: "View admin dashboard and analytics",
  },

  // Academic Section
  {
    path: "/admin/academic",
    permissions: "readAll-course",
    label: "Academic",
    description: "Manage academic resources",
  },
  {
    path: "/admin/programs",
    permissions: "readAll-course",
    label: "Programs",
    description: "Manage academic programs",
  },
  {
    path: "/admin/subjects",
    permissions: "readAll-course",
    label: "Subjects",
    description: "Manage subjects and curriculum",
  },
  {
    path: "/admin/curriculum",
    permissions: "readAll-course",
    label: "Curriculum",
    description: "Manage curriculum",
  },
  {
    path: "/admin/academic/rooms",
    permissions: "readAll-course",
    label: "Rooms",
    description: "Manage classrooms and facilities",
  },

  // Users Section
  {
    path: "/admin/users",
    permissions: "readAll-user",
    label: "Users",
    description: "View and manage users",
  },
  {
    path: "/admin/users/create",
    permissions: "create-user",
    label: "Create User",
    description: "Create new user accounts",
  },
  {
    path: "/admin/users/bulk-import",
    permissions: "create-user",
    label: "Bulk Import Users",
    description: "Import users from CSV file",
  },

  // Students
  {
    path: "/admin/students",
    permissions: "readAll-student",
    label: "Students",
    description: "View and manage students",
  },

  // Teachers
  {
    path: "/admin/teachers",
    permissions: "readAll-teacher",
    label: "Teachers",
    description: "View and manage teachers",
  },

  // Admissions
  {
    path: "/admin/admissions",
    permissions: "readAll-registration",
    label: "Admissions",
    description: "Manage admissions and applications",
  },

  // Examinations
  {
    path: "/admin/exams",
    permissions: "readAll-course",
    label: "Exams",
    description: "Manage examinations",
  },

  // Finance
  {
    path: "/admin/finance",
    permissions: "readAll-student",
    label: "Finance",
    description: "Manage finances and payments",
  },

  // Forms
  {
    path: "/admin/forms",
    permissions: "readAll-registration",
    label: "Forms",
    description: "Manage system forms",
  },

  // Notifications
  {
    path: "/admin/notifications",
    permissions: "readAll-announcement",
    label: "Notifications",
    description: "Manage system notifications",
  },

  // Roles
  {
    path: "/admin/roles",
    permissions: "readAll-role",
    label: "Roles",
    description: "Manage user roles",
  },

  // Campuses
  {
    path: "/admin/campuses",
    permissions: "readAll-student",
    label: "Campuses",
    description: "Manage campuses",
  },

  // Settings
  {
    path: "/settings",
    permissions: "readAll-user",
    label: "Settings",
    description: "Manage system settings",
  },
  {
    permissions: "readAll-user",
    label: "Institute Settings",
  },
  {
    path: "/settings/organization",
    permissions: "readAll-user",
    label: "Organization",
    description: "Manage organization structure",
  },
  {
    path: "/settings/profile",
    permissions: "readAll-user",
    label: "Profile",
    description: "Manage personal profile",
  },
  {
    path: "/settings/branding",
    permissions: "readAll-user",
    label: "Branding",
  },
  {
    path: "/settings/system",
    permissions: "readAll-user",
    label: "System",
    description: "Manage system settings",
  },
  {
    path: "/settings/security",
    permissions: "readAll-user",
    label: "Security",
    description: "Manage security settings",
  },
  // Content Management
  {
    path: "/admin/content",
    permissions: "readAll-content",
    label: "Content Management",
    description: "Manage public website content",
  },
  {
    path: "/admin/content/site",
    permissions: "readAll-content",
    label: "Site Settings",
    description: "Manage site settings and metadata",
  },
  {
    path: "/admin/content/landing-page",
    permissions: "readAll-content",
    label: "Landing Page",
    description: "Manage landing page content",
  },
  {
    path: "/admin/content/about-page",
    permissions: "readAll-content",
    label: "About Page",
    description: "Manage about page content",
  },
  {
    path: "/admin/content/faqs",
    permissions: "readAll-content",
    label: "FAQs",
    description: "Manage frequently asked questions",
  },
  {
    path: "/admin/content/help-resources",
    permissions: "readAll-content",
    label: "Help Resources",
    description: "Manage help resources and documentation",
  },
  {
    path: "/admin/content/navigation",
    permissions: "readAll-content",
    label: "Navigation",
    description: "Manage website navigation menus",
  },
  {
    path: "/admin/content/seo",
    permissions: "readAll-content",
    label: "SEO Settings",
    description: "Manage SEO and metadata settings",
  },
];

/**
 * Helper function to get permissions for a specific route
 */
export function getRoutePermissions(path: string): string[] {
  const route = NAVIGATION_PERMISSIONS.find((np) => np.path === path);
  if (!route) return [];

  return Array.isArray(route.permissions)
    ? route.permissions
    : [route.permissions];
}

/**
 * Helper function to check if a route requires all permissions or just any
 */
export function routeRequiresAllPermissions(path: string): boolean {
  const route = NAVIGATION_PERMISSIONS.find((np) => np.path === path);
  return route?.requireAll || false;
}

/**
 * Helper function to check if user has access to a route based on their permissions
 */
export function canAccessRoute(
  path: string,
  userPermissions: string[]
): boolean {
  const route = NAVIGATION_PERMISSIONS.find((np) => np.path === path);
  if (!route) return true; // If no permissions defined, allow access

  const requiredPermissions = Array.isArray(route.permissions)
    ? route.permissions
    : [route.permissions];

  if (route.requireAll) {
    // User must have ALL required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.some(
        (up) => up.toLowerCase() === permission.toLowerCase()
      )
    );
  } else {
    // User must have ANY of the required permissions
    return requiredPermissions.some((permission) =>
      userPermissions.some(
        (up) => up.toLowerCase() === permission.toLowerCase()
      )
    );
  }
}
