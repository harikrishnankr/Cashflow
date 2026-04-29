export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserRole = "admin" | "member";

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
