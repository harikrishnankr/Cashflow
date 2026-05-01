"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo";
import { DashboardIcon, TransactionsIcon, ReportsIcon } from "@/components/ui/icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Transactions", href: "/dashboard/transactions", icon: <TransactionsIcon /> },
  { label: "Reports", href: "/dashboard/reports", icon: <ReportsIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] flex-none border-r border-(--hairline) bg-(--paper) flex flex-col py-4">
      <div className="px-4 mb-6">
        <LogoMark className="h-7 w-auto" />
      </div>

      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-(--r-sm) text-sm transition-colors no-underline",
                active
                  ? "bg-(--paper-2) text-(--ink) font-medium"
                  : "text-(--ink-2) hover:bg-(--paper-2) hover:text-(--ink)"
              )}
            >
              <span className="flex-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
