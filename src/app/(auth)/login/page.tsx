"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthSplitLayout, LoginForm, PreviewStatement } from "@/components/features/auth";
import { apiClient } from "@/lib/api/client";
import type { LoginCredentials } from "@/types/auth.types";

const PREVIEW_TRANSACTIONS = [
  { label: "Salary · Quanta", amount: "+ $3,800.00", positive: true },
  { label: "Blue Bottle Coffee", amount: "− $4.50" },
  { label: "Whole Foods", amount: "− $68.12" },
  { label: "Con Edison", amount: "− $94.00" },
];

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(credentials: LoginCredentials) {
    setError("");
    setLoading(true);

    try {
      const result = await apiClient.auth.login(credentials);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
      subCopy="Sign in to pick up where you left off. Your April ledger is waiting — two new transactions since yesterday."
      switchLink={{ label: "New to CashFlow?", text: "Create account", href: "/register" }}
      decoration={
        <PreviewStatement
          period="April 2026 · Month so far"
          balance="4,208"
          balanceCents="52"
          change="+ $240 vs March"
          transactions={PREVIEW_TRANSACTIONS}
        />
      }
    >
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
    </AuthSplitLayout>
  );
}
