"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import type { BudgetListItem } from "@/schema/budget";
import { EXPENSE_CATEGORY_LABELS } from "@/schema/transaction";
import type { ExpenseCategory } from "@/schema/transaction/constants";
import { CATEGORY_META } from "../constants";

interface BudgetCardProps {
  budget: BudgetListItem;
  month: number;
  year: number;
  onEdit: (budget: BudgetListItem) => void;
  onDelete: (budget: BudgetListItem) => void;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function daysElapsed(year: number, month: number): number {
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
  return isCurrentMonth ? now.getDate() : daysInMonth(year, month);
}

export function BudgetCard({
  budget,
  month,
  year,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const {
    name,
    category,
    amount,
    spent,
    transactionCount,
    alertThreshold,
    status,
  } = budget;

  const meta =
    CATEGORY_META[category as ExpenseCategory] ?? CATEGORY_META.OTHER;
  const Icon = meta.icon;

  const pct = amount > 0 ? Math.min(100, (spent / amount) * 100) : 0;
  const thresholdPct = alertThreshold * 100;
  const remaining = amount - spent;

  const totalDays = daysInMonth(year, month);
  const elapsed = daysElapsed(year, month);
  const avgPerDay = elapsed > 0 ? spent / elapsed : 0;
  const paceExpected = (amount / totalDays) * elapsed;

  const isOver = status === "over_budget";
  const isNear = status === "near_limit";

  const barColor = isOver
    ? "var(--negative)"
    : isNear
      ? "var(--warning)"
      : meta.color;

  const statusTag = isOver ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-(--negative)/10 text-(--negative) border border-(--negative)/20">
      Over by {formatCurrency(Math.abs(remaining))}
    </span>
  ) : isNear ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-(--warning)/10 text-(--warning) border border-(--warning)/20">
      Near limit
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-(--positive)/10 text-(--positive) border border-(--positive)/20">
      On track
    </span>
  );

  return (
    <div
      className={cn(
        "bg-(--card) border rounded-(--r-md) p-5 transition-shadow hover:shadow-(--shadow-sm)",
        isOver
          ? "border-(--negative)/30 bg-linear-to-b from-(--negative)/5 to-(--card)"
          : isNear
            ? "border-(--warning)/30"
            : "border-(--hairline)",
      )}
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: meta.color }}
        >
          <Icon size={16} color="#fff" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.9375rem] font-semibold text-(--ink) truncate">
            {name}
          </div>
          <div className="text-xs text-(--ink-3) mt-0.5">
            {EXPENSE_CATEGORY_LABELS[category as ExpenseCategory] ?? category} ·{" "}
            {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="shrink-0">{statusTag}</div>
      </div>

      {/* Amounts */}
      <div className="flex items-baseline gap-1.5 mb-3 tabular-nums">
        <span
          className={cn(
            "text-[2.25rem] leading-none tracking-tight font-semibold",
            isOver ? "text-(--negative)" : "text-(--ink)",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatCurrency(spent)}
        </span>
        <span className="text-sm text-(--ink-3)">of</span>
        <span className="font-mono text-sm text-(--ink-2)">
          {formatCurrency(amount)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-(--paper-2) rounded-full overflow-visible mb-1.5">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
            maxWidth: "100%",
          }}
        />
        {/* Alert threshold marker */}
        {thresholdPct < 100 && (
          <div
            className="absolute -top-0.75 -bottom-0.75 w-px bg-(--ink-3)/40"
            style={{ left: `${thresholdPct}%` }}
          >
            <div className="absolute -top-0.75 -left-0.75 w-1.75 h-1.75 rounded-full bg-(--ink-3)/50" />
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex justify-between text-xs font-mono text-(--ink-3) mb-4">
        <span>
          Pace · day {elapsed} of {totalDays}
        </span>
        <span className="text-(--ink-2) font-medium">
          {remaining >= 0
            ? `${formatCurrency(remaining)} left`
            : `${formatCurrency(Math.abs(remaining))} over`}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-(--hairline)">
        <span
          className={cn(
            "text-[1.375rem] leading-none tracking-tight font-semibold tabular-nums",
            isOver ? "text-(--negative)" : "text-(--ink)",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pct.toFixed(0)}%
        </span>
        <span className="text-xs font-mono text-(--ink-3) mx-auto">
          {spent > 0 && elapsed > 0
            ? `Avg/day · ${formatCurrency(avgPerDay)}`
            : `Expected by now · ${formatCurrency(paceExpected)}`}
        </span>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(budget)}
            title="Edit budget"
            className="w-7 h-7 rounded-md border border-(--hairline) bg-transparent text-(--ink-3) flex items-center justify-center hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(budget)}
            title="Delete budget"
            className="w-7 h-7 rounded-md border border-(--hairline) bg-transparent text-(--ink-3) flex items-center justify-center hover:bg-(--negative)/10 hover:text-(--negative) hover:border-(--negative)/30 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddBudgetCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full min-h-55 flex flex-col items-center justify-center gap-2 px-8",
        "rounded-(--r-md) border-[1.5px] border-dashed border-(--hairline-strong)",
        "text-(--ink-3) bg-transparent cursor-pointer",
        "hover:border-(--orange) hover:text-(--orange) hover:bg-(--orange-wash)",
        "transition-colors",
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <span className="text-sm font-medium">Add a budget</span>
      <span className="text-xs text-center leading-relaxed">
        Set a monthly limit for any spending category.
      </span>
    </button>
  );
}
