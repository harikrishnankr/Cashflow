"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { Form } from "@/components/ui/form";
import { FormFieldError } from "@/components/ui/form-field-error";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { RegisterCredentials } from "@/schema/auth";
import { registerFormSchema } from "@/schema/auth/register.schema";
import { useForm } from "@/hooks/use-form";
import { SocialButton } from "../common/social-button";
import { PasswordInput } from "./password-input/password-input";
import { TermsCheckbox } from "./terms-checkbox/terms-checkbox";

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, error, loading }: RegisterFormProps) {
  const [agreed, setAgreed] = useState(false);
  const { values, setValue, errors, handleSubmit, fieldProps, errorId } = useForm(
    registerFormSchema,
    { name: "", email: "", password: "" }
  );

  return (
    <div className="my-auto max-w-100 w-full self-center">
      <span className="text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-2.5 block">
        Create account
      </span>
      <h3
        className="font-normal text-[2.5rem] tracking-[-0.02em] m-0 mb-2 leading-[1.05]"
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

      <Form
        onSubmit={handleSubmit(async (data) => {
          if (!agreed) return;
          await onSubmit(data);
        })}
        error={error}
        actions={
          <Button type="submit" fullWidth disabled={loading || !agreed}>
            {loading ? "Creating account…" : "Create account"}
            {!loading && <ArrowRightIcon />}
          </Button>
        }
      >
        <div className="flex flex-col gap-1">
          <Input
            label="Full name"
            type="text"
            placeholder="Jamie Li"
            value={values.name}
            onChange={(e) => setValue("name", e.target.value)}
            autoComplete="name"
            required
            {...fieldProps("name")}
          />
          <FormFieldError id={errorId("name")} message={errors.name} />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            label="Work email"
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
          <PasswordInput
            value={values.password}
            onChange={(v) => setValue("password", v)}
            {...fieldProps("password")}
          />
          <FormFieldError id={errorId("password")} message={errors.password} />
        </div>
        <TermsCheckbox agreed={agreed} setAgreed={setAgreed} />
      </Form>

      <div className="lg:hidden mt-1">
        <Divider label="or" />
        <SocialButton provider="google" />
      </div>
    </div>
  );
}
