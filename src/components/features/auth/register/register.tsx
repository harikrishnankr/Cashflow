"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { RegisterCredentials } from "@/schema/auth";
import { SocialButton } from "../components/social-button";
import { PasswordInput } from "./password-input/password-input";
import { TermsCheckbox } from "./terms-checkbox/terms-checkbox";

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, error, loading }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

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
      <p className="text-(--ink-3) text-sm m-0 mb-8">
        No card required to register.
      </p>

      <div className="hidden lg:block">
        <SocialButton provider="google" className="mb-0" />
        <Divider label="or with email" />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3.5"
      >
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
        <PasswordInput value={password} onChange={setPassword} />

        <TermsCheckbox agreed={agreed} setAgreed={setAgreed} />

        {error && (
          <p
            className="text-sm rounded-(--r-sm) px-3 py-2 border"
            style={{
              color: "var(--negative)",
              background: "var(--negative-wash)",
              borderColor:
                "color-mix(in srgb, var(--negative) 20%, transparent)",
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

      <div className="lg:hidden mt-1">
        <Divider label="or" />
        <SocialButton provider="google" />
      </div>
    </div>
  );
}
