import { cn } from "@/lib/utils";
import { CapsLabel } from "@/components/ui";
import { formatCurrency } from "../utils/format";

interface TransactionSummaryProps {
  income: number;
  spending: number;
  net: number;
  count: number;
  isLoading?: boolean;
}

export function TransactionSummary({
  income,
  spending,
  net,
  count,
  isLoading,
}: TransactionSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
      <SummaryCard
        label="Income"
        value={isLoading ? "—" : `+ ${formatCurrency(income)}`}
        valueClass={isLoading ? "text-(--ink-4)" : "text-(--positive)"}
      />
      <SummaryCard
        label="Spending"
        value={isLoading ? "—" : `− ${formatCurrency(spending)}`}
        valueClass={isLoading ? "text-(--ink-4)" : "text-(--negative)"}
      />
      <SummaryCard
        label="Net"
        value={
          isLoading ? "—" : `${net >= 0 ? "+" : "−"} ${formatCurrency(Math.abs(net))}`
        }
        valueClass={isLoading ? "text-(--ink-4)" : undefined}
        sub={isLoading ? undefined : `${count} transaction${count !== 1 ? "s" : ""}`}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  className?: string;
}

function SummaryCard({ label, value, sub, valueClass, className }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "bg-(--card) border border-(--hairline) rounded-(--r-md) px-4 py-3.5",
        className,
      )}
    >
      <CapsLabel className="mb-1 block">{label}</CapsLabel>
      <div
        className={cn(
          "text-xl font-mono font-semibold tabular-nums tracking-tight",
          valueClass ?? "text-(--ink)",
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs text-(--ink-3) font-mono mt-0.5">{sub}</div>
      )}
    </div>
  );
}
