import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/format";

interface TransactionAmountProps {
  amount: number;
  type: "income" | "expense";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function TransactionAmount({
  amount,
  type,
  size = "md",
  className,
}: TransactionAmountProps) {
  const isIncome = type === "income";
  const sign = isIncome ? "+ " : "- ";

  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-3xl",
  }[size];

  return (
    <span
      className={cn(
        "font-mono tabular-nums font-medium",
        sizeClass,
        isIncome ? "text-(--positive)" : "text-(--negative)",
        className,
      )}
    >
      {sign}{formatCurrency(amount)}
    </span>
  );
}
