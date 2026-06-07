import { HeadingTitle } from "@/components/layout/heading-title";
import { MONTHS } from "../../constants";

export function BudgetsViewHeader({
  isLoading,
  year,
  month,
  totalItems,
}: {
  isLoading: boolean;
  year: number;
  month: number;
  totalItems: number;
}) {
  const now = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
  const elapsed = isCurrentMonth ? now.getDate() : daysInMonth;

  return (
    <div>
      <HeadingTitle>
        Your <em>budgets.</em>
      </HeadingTitle>
      {!isLoading && (
        <p className="text-sm text-(--ink-3)">
          {totalItems} budget{totalItems !== 1 ? "s" : ""} · {MONTHS[month - 1]}{" "}
          {year}{" "}
          {isCurrentMonth && `· ${elapsed} of ${daysInMonth} days elapsed`}
        </p>
      )}
    </div>
  );
}
