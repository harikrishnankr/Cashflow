import {
  ArrowLeftRight,
  LayoutDashboard,
  Plus,
  Settings,
  Tag,
  Target,
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
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
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
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={16} strokeWidth={2} />,
    type: "manage",
  },
];
