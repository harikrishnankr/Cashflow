import {
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Gift,
  Plus,
  type LucideIcon,
} from "lucide-react";

export interface IncomeSource {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  defaultFrequency: string;
}

export const INCOME_SOURCES: IncomeSource[] = [
  {
    id: "salary",
    label: "Salary",
    sub: "Full-time employment, recurring.",
    icon: Briefcase,
    defaultFrequency: "monthly-1st",
  },
  {
    id: "freelance",
    label: "Freelance",
    sub: "Contract & project invoices.",
    icon: Laptop,
    defaultFrequency: "monthly-avg",
  },
  {
    id: "investments",
    label: "Investments",
    sub: "Dividends, interest, capital gains.",
    icon: TrendingUp,
    defaultFrequency: "monthly-avg",
  },
  {
    id: "rental",
    label: "Rental",
    sub: "Property or sublet income.",
    icon: Building2,
    defaultFrequency: "monthly-1st",
  },
  {
    id: "other",
    label: "Other",
    sub: "Gifts, refunds, one-offs.",
    icon: Gift,
    defaultFrequency: "as-it-happens",
  },
];

export const FREQUENCIES = [
  { value: "monthly-1st", label: "Monthly · 1st" },
  { value: "biweekly-fri", label: "Biweekly · Fri" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly-avg", label: "Monthly · avg" },
  { value: "per-project", label: "Per project" },
  { value: "as-it-happens", label: "As it happens" },
  { value: "one-off", label: "One-off" },
] as const;
