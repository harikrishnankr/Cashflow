import { authRepository } from "./auth.repository";
import { InvalidCredentialsError, EmailTakenError } from "./auth.errors";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
} from "@/schema/auth";
import {
  ACCESS_TTL_MS,
  REFRESH_TTL_LONG_MS,
  REFRESH_TTL_MS,
} from "./auth.constants";
import {
  generateAccessToken,
  generateRefreshTokenRaw,
  hashPassword,
  hashToken,
  verifyPassword,
} from "./auth.utils";

export async function loginUser(
  credentials: LoginCredentials,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<LoginResponse> {
  const user = await authRepository.findByEmail(credentials.email);
  if (!user || !user.passwordHash) throw new InvalidCredentialsError();
  
  const valid = await verifyPassword(credentials.password, user.passwordHash);
  if (!valid) throw new InvalidCredentialsError();

  const rawRefreshToken = generateRefreshTokenRaw();
  const [accessToken, refreshTokenHash] = await Promise.all([
    generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    }),
    hashToken(rawRefreshToken),
  ]);

  const rememberMe = credentials.rememberMe ?? false;
  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    rememberMe,
    expiresAt: new Date(
      Date.now() + (rememberMe ? REFRESH_TTL_LONG_MS : REFRESH_TTL_MS),
    ),
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
  });

  return {
    ok: true,
    data: {
      session: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl ?? undefined,
          currency: user.currency,
          timezone: user.timezone,
          hasOnBoarded: user.hasOnBoarded,
          primaryIncomeSource: user.primaryIncomeSource || undefined,
          updatedAt: user.updatedAt.toISOString(),
          createdAt: user.createdAt.toISOString(),
        },
      },
      accessToken,
      refreshToken: rawRefreshToken,
    },
  };
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const exists = await authRepository.emailExists(credentials.email);
  if (exists) throw new EmailTakenError();

  const passwordHash = await hashPassword(credentials.password);
  const user = await authRepository.createUser({
    email: credentials.email,
    name: credentials.name,
    passwordHash,
  });

  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? undefined,
        createdAt: user.createdAt.toISOString(),
      },
    },
  };
}

export async function refreshSession(
  rawRefreshToken: string,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<RefreshResponse> {
  const tokenHash = await hashToken(rawRefreshToken);
  const stored = await authRepository.findRefreshToken(tokenHash);

  if (!stored) throw new InvalidCredentialsError();
  if (stored.revokedAt) throw new InvalidCredentialsError();
  if (stored.expiresAt < new Date()) throw new InvalidCredentialsError();

  const user = await authRepository.findUserById(stored.userId);
  if (!user) throw new InvalidCredentialsError();

  const newRawToken = generateRefreshTokenRaw();
  const [accessToken, newHash] = await Promise.all([
    generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    }),
    hashToken(newRawToken),
  ]);

  const ttl = stored.rememberMe ? REFRESH_TTL_LONG_MS : REFRESH_TTL_MS;
  await authRepository.rotateRefreshToken(tokenHash, {
    userId: stored.userId,
    tokenHash: newHash,
    rememberMe: stored.rememberMe,
    expiresAt: new Date(Date.now() + ttl),
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
  });

  return {
    ok: true,
    data: {
      accessToken,
      refreshToken: newRawToken,
      rememberMe: stored.rememberMe,
    },
  };
}

export async function logoutUser(rawRefreshToken: string): Promise<void> {
  const tokenHash = await hashToken(rawRefreshToken);
  await authRepository.revokeRefreshToken(tokenHash).catch(() => {
    // Silently ignore — token may already be expired or not found.
  });
}

export { ACCESS_TTL_MS as ACCESS_TOKEN_TTL_MS };
