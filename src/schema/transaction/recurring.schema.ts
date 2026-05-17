import z from "zod";
import { INCOME_SOURCES, FREQUENCIES } from "@/schema/user/income.constants";
import { EXPENSE_CATEGORIES } from "./constants";

const baseRecurringSchema = z.object({
  description: z.string().min(1, "Description is required.").max(100),
  amount: z.number().positive("Amount must be positive."),
  frequency: z.enum(FREQUENCIES, { error: "Invalid frequency." }),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  notes: z.string().max(500).optional(),
  reminderDaysBefore: z.number().int().min(0).max(30).optional(),
  isActive: z.boolean().optional(),
});

export const createRecurringIncomeSchema = baseRecurringSchema.extend({
  source: z.enum(INCOME_SOURCES, { error: "Invalid income source." }),
});

export const updateRecurringIncomeSchema = createRecurringIncomeSchema.partial();

export const createRecurringExpenseSchema = baseRecurringSchema.extend({
  category: z.enum(EXPENSE_CATEGORIES, { error: "Invalid expense category." }),
});

export const updateRecurringExpenseSchema = createRecurringExpenseSchema.partial();

export type CreateRecurringIncomeInput = z.infer<typeof createRecurringIncomeSchema>;
export type UpdateRecurringIncomeInput = z.infer<typeof updateRecurringIncomeSchema>;
export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;
