import Link from "next/link";
import { MobileTab } from "../dashboard-layout.type";

export function FabTab({ tab }: { tab: MobileTab }) {
  const Icon = tab.icon;

  return (
    <Link
      href={tab.href}
      className="flex flex-col items-center justify-center flex-1 gap-0.5 no-underline! relative -translate-y-1/4"
    >
      <span className="w-10 h-10 rounded-full bg-(--orange) flex items-center justify-center text-white shadow-md">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="text-[9px] text-(--ink-3) font-medium uppercase tracking-wide">
        {tab.label}
      </span>
    </Link>
  );
}
