"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  /** Render as a Next.js Link. Mutually exclusive with onClick. */
  href?: string;
  /** Render as a button with a click handler. */
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const base =
  "flex w-fit items-center gap-1.5 text-sm text-(--ink-3) hover:text-(--ink) transition-colors cursor-pointer";

export function BackLink({ href, onClick, children = "Back", className }: BackLinkProps) {
  if (href) {
    return (
      <Link href={href} className={cn(base, "no-underline", className)}>
        <ArrowLeft size={14} />
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn(base, className)}>
      <ArrowLeft size={14} />
      {children}
    </button>
  );
}
