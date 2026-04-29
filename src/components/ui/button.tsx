"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "ink-ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--orange)] text-white border border-[var(--orange)] hover:bg-[var(--orange-ink)] hover:border-[var(--orange-ink)]",
  ghost:
    "bg-transparent text-[var(--ink-2)] border border-[var(--hairline-strong)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]",
  "ink-ghost":
    "bg-transparent text-[var(--paper)] border border-[rgba(250,247,242,0.3)] hover:bg-[rgba(250,247,242,0.06)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-[var(--r-sm)]",
  md: "h-12 px-5 text-sm rounded-[var(--r-sm)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
