"use client";

import { createContext, useContext, useId, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  value: string;
  onValueChange: (v: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx)
    throw new Error("RadioItem / RadioCard must be used within RadioGroup");
  return ctx;
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

interface RadioGroupProps {
  value: string;
  onValueChange: (v: string) => void;
  name?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}

export function RadioGroup({
  value,
  onValueChange,
  name,
  label,
  className,
  children,
}: RadioGroupProps) {
  const generatedName = useId();

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange, name: name ?? generatedName }}
    >
      <div role="radiogroup" className={cn("flex flex-col gap-0.5", className)}>
        {label && (
          <div className="text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) mb-1.5">
            {label}
          </div>
        )}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// ─── RadioGroupItem — composable primitive, pairs with external label ─────────

interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function RadioGroupItem({
  value,
  id,
  disabled,
  className,
}: RadioGroupItemProps) {
  const { value: groupValue, onValueChange, name } = useRadioGroup();
  const isChecked = groupValue === value;

  return (
    <span
      className={cn("relative inline-flex shrink-0 w-4.5 h-4.5", className)}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={() => onValueChange(value)}
        className="sr-only peer"
      />
      <span
        className={cn(
          "w-full h-full rounded-full border-2 flex items-center justify-center transition-colors",
          isChecked ? "border-(--orange)" : "border-(--ink-4)",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-(--orange) peer-focus-visible:ring-offset-1",
          disabled && "opacity-50",
        )}
      >
        {isChecked && (
          <span className="w-2 h-2 rounded-full bg-(--orange) block" />
        )}
      </span>
    </span>
  );
}

// ─── RadioItem — simple radio + optional description ─────────────────────────

interface RadioItemProps {
  value: string;
  label: string;
  description?: string;
  className?: string;
}

export function RadioItem({
  value,
  label,
  description,
  className,
}: RadioItemProps) {
  const { value: groupValue, onValueChange, name } = useRadioGroup();
  const isChecked = groupValue === value;

  return (
    <label
      className={cn(
        "flex items-start gap-3 py-2.5 px-1 rounded-(--r-sm) cursor-pointer transition-colors",
        "hover:bg-(--paper-2)",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={() => onValueChange(value)}
        className="sr-only"
      />
      {/* Custom radio dot */}
      <div
        className={cn(
          "w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-px transition-colors",
          isChecked ? "border-(--orange)" : "border-(--ink-4)",
        )}
      >
        {isChecked && <div className="w-2 h-2 rounded-full bg-(--orange)" />}
      </div>
      <div className="min-w-0">
        <div
          className={cn(
            "text-sm leading-snug",
            isChecked ? "font-medium text-(--ink)" : "text-(--ink-2)",
          )}
        >
          {label}
        </div>
        {description && (
          <div className="text-[0.8125rem] text-(--ink-3) mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
      </div>
    </label>
  );
}

// ─── RadioCard — choice card (currency / plan style) ─────────────────────────

interface RadioCardProps {
  value: string;
  children: ReactNode;
  className?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
}

export function RadioCard({
  value,
  className,
  checkedClassName,
  uncheckedClassName,
  children,
}: RadioCardProps) {
  const { value: groupValue, onValueChange, name: groupName } = useRadioGroup();
  const isChecked = groupValue === value;

  return (
    <label
      className={cn(
        "relative cursor-pointer rounded-(--r-md) border p-4 flex flex-col gap-1",
        "transition-all select-none",
        isChecked
          ? cn("border-(--orange) bg-(--orange-wash)", checkedClassName)
          : cn(
              "border-(--hairline) bg-(--card) hover:border-(--hairline-strong) hover:bg-(--paper-2)",
              uncheckedClassName,
            ),
        className,
      )}
    >
      <input
        type="radio"
        name={groupName}
        value={value}
        checked={isChecked}
        onChange={() => onValueChange(value)}
        className="sr-only"
      />
      {children}
      {isChecked ? (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 rounded-full bg-(--orange) flex items-center justify-center">
          <Check size={9} strokeWidth={3} className="text-white" />
        </div>
      ) : (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 rounded-full border border-(--hairline-strong) flex items-center justify-center"></div>
      )}
    </label>
  );
}
