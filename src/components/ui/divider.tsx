import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-0 h-px bg-(--hairline) my-6", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-3.5 my-6 font-mono text-[0.625rem] text-(--ink-3) tracking-[0.2em] uppercase", className)}>
      <span className="flex-1 h-px bg-(--hairline)" />
      {label}
      <span className="flex-1 h-px bg-(--hairline)" />
    </div>
  );
}
