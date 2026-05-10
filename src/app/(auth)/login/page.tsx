"use client";

import {
  AuthSplitLayout,
  LoginForm,
  PreviewStatement,
  useAuth,
  useLogin,
} from "@/components/features/auth";
import type { LoginCredentials } from "@/schema/auth";

export default function LoginPage() {
  const loginMutation = useLogin();
  const { refresh } = useAuth();

  const now = new Date();
  const monthYear = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function handleLogin(credentials: LoginCredentials) {
    try {
      await loginMutation.mutateAsync(credentials);
      refresh()
    } catch {
      // error is captured in loginMutation.error
    }
  }

  return (
    <AuthSplitLayout
      eyebrowLabel="Welcome back"
      headline={
        <>
          Every dollar,
          <br />
          on the <em className="text-(--orange)">same page.</em>
        </>
      }
      subCopy={`Sign in to pick up where you left off. Your ${monthYear} ledger is waiting — two new transactions since yesterday.`}
      switchLink={{
        label: "New to CashFlow?",
        text: "Create account",
        href: "/register",
      }}
      decoration={
        <PreviewStatement
          period={`${monthYear} · Month so far`}
          balance="4,208"
          balanceCents="52"
          change="+ $240 vs March"
        />
      }
    >
      <LoginForm
        onSubmit={handleLogin}
        loading={loginMutation.isPending}
        error={loginMutation.error?.message}
      />
    </AuthSplitLayout>
  );
}
