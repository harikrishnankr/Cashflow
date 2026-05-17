import z from "zod";
import { INCOME_SOURCES } from "@/schema/user/income.constants";

export const createIncomeSchema = z.object({
  source: z.enum(INCOME_SOURCES, { error: "Invalid income source." }),
  amount: z.number().positive("Amount must be positive."),
  date: z.iso.datetime(),
  notes: z.string().max(500).optional(),
});

export const updateIncomeSchema = createIncomeSchema.partial();

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
