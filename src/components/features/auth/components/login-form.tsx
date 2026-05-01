"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { SocialButton } from "./social-button";
import { EyeIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { LoginCredentials } from "@/schema/auth";

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

      {/* Desktop: social above form */}
      <div className="hidden lg:block">
        <SocialButton provider="google" className="mb-0" />
        <Divider label="or with email" />
      </div>

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
              <EyeIcon open={showPassword} />
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
          {!loading && <ArrowRightIcon />}
        </Button>
      </form>

      {/* Mobile: social below form */}
      <div className="lg:hidden mt-1">
        <Divider label="or" />
        <SocialButton provider="google" />
      </div>

      <p className="mt-6 text-xs text-(--ink-3) text-center leading-relaxed">
        By continuing you agree to our{" "}
        <Link href="/terms" className="text-(--ink-2) underline decoration-(--hairline-strong) underline-offset-[3px]">Terms</Link>.
      </p>
    </div>
  );
}
