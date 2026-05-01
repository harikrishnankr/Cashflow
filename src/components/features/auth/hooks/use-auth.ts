"use client";

import { useMutation } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { useAuthStore } from "../stores/auth-store";
import type { LoginCredentials, RegisterCredentials, AuthSession } from "@/schema/auth";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      http<AuthSession>("/auth/login", { method: "POST", body: credentials }),
    onSuccess: (session) => setSession(session),
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      http<AuthSession>("/auth/register", { method: "POST", body: credentials }),
    onSuccess: (session) => setSession(session),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const token = useAuthStore((s) => s.session?.accessToken);

  return useMutation({
    mutationFn: () => http("/auth/logout", { method: "POST", token }),
    onSuccess: () => clearSession(),
  });
}
