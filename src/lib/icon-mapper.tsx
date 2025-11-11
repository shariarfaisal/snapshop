import {
  BookOpen,
  Users,
  Award,
  MessageSquare,
  FileText,
  Menu,
  Bell,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Check,
  Star,
  Heart,
  Zap,
  ThumbsUp,
  Search,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Home,
  User,
  UserPlus,
  LogIn,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Code,
  Database,
  Server,
  Cpu,
  Wifi,
  WifiOff,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Watch,
  type LucideIcon,
} from 'lucide-react';

// Map of icon names to Lucide React components
const iconMap: Record<string, LucideIcon> = {
  // Academic & Education
  BookOpen,
  'book-open': BookOpen,
  book: BookOpen,

  // People & Users
  Users,
  users: Users,
  User,
  user: User,
  UserPlus,
  'user-plus': UserPlus,

  // Achievement & Awards
  Award,
  award: Award,
  Star,
  star: Star,
  Trophy: Award, // Fallback
  trophy: Award,

  // Communication
  MessageSquare,
  'message-square': MessageSquare,
  message: MessageSquare,
  Mail,
  mail: Mail,
  email: Mail,
  Phone,
  phone: Phone,

  // Files & Documents
  FileText,
  'file-text': FileText,
  file: FileText,
  document: FileText,

  // Navigation
  Menu,
  menu: Menu,
  ChevronRight,
  'chevron-right': ChevronRight,
  ChevronLeft,
  'chevron-left': ChevronLeft,
  ChevronUp,
  'chevron-up': ChevronUp,
  ChevronDown,
  'chevron-down': ChevronDown,

  // Time & Calendar
  Calendar,
  calendar: Calendar,
  Clock,
  clock: Clock,
  time: Clock,

  // Notifications
  Bell,
  bell: Bell,
  notification: Bell,

  // Location
  MapPin,
  'map-pin': MapPin,
  location: MapPin,

  // Settings & Config
  Settings,
  settings: Settings,
  config: Settings,

  // Security
  Shield,
  shield: Shield,
  security: Shield,
  Lock,
  lock: Lock,
  locked: Lock,
  Unlock,
  unlock: Unlock,
  unlocked: Unlock,

  // Goals & Targets
  Target,
  target: Target,
  goal: Target,

  // Growth & Trends
  TrendingUp,
  'trending-up': TrendingUp,
  growth: TrendingUp,
  trend: TrendingUp,

  // Actions & Confirmations
  Check,
  check: Check,
  CheckCircle,
  'check-circle': CheckCircle,
  success: CheckCircle,
  ThumbsUp,
  'thumbs-up': ThumbsUp,
  like: ThumbsUp,

  // Favorites
  Heart,
  heart: Heart,
  favorite: Heart,

  // Speed & Energy
  Zap,
  zap: Zap,
  lightning: Zap,
  fast: Zap,

  // Search & Find
  Search,
  search: Search,
  find: Search,

  // Upload & Download
  Download,
  download: Download,
  Upload,
  upload: Upload,

  // Edit & Delete
  Edit,
  edit: Edit,
  Trash2,
  'trash-2': Trash2,
  trash: Trash2,
  delete: Trash2,

  // Add & Remove
  Plus,
  plus: Plus,
  add: Plus,
  Minus,
  minus: Minus,
  remove: Minus,

  // Close & Cancel
  X,
  x: X,
  close: X,
  cancel: X,

  // Alerts & Info
  AlertCircle,
  'alert-circle': AlertCircle,
  alert: AlertCircle,
  warning: AlertCircle,
  Info,
  info: Info,
  information: Info,
  HelpCircle,
  'help-circle': HelpCircle,
  help: HelpCircle,
  question: HelpCircle,

  // Visibility
  Eye,
  eye: Eye,
  view: Eye,
  visible: Eye,
  EyeOff,
  'eye-off': EyeOff,
  hide: EyeOff,
  hidden: EyeOff,

  // Home & Navigation
  Home,
  home: Home,
  dashboard: Home,

  // Auth
  LogIn,
  'log-in': LogIn,
  login: LogIn,
  signin: LogIn,
  LogOut,
  'log-out': LogOut,
  logout: LogOut,
  signout: LogOut,

  // Technology
  Code,
  code: Code,
  programming: Code,
  Database,
  database: Database,
  db: Database,
  Server,
  server: Server,
  Cpu,
  cpu: Cpu,
  processor: Cpu,

  // Connectivity
  Wifi,
  wifi: Wifi,
  network: Wifi,
  WifiOff,
  'wifi-off': WifiOff,
  offline: WifiOff,

  // Devices
  Smartphone,
  smartphone: Smartphone,
  mobile: Smartphone,
  phone: Smartphone,
  Laptop,
  laptop: Laptop,
  computer: Laptop,
  Monitor,
  monitor: Monitor,
  desktop: Monitor,
  Tablet,
  tablet: Tablet,
  Watch,
  watch: Watch,
  smartwatch: Watch,
};

/**
 * Get a Lucide icon component by name
 * @param iconName - Name of the icon (case-insensitive)
 * @param fallback - Fallback icon to use if not found (default: HelpCircle)
 * @returns Lucide icon component
 */
export function getIconByName(iconName: string | null | undefined, fallback: LucideIcon = HelpCircle): LucideIcon {
  if (!iconName) return fallback;

  // Try exact match first
  const exactMatch = iconMap[iconName];
  if (exactMatch) return exactMatch;

  // Try lowercase match
  const lowerMatch = iconMap[iconName.toLowerCase()];
  if (lowerMatch) return lowerMatch;

  // Try kebab-case match
  const kebabMatch = iconMap[iconName.toLowerCase().replace(/\s+/g, '-')];
  if (kebabMatch) return kebabMatch;

  // Return fallback
  return fallback;
}

/**
 * Render an icon by name with props
 * @param iconName - Name of the icon
 * @param props - Props to pass to the icon component
 * @param fallback - Fallback icon to use if not found
 */
export function IconByName({
  name,
  fallback = HelpCircle,
  ...props
}: {
  name: string | null | undefined;
  fallback?: LucideIcon;
  size?: number;
  className?: string;
}) {
  const IconComponent = getIconByName(name, fallback);
  return <IconComponent {...props} />;
}

export default getIconByName;
