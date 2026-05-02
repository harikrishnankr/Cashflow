"use client";

import { ArrowLeft } from "lucide-react";

export function PageFooter({
  onBack,
  isBackDisabled,
  nextPage,
}: {
  onBack?: () => void;
  isBackDisabled?: boolean;
  nextPage: string;
}) {
  return (
    <div className="hidden md:flex items-center justify-between mt-12 pt-6 border-t border-(--hairline)">
      <button
        disabled={isBackDisabled}
        className="flex items-center gap-2 text-sm text-(--ink-4) cursor-not-allowed"
        onClick={onBack}
      >
        <ArrowLeft size={14} /> Back
      </button>
      <span
        className="text-xs text-(--ink-3) uppercase tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        next · {nextPage}
      </span>
    </div>
  );
}
