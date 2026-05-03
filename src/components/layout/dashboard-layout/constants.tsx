import {
  ArrowLeftRight,
  CreditCard,
  LayoutDashboard,
  Plus,
  Settings,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { DesktopNavItem, MobileTab } from "./dashboard-layout.type";
import { DashboardIcon, TransactionsIcon } from "@/components/ui";

export const MobileTabs: MobileTab[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
    exactMatch: true,
  },
  { label: "Tx", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Add", href: "/dashboard/transactions/new", icon: Plus, fab: true },
  { label: "Budgets", href: "/dashboard/budgets", icon: Target },
  { label: "More", href: "/dashboard/categories", icon: Tag },
];

export const DesktopTabs: DesktopNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
    type: "overview",
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <TransactionsIcon />,
    type: "overview",
  },
  {
    label: "Budgets",
    href: "/dashboard/budgets",
    icon: <Target size={16} strokeWidth={2} />,
    type: "overview",
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: <Tag size={16} strokeWidth={2} />,
    type: "overview",
  },
  {
    label: "Insights",
    href: "/dashboard/insights",
    icon: <TrendingUp size={16} strokeWidth={2} />,
    type: "manage",
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: <CreditCard size={16} strokeWidth={2} />,
    type: "manage",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={16} strokeWidth={2} />,
    type: "manage",
  },
];
