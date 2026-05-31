"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Select,
  Form,
  FormFieldError,
  DateTimePicker,
  BackLink,
} from "@/components/ui";
import {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  EXPENSE_CATEGORY_LABELS,
  INCOME_SOURCE_LABELS,
} from "@/schema/transaction";
import type { ExpenseCategory, IncomeSourceValue } from "@/schema/transaction";
import {
  useCreateExpense,
  useUpdateExpense,
  useCreateIncome,
  useUpdateIncome,
} from "../hooks/use-transaction";
import { toDatetimeLocal, fromDatetimeLocal } from "../utils/format";
import { HeadingTitle } from "@/components/layout/heading-title";

type TransactionType = "income" | "expense";

export interface TransactionFormInitialValues {
  type: TransactionType;
  category?: ExpenseCategory;
  source?: IncomeSourceValue;
  amount: number;
  date: string;
  notes?: string | null;
}

interface TransactionFormProps {
  mode: "add" | "edit";
  id?: number;
  initialValues?: TransactionFormInitialValues;
}

function nowDatetimeLocal(): string {
  return toDatetimeLocal(new Date().toISOString());
}

export function TransactionForm({
  mode,
  id,
  initialValues,
}: TransactionFormProps) {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? "expense",
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    initialValues?.category ?? "FOOD",
  );
  const [source, setSource] = useState<IncomeSourceValue>(
    initialValues?.source ?? "SALARY",
  );
  const [amount, setAmount] = useState(
    initialValues?.amount ? String(initialValues.amount) : "",
  );
  const [datetime, setDatetime] = useState(
    initialValues?.date
      ? toDatetimeLocal(initialValues.date)
      : nowDatetimeLocal(),
  );
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const isPending =
    createExpense.isPending ||
    updateExpense.isPending ||
    createIncome.isPending ||
    updateIncome.isPending;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      errs.amount = "Enter a valid positive amount.";
    }
    if (!datetime) {
      errs.datetime = "Date and time are required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setServerError("");

    const isoDate = fromDatetimeLocal(datetime);
    const amountNum = parseFloat(amount);
    const notesVal = notes.trim() || undefined;

    try {
      if (type === "expense") {
        if (mode === "add") {
          await createExpense.mutateAsync({
            category,
            amount: amountNum,
            date: isoDate,
            notes: notesVal,
          });
        } else {
          await updateExpense.mutateAsync({
            id: id!,
            category,
            amount: amountNum,
            date: isoDate,
            notes: notesVal,
          });
        }
      } else {
        if (mode === "add") {
          await createIncome.mutateAsync({
            source,
            amount: amountNum,
            date: isoDate,
            notes: notesVal,
          });
        } else {
          await updateIncome.mutateAsync({
            id: id!,
            source,
            amount: amountNum,
            date: isoDate,
            notes: notesVal,
          });
        }
      }
      router.push("/dashboard/transactions");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <div className="max-w-lg">
      <BackLink onClick={() => router.push("/dashboard/transactions")} className="mb-6" />

      <div className="mb-6">
        <HeadingTitle>
          {mode === "add" ? "Add transaction" : "Edit transaction"}
        </HeadingTitle>
        <p className="text-sm text-(--ink-3)">
          {mode === "add"
            ? "Record a new income or expense."
            : "Update the transaction details."}
        </p>
      </div>

      <div className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-5">
        <Form
          onSubmit={handleSubmit}
          error={serverError}
          actions={
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending
                  ? "Saving…"
                  : mode === "add"
                    ? "Add transaction"
                    : "Save changes"}
              </Button>
            </div>
          }
        >
          {/* Type toggle — only in add mode */}
          {mode === "add" && (
            <div className="flex flex-col gap-1.75">
              <span className="text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3)">
                Type
              </span>
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 h-10 rounded-(--r-sm) text-sm font-medium border transition-colors cursor-pointer",
                      type === t
                        ? "bg-(--ink) text-(--paper) border-(--ink)"
                        : "bg-(--card) text-(--ink-2) border-(--hairline-strong) hover:bg-(--paper-2)",
                    )}
                  >
                    {t === "expense" ? "Expense" : "Income"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category or Source */}
          {type === "expense" ? (
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {EXPENSE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          ) : (
            <Select
              label="Source"
              value={source}
              onChange={(e) => setSource(e.target.value as IncomeSourceValue)}
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {INCOME_SOURCE_LABELS[s]}
                </option>
              ))}
            </Select>
          )}

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <Input
              label="Amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (fieldErrors.amount) {
                  setFieldErrors((prev) => {
                    const n = { ...prev };
                    delete n.amount;
                    return n;
                  });
                }
              }}
              lead={<span className="text-sm font-mono">$</span>}
              aria-invalid={!!fieldErrors.amount || undefined}
              aria-describedby={fieldErrors.amount ? "error-amount" : undefined}
            />
            <FormFieldError id="error-amount" message={fieldErrors.amount} />
          </div>

          {/* Date & time */}
          <div className="flex flex-col gap-1">
            <DateTimePicker
              label="Date & time"
              value={datetime}
              onChange={(v) => {
                setDatetime(v);
                if (fieldErrors.datetime) {
                  setFieldErrors((prev) => {
                    const n = { ...prev };
                    delete n.datetime;
                    return n;
                  });
                }
              }}
              aria-invalid={!!fieldErrors.datetime || undefined}
              aria-describedby={
                fieldErrors.datetime ? "error-datetime" : undefined
              }
            />
            <FormFieldError
              id="error-datetime"
              message={fieldErrors.datetime}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.75">
            <label className="text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3)">
              Notes{" "}
              <span className="text-(--ink-4) normal-case font-normal tracking-normal">
                optional
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note…"
              maxLength={500}
              rows={3}
              className={cn(
                "w-full bg-(--card) border border-(--hairline-strong) rounded-(--r-sm) px-4 py-3",
                "text-sm text-(--ink) placeholder:text-(--ink-4) outline-none resize-none",
                "focus:border-(--orange) focus:shadow-[0_0_0_3px_var(--orange-wash)]",
                "transition-[border-color,box-shadow]",
              )}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
