"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ChartNoAxesColumn, ShieldCheck } from "@/components/ui/icons";
import { AuthSplitLayout, RegisterForm } from "@/components/features/auth";
import { apiClient } from "@/lib/api/client";
import type { RegisterCredentials } from "@/types/auth.types";

const VALUE_PROPS = [
  {
    icon: Zap,
    title: "Log a transaction in 3 seconds",
    sub: "Fast entry from any screen. No dropdown hunting.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "See day, week, month, year",
    sub: "Switch periods in one click. Numbers stay where they are.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, locked to you",
    sub: "End-to-end encrypted. No ads, no selling.",
  },
];

function ValueProps() {
  return (
    <div className="flex flex-col gap-5 mt-10">
      {VALUE_PROPS.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex gap-4 items-start">
          <div
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center flex-none"
            style={{ background: "rgba(250,247,242,0.08)", color: "var(--orange)" }}
          >
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--paper)" }}>
              {title}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "rgba(250,247,242,0.55)" }}>
              {sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
      eyebrowLabel="Join CashFlow"
      headline={
        <>
          A calmer way
          <br />
          to read your
          <br />
          <em style={{ fontStyle: "italic", color: "var(--orange)" }}>money.</em>
        </>
      }
      extraContent={<ValueProps />}
      switchLink={{ label: "Already have an account?", text: "Sign in", href: "/login" }}
      footnote={["Free for 14 days", "No credit card"]}
    >
      <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />
    </AuthSplitLayout>
  );
}
