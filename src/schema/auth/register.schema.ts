import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include at least one uppercase letter.")
    .regex(/[0-9]/, "Must include at least one number."),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
