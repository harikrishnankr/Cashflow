"use client";

import { X } from "lucide-react";
import { FREQUENCIES, type IncomeSource } from "./constants";
import { Input, Select } from "@/components/ui";

interface IncomeSourceRowProps {
  source: IncomeSource;
  amount: string;
  onAmountChange: (v: string) => void;
  frequency: string;
  onFrequencyChange: (v: string) => void;
  onRemove: () => void;
  currencyGlyph: string;
}

export function IncomeSourceRow({
  source,
  amount,
  onAmountChange,
  frequency,
  onFrequencyChange,
  onRemove,
  currencyGlyph,
}: IncomeSourceRowProps) {
  const Icon = source.icon;

  return (
    <div className="flex items-center gap-2.5 md:gap-3 bg-(--card) border border-(--hairline) rounded-(--r-md) px-3 py-2.5 mb-2 last:mb-0">
      <div className="w-7 h-7 rounded-full bg-(--paper-2) border border-(--hairline) flex items-center justify-center shrink-0">
        <Icon size={13} strokeWidth={1.75} className="text-(--ink-2)" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-(--ink) leading-snug">
          {source.label}
        </div>
        <div className="text-xs text-(--ink-3) hidden md:block leading-snug">
          {source.sub}
        </div>
      </div>

      <Input
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        lead={<span className="text-sm">{currencyGlyph}</span>}
        className="w-24 h-8 pl-6 text-[0.75rem] font-mono"
        inputMode="decimal"
      />

      <Select
        label=""
        className="h-8 px-2 pr-8 text-xs"
        value={frequency}
        onChange={(e) => onFrequencyChange(e.target.value)}
      >
        {FREQUENCIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </Select>

      <button
        type="button"
        onClick={onRemove}
        className="hidden md:flex w-7 h-7 items-center justify-center rounded-(--r-sm) text-(--ink-3) hover:bg-(--paper-2) hover:text-(--ink) transition-colors shrink-0"
        aria-label={`Remove ${source.label}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}
