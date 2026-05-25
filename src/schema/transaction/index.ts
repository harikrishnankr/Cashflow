// Types and re-exports for both UI and server use.
// Import constants/labels from "@/schema/transaction/constants" directly in UI components.

import type { ExpenseCategory, IncomeSourceValue, FrequencyValue } from "./constants";

export {
  INCOME_SOURCES,
  FREQUENCIES,
  EXPENSE_CATEGORIES,
  INCOME_SOURCE_LABELS,
  EXPENSE_CATEGORY_LABELS,
  FREQUENCY_LABELS,
} from "./constants";
export type {
  ExpenseCategory,
  IncomeSource,
  IncomeSourceValue,
  FrequencyValue,
} from "./constants";

// ─── Zod schemas — server / form-validation use only ──────────────────────

export { createIncomeSchema, updateIncomeSchema } from "./income.schema";
export { createExpenseSchema, updateExpenseSchema } from "./expense.schema";
export {
  createRecurringIncomeSchema,
  updateRecurringIncomeSchema,
  createRecurringExpenseSchema,
  updateRecurringExpenseSchema,
} from "./recurring.schema";
export type {
  CreateRecurringIncomeInput,
  UpdateRecurringIncomeInput,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
} from "./recurring.schema";
export {
  transactionStatsSchema,
  listTransactionsSchema,
  listRecurringSchema,
} from "./query.schema";
export type {
  TransactionStatsQuery,
  ListTransactionsQuery,
  ListRecurringQuery,
} from "./query.schema";

// ─── Transaction form value types ─────────────────────────────────────────

export type CreateIncomeFormValues = {
  source: IncomeSourceValue;
  amount: number;
  date: string;     // ISO 8601 datetime, e.g. "2026-05-17T10:30:00.000Z"
  notes?: string;
};
export type UpdateIncomeFormValues = Partial<CreateIncomeFormValues>;

export type CreateExpenseFormValues = {
  category: ExpenseCategory;
  amount: number;
  date: string;     // ISO 8601 datetime, e.g. "2026-05-17T10:30:00.000Z"
  notes?: string;
};
export type UpdateExpenseFormValues = Partial<CreateExpenseFormValues>;

// ─── Recurring form value types ────────────────────────────────────────────

export type CreateRecurringIncomeFormValues = {
  source: IncomeSourceValue;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;    // ISO 8601 datetime
  endDate?: string;     // ISO 8601 datetime
  notes?: string;
  reminderDaysBefore?: number;
  isActive?: boolean;
};
export type UpdateRecurringIncomeFormValues = Partial<CreateRecurringIncomeFormValues>;

export type CreateRecurringExpenseFormValues = {
  category: ExpenseCategory;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;    // ISO 8601 datetime
  endDate?: string;     // ISO 8601 datetime
  notes?: string;
  reminderDaysBefore?: number;
  isActive?: boolean;
};
export type UpdateRecurringExpenseFormValues = Partial<CreateRecurringExpenseFormValues>;

// ─── Transaction list/search response types ────────────────────────────────

export type IncomeListItem = {
  type: "income";
  id: number;
  source: IncomeSourceValue;
  amount: number;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseListItem = {
  type: "expense";
  id: number;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionListItem = IncomeListItem | ExpenseListItem;

export type TransactionListResponse = {
  items: TransactionListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ─── Recurring list response types ────────────────────────────────────────

export type RecurringIncomeListItem = {
  type: "income";
  id: number;
  source: IncomeSourceValue;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  reminderDaysBefore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecurringExpenseListItem = {
  type: "expense";
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  reminderDaysBefore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecurringListItem = RecurringIncomeListItem | RecurringExpenseListItem;

export type RecurringListResponse = {
  items: RecurringListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ─── Single-record API response types ─────────────────────────────────────

export type IncomeDto = {
  id: number;
  userId: string;
  source: IncomeSourceValue;
  amount: number;
  date: string;
  notes?: string | null;
  recurringIncomeId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseDto = {
  id: number;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string | null;
  recurringExpenseId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type RecurringIncomeDto = {
  id: number;
  userId: string;
  source: IncomeSourceValue;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  reminderDaysBefore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecurringExpenseDto = {
  id: number;
  userId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  frequency: FrequencyValue;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  reminderDaysBefore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionTypeFilter = "all" | "income" | "expense";
export type SortValue = "date:desc" | "date:asc" | "createdAt:desc" | "createdAt:asc";

export type TransactionStats = {
  income: number;
  spending: number;
  net: number;
  count: number;
};
