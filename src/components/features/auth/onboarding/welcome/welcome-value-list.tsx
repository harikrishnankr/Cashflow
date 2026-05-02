import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WELCOME_VALUES } from "../constants";

function ValueRow({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-8 h-8 rounded-(--r-sm) bg-(--orange-wash) text-(--orange) flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div>
        <div className="text-sm font-semibold text-(--ink) leading-snug">
          {title}
        </div>
        <div className="text-[0.8125rem] text-(--ink-3) mt-0.5 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}

export function WelcomeValueList({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {WELCOME_VALUES.map((v) => (
        <ValueRow key={v.title} {...v} />
      ))}
    </div>
  );
}
