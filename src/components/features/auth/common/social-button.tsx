"use client";

import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { GoogleIcon } from "@/components/ui/icons";

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
