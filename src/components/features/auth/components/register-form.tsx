"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { SocialButton } from "./social-button";
import type { RegisterCredentials } from "@/types/auth.types";

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, error, loading }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ name, email, password });
  }

  return (
    <div className="my-auto max-w-100 w-full self-center">
      <span className="text-[11px] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-2.5 block">
        Get started
      </span>
      <h3
        className="font-display font-normal text-[40px] tracking-[-0.02em] m-0 mb-2 leading-[1.05]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Create account.
      </h3>
      <p className="text-(--ink-3) text-sm m-0 mb-8">Free forever. No credit card required.</p>

      <SocialButton provider="google" className="mb-0" />
      <Divider label="or with email" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
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
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-sm text-(--negative) bg-(--negative-wash) border border-(--negative) border-opacity-20 rounded-(--r-sm) px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </Button>
      </form>

      <p className="mt-5 text-xs text-(--ink-3) text-center leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-(--ink-2)">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-(--ink-2)">Privacy Policy</Link>.
      </p>
    </div>
  );
}
