import z from "zod";
import { EXPENSE_CATEGORIES } from "@/schema/transaction/constants";

export const BUDGET_PERIODS = ["WEEKLY", "MONTHLY", "YEARLY"] as const;
export type BudgetPeriodValue = (typeof BUDGET_PERIODS)[number];

export const createBudgetSchema = z
  .object({
    name: z.string().min(1, "Name is required.").max(100),
    category: z.enum(EXPENSE_CATEGORIES, { error: "Invalid expense category." }),
    amount: z.number().positive("Amount must be positive."),
    period: z.enum(BUDGET_PERIODS, { error: "Invalid budget period." }),
    periodStart: z.iso.date(),
    periodEnd: z.iso.date(),
    alertThreshold: z.number().min(0).max(1).default(0.8),
  })
  .refine(
    (d) => d.periodStart >= new Date().toISOString().slice(0, 10),
    { message: "periodStart cannot be in the past.", path: ["periodStart"] },
  )
  .refine((d) => d.periodEnd >= d.periodStart, {
    message: "periodEnd must be on or after periodStart.",
    path: ["periodEnd"],
  });

export const updateBudgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  periodEnd: z.iso.date().optional(),
  alertThreshold: z.number().min(0).max(1).optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
