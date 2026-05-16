export type UserRole = "admin" | "member";

export type IncomeSource =
  | "SALARY"
  | "FREELANCE"
  | "INVESTMENTS"
  | "RENTAL"
  | "BUSINESS"
  | "GIFT"
  | "OTHER";

export type RecurringFrequency =
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY";

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  currency: string;
  timezone: string;
  hasOnBoarded: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserDto = {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserDto = {
  name?: string;
  avatarUrl?: string;
  role?: UserRole;
};

export type OnboardingRecurringIncome = {
  source: IncomeSource;
  description: string;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  notes?: string;
  reminderDaysBefore?: number;
};

export type OnboardingDto = {
  currency: string;
  timezone?: string;
  recurringIncomes: OnboardingRecurringIncome[];
};
