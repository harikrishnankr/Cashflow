import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "positive" | "negative" | "warning" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-(--paper-2) text-(--ink-2)",
  positive: "bg-(--positive-wash) text-(--positive)",
  negative: "bg-(--negative-wash) text-(--negative)",
  warning: "bg-(--warning-wash) text-(--warning)",
  info: "bg-(--info-wash) text-(--info)",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
