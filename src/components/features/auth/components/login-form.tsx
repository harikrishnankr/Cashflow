"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { SocialButton } from "./social-button";
import type { LoginCredentials } from "@/types/auth.types";

const EyeIcon = ({ showPassword }: { showPassword: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {showPassword ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function LoginForm({ onSubmit, error, loading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ email, password, rememberMe });
  }

  return (
    <div className="my-auto max-w-100 w-full self-center">
      <span className="text-[11px] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-2.5 block">
        Sign in
      </span>
      <h3
        className="font-display font-normal text-[40px] tracking-[-0.02em] m-0 mb-2 leading-[1.05]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome back.
      </h3>
      <p className="text-(--ink-3) text-sm m-0 mb-8">Use your email or continue with a provider.</p>

      <SocialButton provider="google" className="mb-0" />
      <Divider label="or with email" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        <Input
          label="Email"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          trail={
            <span onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
              <EyeIcon showPassword={showPassword} />
            </span>
          }
        />

        <div className="flex justify-between items-center mt-1.5 mb-2">
          <Checkbox
            label="Keep me signed in"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link href="/forgot-password" className="text-sm text-(--ink) no-underline hover:underline hover:decoration-(--orange)">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-(--negative) bg-(--negative-wash) border border-(--negative) border-opacity-20 rounded-(--r-sm) px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </Button>
      </form>

      <p className="mt-7 text-xs text-(--ink-3) text-center leading-relaxed flex items-center justify-center gap-1">
        Protected by reCAPTCHA ·
        <Link href="/privacy" className="text-(--ink-2)">Privacy</Link>
        &amp;
        <Link href="/terms" className="text-(--ink-2)">Terms</Link>
      </p>
    </div>
  );
}
