import Link from "next/link";
import { DesktopNavItem } from "../dashboard-layout.type";
import { cn } from "@/lib/utils";

export function NavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: DesktopNavItem[];
  pathname: string;
}) {
  return (
    <div className="mb-3">
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] text-(--ink-3) font-medium">
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-(--r-sm) text-sm transition-colors no-underline!",
                active
                  ? "bg-(--ink) text-(--paper)! font-medium"
                  : "text-(--ink-2) hover:bg-(--paper-2) hover:text-(--ink)",
              )}
            >
              <span className="flex-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
