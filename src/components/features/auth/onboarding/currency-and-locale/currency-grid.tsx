"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { RadioGroup, RadioCard, Input } from "@/components/ui";
import { CURRENCIES } from "./constants";

interface CurrencyGridProps {
  value: string;
  onValueChange: (v: string) => void;
}

export function CurrencyGrid({ value, onValueChange }: CurrencyGridProps) {
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.value.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          label="Search currencies"
          placeholder="Search currencies"
          lead={<Search size={15} />}
        />
      </div>

      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        name="currency"
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {filtered.map((c) => (
          <RadioCard key={c.value} value={c.value}>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg border border-(--hairline) bg-(--paper-2) flex justify-center items-center font-(--font-display font-medium)">
                {c.glyph}
              </div>
              <div>
                <div className="text-[0.6875rem] text-(--ink-3) uppercase" style={{ fontFamily: "var(--font-mono)" }}>{c.value}</div>
                <div className="mt-0.5 text-[0.875rem] font-medium">{c.name}</div>
              </div>
            </div>
          </RadioCard>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-(--ink-3) py-4">
            No currencies match &ldquo;{search}&rdquo;
          </p>
        )}
      </RadioGroup>
    </div>
  );
}
