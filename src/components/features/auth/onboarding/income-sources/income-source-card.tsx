"use client";

import { CheckboxCard } from "@/components/ui";
import type { IncomeSource } from "./constants";

interface IncomeSourceCardProps {
  source: IncomeSource;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function IncomeSourceCard({
  source,
  checked,
  onCheckedChange,
}: IncomeSourceCardProps) {
  const Icon = source.icon;
  return (
    <CheckboxCard
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="p-3.5 flex flex-col gap-1"
    >
      <div className="w-8 h-8 rounded-full border border-(--hairline) bg-(--paper-2) flex items-center justify-center shrink-0">
        <Icon size={14} strokeWidth={1.75} className="text-(--ink-2)" />
      </div>
      <div className="text-sm font-medium text-(--ink) mt-1 pr-5">{source.label}</div>
      <div className="text-xs text-(--ink-3) leading-snug pr-5">{source.sub}</div>
    </CheckboxCard>
  );
}
