import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CapsLabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function CapsLabel({ children, htmlFor, className }: CapsLabelProps) {
  const cls = cn(
    "text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3)",
    className,
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className={cls}>
      {children}
    </label>
  ) : (
    <span className={cls}>{children}</span>
  );
}
