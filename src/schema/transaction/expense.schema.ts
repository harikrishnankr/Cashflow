import z from "zod";
import { EXPENSE_CATEGORIES } from "./constants";

export const createExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES, { error: "Invalid expense category." }),
  amount: z.number().positive("Amount must be positive."),
  date: z.iso.datetime(),
  notes: z.string().max(500).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
