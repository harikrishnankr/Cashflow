import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { CapsLabel } from "@/components/ui";
import type { BudgetListItem, BudgetSummary } from "@/schema/budget";
import { MONTHS } from "../constants";

interface BudgetSummaryStripProps {
  summary: BudgetSummary;
  items: BudgetListItem[];
  month: number;
  year: number;
  isLoading?: boolean;
}

export function BudgetSummaryStrip({
  summary,
  items,
  month,
  year,
  isLoading,
}: BudgetSummaryStripProps) {
  const spendPct =
    summary.totalBudget > 0
      ? Math.min(100, (summary.totalSpending / summary.totalBudget) * 100)
      : 0;

  const remaining = summary.totalBudget - summary.totalSpending;

  const totalOverspend = items
    .filter((b) => b.status === "over_budget")
    .reduce((sum, b) => sum + Math.max(0, b.spent - b.amount), 0);

  const skeleton = "animate-pulse bg-(--paper-2) rounded h-4 w-16";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {/* Hero */}
      <div className="col-span-2 bg-(--ink) text-(--paper) rounded-(--r-md) border border-(--ink) px-5 py-4">
        <CapsLabel className="text-[rgba(250,247,242,0.55)] block mb-1">
          Total budget · {MONTHS[month - 1]} {year}
        </CapsLabel>
        {isLoading ? (
          <div className={cn(skeleton, "w-28 h-7 mb-3")} />
        ) : (
          <div
            className="text-[1.875rem] leading-none tracking-tight font-semibold tabular-nums mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-[1.25rem] text-[rgba(250,247,242,0.5)]">$</span>
            {summary.totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        )}
        <div className="h-1.5 bg-[rgba(250,247,242,0.15)] rounded-full overflow-hidden mb-2.5">
          <span
            className="block h-full rounded-full bg-(--orange) transition-[width] duration-500"
            style={{ width: `${spendPct}%` }}
          />
        </div>
        {isLoading ? (
          <div className={cn(skeleton, "w-48 opacity-60")} />
        ) : (
          <p className="text-[0.6875rem] font-mono text-[rgba(250,247,242,0.55)] leading-relaxed">
            {formatCurrency(summary.totalSpending)} spent ·{" "}
            {remaining >= 0
              ? `${formatCurrency(remaining)} remaining`
              : `${formatCurrency(Math.abs(remaining))} over`}{" "}
            · {spendPct.toFixed(0)}% used
          </p>
        )}
      </div>

      {/* On track */}
      <StatCard
        label="On track"
        value={isLoading ? "—" : String(summary.onTrack)}
        valueClass="text-(--positive)"
        sub="categories under pace"
        isLoading={isLoading}
      />

      {/* Near limit */}
      <StatCard
        label="Near limit"
        value={isLoading ? "—" : String(summary.nearLimit)}
        valueClass="text-(--warning)"
        sub={`over ${items[0]?.alertThreshold != null ? Math.round(items[0].alertThreshold * 100) : 80}% used`}
        isLoading={isLoading}
      />

      {/* Over budget */}
      <StatCard
        label="Over budget"
        value={isLoading ? "—" : String(summary.overBudget)}
        valueClass={summary.overBudget > 0 ? "text-(--negative)" : undefined}
        sub={
          totalOverspend > 0
            ? `overspend by ${formatCurrency(totalOverspend)}`
            : "all within limits"
        }
        isLoading={isLoading}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  isLoading?: boolean;
  className?: string;
}

function StatCard({ label, value, sub, valueClass, isLoading, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-(--card) border border-(--hairline) rounded-(--r-md) px-4 py-3.5",
        className,
      )}
    >
      <CapsLabel className="block mb-1">{label}</CapsLabel>
      {isLoading ? (
        <div className="animate-pulse bg-(--paper-2) rounded h-7 w-8 mb-1" />
      ) : (
        <div
          className={cn(
            "text-[1.875rem] leading-none tracking-tight font-semibold tabular-nums",
            valueClass ?? "text-(--ink)",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </div>
      )}
      {sub && <p className="text-xs font-mono text-(--ink-3) mt-1">{sub}</p>}
    </div>
  );
}
