import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name is too long."),
  avatarUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

const INCOME_SOURCES = [
  "SALARY",
  "FREELANCE",
  "INVESTMENTS",
  "RENTAL",
  "BUSINESS",
  "GIFT",
  "OTHER",
] as const;

export const onboardingSchema = z.object({
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code.")
    .toUpperCase(),
  incomeSource: z.enum(INCOME_SOURCES, { error: "Invalid income source." }),
  timezone: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
