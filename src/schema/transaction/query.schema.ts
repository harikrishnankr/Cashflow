import z from "zod";
import { INCOME_SOURCES } from "@/schema/user/income.constants";
import { EXPENSE_CATEGORIES } from "./constants";

export const listTransactionsSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
  source: z.enum(INCOME_SOURCES).optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  sortBy: z.enum(["date", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().max(100).optional(),
});

export type ListTransactionsQuery = z.infer<typeof listTransactionsSchema>;

export const listRecurringSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  source: z.enum(INCOME_SOURCES).optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  // URL param "true"/"false" → boolean
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  sortBy: z.enum(["nextDueDate", "startDate", "createdAt"]).default("nextDueDate"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().max(100).optional(),
});

export type ListRecurringQuery = z.infer<typeof listRecurringSchema>;
