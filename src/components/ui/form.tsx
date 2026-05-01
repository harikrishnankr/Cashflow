"use client";

import { type FormHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: () => void | Promise<void>;
  error?: string;
  actions: ReactNode;
  children: ReactNode;
}

export function Form({ onSubmit, error, actions, children, className, ...props }: FormProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}
      noValidate
      className={cn("flex flex-col gap-3.5", className)}
      {...props}
    >
      {children}
      {error && (
        <p role="alert" className="text-sm text-(--negative) bg-(--negative-wash) border border-(--negative)/20 rounded-(--r-sm) px-3 py-2">
          {error}
        </p>
      )}
      {actions}
    </form>
  );
}
