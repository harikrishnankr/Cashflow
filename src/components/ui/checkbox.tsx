"use client";

import { InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./icons";
import classNames from "classnames";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, className, ...props }, ref) => (
    <label
      className={cn(
        "flex items-center gap-2 text-sm text-(--ink-2) cursor-pointer select-none",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        {...props}
      />
      <span
        className={cn(
          "w-4 h-4 border rounded flex items-center justify-center transition-colors flex-none",
          "peer-focus-visible:border-(--orange) peer-focus-visible:shadow-[0_0_0_3px_var(--orange-wash)]",
          checked
            ? "bg-(--ink) border-(--ink) text-(--paper)"
            : "bg-(--card) border-(--hairline-strong)",
        )}
        aria-hidden
      >
        {checked && <CheckIcon />}
      </span>
      {label}
    </label>
  ),
);

Checkbox.displayName = "Checkbox";

// ─── CheckboxCard — toggleable card, multi-select equivalent of RadioCard ─────

interface CheckboxCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
  children: ReactNode;
}

export function CheckboxCard({
  checked,
  onCheckedChange,
  id,
  className,
  checkedClassName,
  uncheckedClassName,
  children,
}: CheckboxCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative cursor-pointer rounded-(--r-md) border",
        "transition-all select-none focus-within:ring-2 focus-within:ring-(--orange) focus-within:ring-offset-1",
        checked
          ? cn("border-(--orange) bg-(--orange-wash)", checkedClassName)
          : cn(
              "border-(--hairline) bg-(--card) hover:border-(--hairline-strong) hover:bg-(--paper-2)",
              uncheckedClassName,
            ),
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      {children}
      <div
        className={classNames(
          "absolute top-2 right-2 w-4 h-4 rounded  flex items-center justify-center",
          {
            "border border-(--hairline-strong)": !checked,
            "bg-(--orange)": checked,
          },
        )}
      >
        {checked && <Check size={9} strokeWidth={3} className="text-white" />}
      </div>
    </label>
  );
}
