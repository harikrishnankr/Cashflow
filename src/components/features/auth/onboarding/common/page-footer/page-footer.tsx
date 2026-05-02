"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface PageFooterProps {
  onBack?: () => void;
  isBackDisabled?: boolean;
  /** Show a primary Continue button on the right */
  onContinue?: () => void;
  continueLabel?: string;
  /** Show a plain text hint instead of a button */
  nextHint?: string;
}

export function PageFooter({
  onBack,
  isBackDisabled,
  onContinue,
  continueLabel = "Continue",
  nextHint,
}: PageFooterProps) {
  return (
    <div className="hidden md:flex items-center justify-between mt-12 pt-6 border-t border-(--hairline)">
      <button
        disabled={isBackDisabled}
        onClick={onBack}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          isBackDisabled
            ? "text-(--ink-4) cursor-not-allowed"
            : "text-(--ink-3) hover:text-(--ink) cursor-pointer"
        )}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {onContinue ? (
        <Button onClick={onContinue}>
          {continueLabel} <ArrowRight size={16} />
        </Button>
      ) : nextHint ? (
        <span
          className="text-xs text-(--ink-3) uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          next · {nextHint}
        </span>
      ) : null}
    </div>
  );
}
