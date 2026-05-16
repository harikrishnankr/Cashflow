"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { useAuthStore } from "../stores/auth-store";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthSession,
} from "@/schema/auth";
import { OnboardingDto, UserProfile } from "@/schema/user";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      http<AuthSession>("/auth/login", { method: "POST", body: credentials }),
    onSuccess: (session) => setSession(session),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      http<AuthSession>("/auth/register", {
        method: "POST",
        body: credentials,
      }),
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

export function useOnboarding() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: OnboardingDto) =>
      http<UserProfile>("/user/onboarding", { method: "POST", body: payload }),
    onSuccess: (session) => setSession({ user: session }),
  });
}

export function useSession() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore((s) => s.clearSession);

  return {
    session,
    setSession,
    isAuthenticated,
    clearSession,
  };
}
