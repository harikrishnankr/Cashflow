"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Form } from "@/components/ui/form";
import { FormFieldError } from "@/components/ui/form-field-error";
import { EyeIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { LoginCredentials } from "@/schema/auth";
import { loginFormSchema } from "@/schema/auth/login.schema";
import { useForm } from "@/hooks/use-form";
import { SocialButton } from "../common/social-button";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function LoginForm({ onSubmit, error, loading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { values, setValue, errors, handleSubmit, fieldProps, errorId } =
    useForm(loginFormSchema, { email: "", password: "", rememberMe: true });

  return (
    <div className="my-auto max-w-100 w-full self-center">
      <span className="text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-2.5 block">
        Sign in
      </span>
      <h3
        className="font-display font-normal text-[2.5rem] tracking-[-0.02em] m-0 mb-2 leading-[1.05]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome back.
      </h3>
      <p className="text-(--ink-3) text-sm m-0 mb-8">
        Use your email or continue with a provider.
      </p>

      <div className="hidden lg:block">
        <SocialButton provider="google" className="mb-0" />
        <Divider label="or with email" />
      </div>

      <Form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        error={error}
        actions={
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRightIcon />}
          </Button>
        }
      >
        <div className="flex flex-col gap-1">
          <Input
            label="Email"
            type="email"
            placeholder="you@domain.com"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            autoComplete="email"
            required
            {...fieldProps("email")}
          />
          <FormFieldError id={errorId("email")} message={errors.email} />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => setValue("password", e.target.value)}
            autoComplete="current-password"
            required
            trail={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-1 cursor-pointer"
              >
                <EyeIcon open={showPassword} />
              </button>
            }
            {...fieldProps("password")}
          />
          <FormFieldError id={errorId("password")} message={errors.password} />
        </div>
        <div className="flex justify-between items-center mt-1.5 mb-2">
          <Checkbox
            label="Keep me signed in"
            checked={values.rememberMe}
            onChange={(e) => setValue("rememberMe", e.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-(--ink) no-underline hover:underline hover:decoration-(--orange)"
          >
            Forgot password?
          </Link>
        </div>
      </Form>

      <div className="lg:hidden mt-1">
        <Divider label="or" />
        <SocialButton provider="google" />
      </div>

      <p className="mt-6 text-xs text-(--ink-3) text-center leading-relaxed">
        By continuing you agree to our{" "}
        <Link
          href="/terms"
          className="text-(--ink-2) underline decoration-(--hairline-strong) underline-offset-[0.1875rem]"
        >
          Terms
        </Link>
        .
      </p>
    </div>
  );
}
