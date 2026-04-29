export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  expiresAt: string;
};

import type { ErrorCode } from "@/lib/errors";

export type AuthErrorCode = Extract<
  ErrorCode,
  "INVALID_CREDENTIALS" | "USER_NOT_FOUND" | "EMAIL_TAKEN" | "RATE_LIMITED" | "UNKNOWN"
>;

export type AuthError = {
  code: AuthErrorCode;
  message: string;
};
