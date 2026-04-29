import { authRepository } from "./auth.repository";
import { InvalidCredentialsError, EmailTakenError } from "./auth.errors";
import type { LoginCredentials, RegisterCredentials, AuthSession } from "@/types/auth.types";

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export async function loginUser(credentials: LoginCredentials): Promise<AuthResult<AuthSession>> {
  try {
    const user = await authRepository.findByEmail(credentials.email);

    if (!user) throw new InvalidCredentialsError();

    // TODO: replace with bcrypt.compare(credentials.password, user.passwordHash)
    const passwordValid = credentials.password === user.passwordHash;
    if (!passwordValid) throw new InvalidCredentialsError();

    // TODO: generate a real JWT/session token
    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
    const expiresAt = new Date(Date.now() + (credentials.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();

    return {
      ok: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl ?? undefined, createdAt: user.createdAt.toISOString() },
        accessToken,
        expiresAt,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { ok: false, error: { code: (err as { code?: string }).code ?? "UNKNOWN", message: err.message } };
    }
    return { ok: false, error: { code: "UNKNOWN", message: "Something went wrong." } };
  }
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResult<AuthSession>> {
  try {
    const exists = await authRepository.emailExists(credentials.email);
    if (exists) throw new EmailTakenError();

    // TODO: hash password with bcrypt before storing
    const user = await authRepository.createUser({
      email: credentials.email,
      name: credentials.name,
      passwordHash: credentials.password,
    });

    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      ok: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl ?? undefined, createdAt: user.createdAt.toISOString() },
        accessToken,
        expiresAt,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { ok: false, error: { code: (err as { code?: string }).code ?? "UNKNOWN", message: err.message } };
    }
    return { ok: false, error: { code: "UNKNOWN", message: "Something went wrong." } };
  }
}

export async function logoutUser(_accessToken: string): Promise<void> {
  // TODO: invalidate session/token in database
}
