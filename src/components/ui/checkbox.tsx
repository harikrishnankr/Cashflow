"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./icons";

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
        {checked && <CheckIcon />}
      </span>
      {label}
    </label>
  )
);

Checkbox.displayName = "Checkbox";
