"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthSplitLayout, RegisterForm } from "@/components/features/auth";
import { apiClient } from "@/lib/api/client";
import type { RegisterCredentials } from "@/types/auth.types";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(credentials: RegisterCredentials) {
    setError("");
    setLoading(true);

    try {
      const result = await apiClient.auth.register(credentials);

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
      eyebrowLabel="New here"
      headline={
        <>
          Your money,
          <br />
          finally <em className="text-(--orange)">in order.</em>
        </>
      }
      subCopy="Join thousands of people who track every dollar with CashFlow. Set up takes under two minutes."
      switchLink={{ label: "Already have an account?", text: "Sign in", href: "/login" }}
    >
      <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />
    </AuthSplitLayout>
  );
}
