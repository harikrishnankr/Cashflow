"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { SocialButton } from "./social-button";
import { EyeIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { RegisterCredentials } from "@/types/auth.types";

function getStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

const STRENGTH_COLORS: Record<number, string> = {
  1: "var(--negative)",
  2: "var(--orange)",
  3: "var(--positive)",
  4: "var(--positive)",
};

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, error, loading }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = getStrength(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    await onSubmit({ name, email, password });
  }

  return (
    <div className="my-auto max-w-100 w-full self-center">
      <span className="text-[11px] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-2.5 block">
        Create account
      </span>
      <h3
        className="font-normal text-[40px] tracking-[-0.02em] m-0 mb-2 leading-[1.05]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Start your ledger.
      </h3>
      <p className="text-(--ink-3) text-sm m-0 mb-8">Free for 14 days. No card required.</p>

      {/* Desktop: social above form */}
      <div className="hidden lg:block">
        <SocialButton provider="google" className="mb-0" />
        <Divider label="or with email" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        <Input
          label="Full name"
          type="text"
          placeholder="Jamie Li"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
        <Input
          label="Work email"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        {/* Password with strength meter */}
        <div className="flex flex-col gap-0">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            trail={
              <span
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <EyeIcon open={showPassword} />
              </span>
            }
          />
          {password && (
            <>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="flex-1 h-0.75 rounded-sm transition-colors"
                    style={{
                      background: i <= strength.score
                        ? STRENGTH_COLORS[strength.score]
                        : "var(--paper-3)",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-[11px] mt-1.5 tracking-[0.05em]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
              >
                Strength:{" "}
                <strong style={{ color: STRENGTH_COLORS[strength.score] }}>
                  {strength.label}
                </strong>
              </p>
            </>
          )}
        </div>

        {/* Terms checkbox with links */}
        <label
          className="flex items-start gap-2 mt-2 text-xs leading-[1.55] cursor-pointer select-none"
          style={{ color: "var(--ink-3)" }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="sr-only"
            required
          />
          <span
            className="w-4 h-4 border rounded flex items-center justify-center transition-colors flex-none mt-0.5"
            style={{
              background: agreed ? "var(--ink)" : "var(--card)",
              borderColor: agreed ? "var(--ink)" : "var(--hairline-strong)",
              color: agreed ? "var(--paper)" : "transparent",
            }}
            aria-hidden
          >
            {agreed && <CheckIcon />}
          </span>
          <span style={{ flex: 1 }}>
            I agree to the{" "}
            <Link
              href="/terms"
              className="underline decoration-(--hairline-strong) underline-offset-[3px]"
              style={{ color: "var(--ink-2)" }}
            >
              Terms
            </Link>
            {" "}and{" "}
            <Link
              href="/privacy"
              className="underline decoration-(--hairline-strong) underline-offset-[3px]"
              style={{ color: "var(--ink-2)" }}
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <p
            className="text-sm rounded-(--r-sm) px-3 py-2 border"
            style={{
              color: "var(--negative)",
              background: "var(--negative-wash)",
              borderColor: "color-mix(in srgb, var(--negative) 20%, transparent)",
            }}
          >
            {error}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading || !agreed}>
          {loading ? "Creating account…" : "Create account"}
          {!loading && <ArrowRightIcon />}
        </Button>
      </form>

      {/* Mobile: social below form */}
      <div className="lg:hidden mt-1">
        <Divider label="or" />
        <SocialButton provider="google" />
      </div>
    </div>
  );
}
