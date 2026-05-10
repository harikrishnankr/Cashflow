export type UserRole = "admin" | "member";

export type IncomeSource =
  | "SALARY"
  | "FREELANCE"
  | "INVESTMENTS"
  | "RENTAL"
  | "BUSINESS"
  | "GIFT"
  | "OTHER";

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
  primaryIncomeSource?: IncomeSource;
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

export type OnboardingDto = {
  currency: string;
  incomeSource: IncomeSource;
  timezone?: string;
};
