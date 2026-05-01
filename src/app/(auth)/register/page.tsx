"use client";

import { useRouter } from "next/navigation";
import {
  AuthSplitLayout,
  RegisterForm,
  useRegister,
  ValueProps,
} from "@/components/features/auth";
import type { RegisterCredentials } from "@/schema/auth";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  async function handleRegister(credentials: RegisterCredentials) {
    try {
      await registerMutation.mutateAsync(credentials);
      router.push("/dashboard");
    } catch {
      // error is captured in registerMutation.error
    }
  }

  return (
    <AuthSplitLayout
      eyebrowLabel="Join CashFlow"
      headline={
        <>
          A calmer way
          <br />
          to read your
          <br />
          <em style={{ fontStyle: "italic", color: "var(--orange)" }}>
            money.
          </em>
        </>
      }
      extraContent={<ValueProps />}
      switchLink={{
        label: "Already have an account?",
        text: "Sign in",
        href: "/login",
      }}
    >
      <RegisterForm
        onSubmit={handleRegister}
        loading={registerMutation.isPending}
        error={registerMutation.error?.message}
      />
    </AuthSplitLayout>
  );
}
