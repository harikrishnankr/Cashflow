import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name is too long."),
  avatarUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
