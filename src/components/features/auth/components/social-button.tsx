"use client";

import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.85 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.67 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
  </svg>
);

type Provider = "google";

const icons: Record<Provider, () => React.ReactNode> = { google: GoogleIcon };
const labels: Record<Provider, string> = { google: "Continue with Google" };

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: Provider;
}

export function SocialButton({ provider, className, ...props }: SocialButtonProps) {
  const Icon = icons[provider];

  return (
    <button
      type="button"
      className={cn(
        "w-full h-12 flex items-center justify-center gap-2 px-4",
        "bg-(--card) border border-(--hairline-strong) rounded-(--r-sm)",
        "font-sans text-sm font-medium text-(--ink) cursor-pointer",
        "transition-colors hover:bg-(--card-hover)",
        className
      )}
      {...props}
    >
      <Icon />
      {labels[provider]}
    </button>
  );
}
