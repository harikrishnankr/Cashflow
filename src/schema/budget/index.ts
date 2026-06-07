export { BUDGET_PERIODS, createBudgetSchema, updateBudgetSchema } from "./budget.schema";
export type { BudgetPeriodValue, CreateBudgetInput, UpdateBudgetInput } from "./budget.schema";
export { listBudgetsSchema } from "./query.schema";
export type { ListBudgetsQuery } from "./query.schema";

import type { BudgetPeriodValue } from "./budget.schema";

export type BudgetStatus = "on_track" | "near_limit" | "over_budget";

export type BudgetDto = {
  id: number;
  userId: string;
  name: string;
  category: string;
  amount: number;
  period: BudgetPeriodValue;
  periodStart: string;
  periodEnd: string;
  alertThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BudgetListItem = {
  id: number;
  name: string;
  category: string;
  amount: number;
  period: BudgetPeriodValue;
  periodStart: string;
  periodEnd: string;
  alertThreshold: number;
  isActive: boolean;
  spent: number;
  transactionCount: number;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
};

export type BudgetSummary = {
  totalBudget: number;
  totalSpending: number;
  onTrack: number;
  nearLimit: number;
  overBudget: number;
};

export type BudgetListResponse = {
  items: BudgetListItem[];
  summary: BudgetSummary;
};
