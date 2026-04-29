"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  trail?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, trail, error, id, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.75">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3)"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-12 font-sans text-sm bg-(--card) border border-(--hairline-strong)",
              "rounded-(--r-sm) px-4 text-(--ink) outline-none transition-[border-color,box-shadow]",
              "duration-120 placeholder:text-(--ink-4)",
              "focus:border-(--orange) focus:shadow-[0_0_0_3px_var(--orange-wash)]",
              trail && "pr-11",
              error && "border-(--negative)",
              className
            )}
            {...props}
          />
          {trail && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-3) flex items-center justify-center p-1 cursor-pointer">
              {trail}
            </span>
          )}
        </div>
        {error && <p className="text-[11px] text-(--negative) font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
