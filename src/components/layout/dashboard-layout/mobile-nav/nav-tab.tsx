import Link from "next/link";
import { MobileTab } from "../dashboard-layout.type";
import { cn } from "@/lib/utils";

export function NavTab({ tab, pathname }: { tab: MobileTab; pathname: string }) {
  const active = tab.exactMatch
    ? pathname === tab.href
    : pathname === tab.href || pathname.startsWith(tab.href + "/");
  const Icon = tab.icon;

  return (
    <Link
      href={tab.href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 gap-0.5 no-underline! transition-colors",
        active
          ? "bg-(--paper-2) text-(--ink) font-medium"
          : "text-(--ink-3) hover:text-(--ink-2)",
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
      <span className="text-[9px] font-medium uppercase tracking-wide">
        {tab.label}
      </span>
    </Link>
  );
}