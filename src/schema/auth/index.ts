import type { ErrorCode } from "@/lib/errors";

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

// Cookie-based auth: tokens are set as httpOnly cookies by the server.
// The client only receives the user object — it never sees raw token values.
export type AuthSession = {
  user: AuthUser;
};

export type AuthErrorCode = Extract<
  ErrorCode,
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "EMAIL_TAKEN"
  | "RATE_LIMITED"
  | "UNKNOWN"
>;

export type AuthError = {
  code: AuthErrorCode;
  message: string;
};

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export type LoginResponse = AuthResult<{
  session: AuthSession;
  accessToken: string;
  refreshToken: string;
}>;

export type RegisterResponse = AuthResult<AuthSession>;

export type RefreshResponse = AuthResult<{
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
}>;
