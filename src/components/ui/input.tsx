"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CapsLabel } from "./caps-label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  trail?: ReactNode;
  lead?: ReactNode;
  compact?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      trail,
      lead,
      id,
      compact,
      containerClassName,
      className,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isInvalid = ariaInvalid === true || ariaInvalid === "true";

    return (
      <div className={cn("flex flex-col gap-1.75", containerClassName)}>
        {label && <CapsLabel htmlFor={inputId}>{label}</CapsLabel>}
        <div className="relative">
          {lead && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ink-3) flex items-center justify-center">
              {lead}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={ariaInvalid}
            className={cn(
              "w-full font-sans text-sm bg-(--card) border border-(--hairline-strong)",
              compact ? "h-9" : "h-12",
              "rounded-(--r-sm) px-4 text-(--ink) outline-none transition-[border-color,box-shadow]",
              "duration-120 placeholder:text-(--ink-4)",
              "focus:border-(--orange) focus:shadow-[0_0_0_3px_var(--orange-wash)]",
              trail && "pr-11",
              lead && "pl-11",
              isInvalid && "border-(--negative)",
              className,
            )}
            {...props}
          />
          {trail && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-3) flex items-center justify-center">
              {trail}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
