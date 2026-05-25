import {
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Plane,
  Building2,
  Sparkles,
  TrendingUp,
  PiggyBank,
  CircleDot,
  Briefcase,
  Laptop,
  Building,
  Gift,
  ArrowUpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExpenseCategory, IncomeSourceValue } from "@/schema/transaction";

type LucideIcon = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

const EXPENSE_ICONS: Record<ExpenseCategory, LucideIcon> = {
  FOOD: Utensils,
  TRANSPORT: Car,
  BILLS: Home,
  ENTERTAINMENT: Film,
  HEALTH: HeartPulse,
  SHOPPING: ShoppingBag,
  EDUCATION: GraduationCap,
  TRAVEL: Plane,
  HOUSING: Building2,
  PERSONAL_CARE: Sparkles,
  INVESTMENTS: TrendingUp,
  SAVINGS: PiggyBank,
  OTHER: CircleDot,
};

const INCOME_ICONS: Record<IncomeSourceValue, LucideIcon> = {
  SALARY: Briefcase,
  FREELANCE: Laptop,
  INVESTMENTS: TrendingUp,
  RENTAL: Building,
  BUSINESS: Building2,
  GIFT: Gift,
  OTHER: ArrowUpCircle,
};

interface TransactionTypeIconProps {
  type: "income" | "expense";
  category?: ExpenseCategory;
  source?: IncomeSourceValue;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TransactionTypeIcon({
  type,
  category,
  source,
  size = "md",
  className,
}: TransactionTypeIconProps) {
  const Icon =
    type === "income"
      ? INCOME_ICONS[source ?? "OTHER"]
      : EXPENSE_ICONS[category ?? "OTHER"];
  const isIncome = type === "income";

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const iconSizes = { sm: 13, md: 15, lg: 18 };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full flex-none",
        sizeClasses[size],
        isIncome
          ? "bg-(--positive-wash) text-(--positive)"
          : "bg-(--paper-2) text-(--ink-2)",
        className,
      )}
    >
      <Icon size={iconSizes[size]} strokeWidth={1.75} />
    </div>
  );
}
