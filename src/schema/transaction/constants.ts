// Zero-dependency file — safe to import in "use client" components.
// Both UI and server-side code should import from here, not from Zod schema files.

import { INCOME_SOURCES, FREQUENCIES } from "@/schema/user/income.constants";

export { INCOME_SOURCES, FREQUENCIES } from "@/schema/user/income.constants";
export type { IncomeSource } from "@/schema/user";

// ─── Expense categories ────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "SHOPPING",
  "EDUCATION",
  "TRAVEL",
  "HOUSING",
  "PERSONAL_CARE",
  "INVESTMENTS",
  "SAVINGS",
  "OTHER",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeSourceValue = (typeof INCOME_SOURCES)[number];
export type FrequencyValue = (typeof FREQUENCIES)[number];

// ─── Human-readable labels (for dropdowns, display text, etc.) ─────────────

export const INCOME_SOURCE_LABELS: Record<IncomeSourceValue, string> = {
  SALARY: "Salary",
  FREELANCE: "Freelance",
  INVESTMENTS: "Investments",
  RENTAL: "Rental",
  BUSINESS: "Business",
  GIFT: "Gift / Other",
  OTHER: "Other",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  FOOD: "Food & Dining",
  TRANSPORT: "Transport",
  BILLS: "Bills & Utilities",
  ENTERTAINMENT: "Entertainment",
  HEALTH: "Health & Fitness",
  SHOPPING: "Shopping",
  EDUCATION: "Education",
  TRAVEL: "Travel",
  HOUSING: "Housing",
  PERSONAL_CARE: "Personal Care",
  INVESTMENTS: "Investments",
  SAVINGS: "Savings",
  OTHER: "Other",
};

export const FREQUENCY_LABELS: Record<FrequencyValue, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BIWEEKLY: "Every two weeks",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};
