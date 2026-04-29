"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, className, ...props }, ref) => (
    <label className={cn("flex items-center gap-2 text-sm text-(--ink-2) cursor-pointer select-none", className)}>
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} className="sr-only" {...props} />
      <span
        className={cn(
          "w-4 h-4 border rounded flex items-center justify-center transition-colors flex-none",
          checked ? "bg-(--ink) border-(--ink) text-(--paper)" : "bg-(--card) border-(--hairline-strong)"
        )}
        aria-hidden
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {label}
    </label>
  )
);

Checkbox.displayName = "Checkbox";
