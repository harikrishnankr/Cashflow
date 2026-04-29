"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../stores/auth-store";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.auth.login(credentials),
    onSuccess: (result) => {
      if (result.ok) setSession(result.data);
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => apiClient.auth.register(credentials),
    onSuccess: (result) => {
      if (result.ok) setSession(result.data);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
    onSuccess: () => clearSession(),
  });
}
