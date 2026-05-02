"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, disabled, className, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.75">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase transition-colors",
              disabled ? "text-(--ink-4)" : "text-(--ink-3)",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full h-12 font-sans text-sm border rounded-(--r-sm) px-4 pr-10 outline-none appearance-none",
              "transition-[border-color,box-shadow,background-color,color] duration-120",
              // Enabled
              "bg-(--card) border-(--hairline-strong) text-(--ink) cursor-pointer",
              "focus:border-(--orange) focus:shadow-[0_0_0_3px_var(--orange-wash)]",
              // Disabled — muted background, lighter border, dimmed text
              "disabled:bg-(--paper-2) disabled:border-(--hairline) disabled:text-(--ink-4) disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
              disabled ? "text-(--ink-4)" : "text-(--ink-3)",
            )}
          />
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
