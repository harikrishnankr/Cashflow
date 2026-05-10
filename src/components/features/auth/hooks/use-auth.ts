"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { useAuthStore } from "../stores/auth-store";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthSession,
} from "@/schema/auth";
import { UserProfile } from "@/schema/user";

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
      http<AuthSession>("/auth/register", {
        method: "POST",
        body: credentials,
      }),
    onSuccess: (session) => setSession(session),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => http("/auth/logout", { method: "POST" }),
    onSuccess: () => clearSession(),
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => http<UserProfile>(`/user`),
    refetchOnWindowFocus: false,
  });
}


export function useSession() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore(s => s.clearSession);

  return {
    session,
    setSession,
    isAuthenticated,
    clearSession,
  };
}
