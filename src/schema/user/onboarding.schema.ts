import z from "zod";
import { INCOME_SOURCES, FREQUENCIES } from "./income.constants";
export { INCOME_SOURCES, FREQUENCIES } from "./income.constants";

const recurringIncomeSchema = z.object({
  source: z.enum(INCOME_SOURCES, { error: "Invalid income source." }),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(100, "Description is too long."),
  amount: z.number().positive("Amount must be positive."),
  frequency: z.enum(FREQUENCIES, { error: "Invalid frequency." }),
  startDate: z.iso.date(),
  notes: z.string().optional(),
  reminderDaysBefore: z.number().int().min(0).max(30).optional(),
});

export const onboardingSchema = z.object({
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code.")
    .toUpperCase(),
  timezone: z.string().optional(),
  recurringIncomes: z
    .array(recurringIncomeSchema)
    .min(1, "At least one recurring income is required."),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
