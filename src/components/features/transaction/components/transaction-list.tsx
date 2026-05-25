"use client";

import { useMemo } from "react";
import type { TransactionListItem } from "@/schema/transaction";
import { CapsLabel, StateMessage } from "@/components/ui";
import { TransactionCard } from "./transaction-card";
import { TransactionAmount } from "./transaction-amount";
import { formatDayLabel } from "../utils/format";

interface TransactionListProps {
  items: TransactionListItem[];
  onDelete?: (item: TransactionListItem) => void;
}

function groupByDate(items: TransactionListItem[]): [string, TransactionListItem[]][] {
  const map = new Map<string, TransactionListItem[]>();
  for (const item of items) {
    const existing = map.get(item.date) ?? [];
    existing.push(item);
    map.set(item.date, existing);
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
}

function dayNet(items: TransactionListItem[]): { amount: number; type: "income" | "expense" } {
  const net = items.reduce(
    (sum, item) => sum + (item.type === "income" ? item.amount : -item.amount),
    0,
  );
  return { amount: Math.abs(net), type: net >= 0 ? "income" : "expense" };
}

export function TransactionList({ items, onDelete }: TransactionListProps) {
  const groups = useMemo(() => groupByDate(items), [items]);

  if (items.length === 0) {
    return (
      <StateMessage variant="empty" message="No transactions found." card />
    );
  }

  return (
    <div className="bg-(--card) border border-(--hairline) rounded-(--r-md) overflow-hidden">
      {/* Desktop table header */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 border-b border-(--hairline) bg-(--paper-2)">
        <div className="w-9 shrink-0" />
        <CapsLabel className="flex-1">Description</CapsLabel>
        <CapsLabel className="w-28 text-right hidden xl:block">Category</CapsLabel>
        <CapsLabel className="w-20 text-right">Date</CapsLabel>
        <CapsLabel className="w-28 text-right">Amount</CapsLabel>
        <div className="w-7 shrink-0" />
      </div>

      {groups.map(([date, dayItems]) => {
        const net = dayNet(dayItems);
        return (
          <div key={date}>
            {/* Day divider */}
            <div className="flex items-center justify-between px-4 py-2 bg-(--paper) border-b border-(--hairline)">
              <CapsLabel>{formatDayLabel(date)}</CapsLabel>
              <TransactionAmount amount={net.amount} type={net.type} size="xs" />
            </div>

            {dayItems.map((item) => (
              <TransactionCard
                key={`${item.type}-${item.id}`}
                item={item}
                onDelete={onDelete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
