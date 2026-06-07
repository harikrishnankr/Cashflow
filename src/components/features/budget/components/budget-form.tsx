"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Select,
  Form,
  FormFieldError,
  DatePicker,
  Modal,
  CapsLabel,
} from "@/components/ui";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
} from "@/schema/transaction";
import type { ExpenseCategory } from "@/schema/transaction/constants";
import { BUDGET_PERIODS, type BudgetPeriodValue } from "@/schema/budget";
import type { BudgetListItem } from "@/schema/budget";
import { HttpError } from "@/lib/http";
import { useCreateBudget, useUpdateBudget } from "../hooks/use-budget";
import { todayStr, lastDayOfMonth, addDays } from "../constants";

// ── Create form ───────────────────────────────────────────────────────────────

interface CreateBudgetFormProps {
  open: boolean;
  onClose: () => void;
}

const PERIOD_LABELS: Record<BudgetPeriodValue, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

function calcPeriodEnd(start: string, period: BudgetPeriodValue): string {
  if (!start) return "";
  const [y, m] = start.split("-").map(Number);
  if (period === "WEEKLY") return addDays(start, 6);
  if (period === "MONTHLY") return lastDayOfMonth(y, m);
  return lastDayOfMonth(y + 1, 0); // Dec 31 of same year
}

export function CreateBudgetModal({ open, onClose }: CreateBudgetFormProps) {
  const today = todayStr();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("FOOD");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<BudgetPeriodValue>("MONTHLY");
  const [periodStart, setPeriodStart] = useState(today);
  const [periodEnd, setPeriodEnd] = useState(() => calcPeriodEnd(today, "MONTHLY"));
  const [alertThreshold, setAlertThreshold] = useState("80");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const createBudget = useCreateBudget();

  // Auto-update periodEnd when period or periodStart changes
  useEffect(() => {
    if (periodStart) setPeriodEnd(calcPeriodEnd(periodStart, period));
  }, [period, periodStart]);

  function reset() {
    setName("");
    setCategory("FOOD");
    setAmount("");
    setPeriod("MONTHLY");
    setPeriodStart(today);
    setPeriodEnd(calcPeriodEnd(today, "MONTHLY"));
    setAlertThreshold("80");
    setFieldErrors({});
    setServerError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) errs.amount = "Enter a valid positive amount.";
    if (!periodStart) errs.periodStart = "Start date is required.";
    if (!periodEnd) errs.periodEnd = "End date is required.";
    if (periodStart && periodEnd && periodEnd < periodStart) {
      errs.periodEnd = "End date must be on or after start date.";
    }
    if (periodStart && periodStart < today) {
      errs.periodStart = "Start date cannot be in the past.";
    }
    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 1 || threshold > 100) {
      errs.alertThreshold = "Enter a value between 1 and 100.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setServerError("");
    try {
      await createBudget.mutateAsync({
        name: name.trim(),
        category,
        amount: parseFloat(amount),
        period,
        periodStart,
        periodEnd,
        alertThreshold: parseFloat(alertThreshold) / 100,
      });
      handleClose();
    } catch (err) {
      if (err instanceof HttpError && err.fields) {
        setFieldErrors(err.fields);
      } else {
        setServerError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New budget" className="max-w-lg">
      <Form
        onSubmit={handleSubmit}
        error={serverError}
        actions={
          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={createBudget.isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={createBudget.isPending}>
              {createBudget.isPending ? "Creating…" : "Create budget"}
            </Button>
          </div>
        }
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <Input
            label="Budget name"
            placeholder="e.g. Groceries budget"
            value={name}
            maxLength={100}
            onChange={(e) => { setName(e.target.value); clearErr("name"); }}
            aria-invalid={!!fieldErrors.name || undefined}
            aria-describedby={fieldErrors.name ? "err-name" : undefined}
          />
          <FormFieldError id="err-name" message={fieldErrors.name} />
        </div>

        {/* Category */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</option>
          ))}
        </Select>

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <Input
            label="Budget limit"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); clearErr("amount"); }}
            lead={<span className="text-sm font-mono">$</span>}
            aria-invalid={!!fieldErrors.amount || undefined}
            aria-describedby={fieldErrors.amount ? "err-amount" : undefined}
          />
          <FormFieldError id="err-amount" message={fieldErrors.amount} />
        </div>

        {/* Period */}
        <div className="flex flex-col gap-1.75">
          <CapsLabel>Period</CapsLabel>
          <div className="flex gap-2">
            {BUDGET_PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "flex-1 h-10 rounded-(--r-sm) text-sm font-medium border transition-colors cursor-pointer",
                  period === p
                    ? "bg-(--ink) text-(--paper) border-(--ink)"
                    : "bg-(--card) text-(--ink-2) border-(--hairline-strong) hover:bg-(--paper-2)",
                )}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <DatePicker
              label="Start date"
              value={periodStart}
              onChange={(v) => { setPeriodStart(v); clearErr("periodStart"); }}
              min={today}
              size="md"
              aria-invalid={!!fieldErrors.periodStart || undefined}
              aria-describedby={fieldErrors.periodStart ? "err-start" : undefined}
            />
            <FormFieldError id="err-start" message={fieldErrors.periodStart} />
          </div>
          <div className="flex flex-col gap-1">
            <DatePicker
              label="End date"
              value={periodEnd}
              onChange={(v) => { setPeriodEnd(v); clearErr("periodEnd"); }}
              min={periodStart || today}
              size="md"
              aria-invalid={!!fieldErrors.periodEnd || undefined}
              aria-describedby={fieldErrors.periodEnd ? "err-end" : undefined}
            />
            <FormFieldError id="err-end" message={fieldErrors.periodEnd} />
          </div>
        </div>

        {/* Alert threshold */}
        <div className="flex flex-col gap-1">
          <Input
            label="Alert threshold"
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            step="1"
            placeholder="80"
            value={alertThreshold}
            onChange={(e) => { setAlertThreshold(e.target.value); clearErr("alertThreshold"); }}
            trail={<span className="text-sm font-mono text-(--ink-3)">%</span>}
            aria-invalid={!!fieldErrors.alertThreshold || undefined}
            aria-describedby={fieldErrors.alertThreshold ? "err-threshold" : undefined}
          />
          <FormFieldError id="err-threshold" message={fieldErrors.alertThreshold} />
        </div>
      </Form>
    </Modal>
  );

  function clearErr(key: string) {
    if (fieldErrors[key]) setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }
}

// ── Edit form ─────────────────────────────────────────────────────────────────

interface EditBudgetModalProps {
  budget: BudgetListItem | null;
  onClose: () => void;
}

export function EditBudgetModal({ budget, onClose }: EditBudgetModalProps) {
  const [name, setName] = useState(budget?.name ?? "");
  const [periodEnd, setPeriodEnd] = useState(budget?.periodEnd ?? "");
  const [alertThreshold, setAlertThreshold] = useState(
    budget ? String(Math.round(budget.alertThreshold * 100)) : "80",
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const updateBudget = useUpdateBudget();

  // Sync when budget changes (opening different budgets without remount)
  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setPeriodEnd(budget.periodEnd);
      setAlertThreshold(String(Math.round(budget.alertThreshold * 100)));
      setFieldErrors({});
      setServerError("");
    }
  }, [budget]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!periodEnd) errs.periodEnd = "End date is required.";
    if (budget && periodEnd && periodEnd < budget.periodStart) {
      errs.periodEnd = "End date must be on or after start date.";
    }
    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 1 || threshold > 100) {
      errs.alertThreshold = "Enter a value between 1 and 100.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!budget || !validate()) return;
    setServerError("");
    try {
      await updateBudget.mutateAsync({
        id: budget.id,
        name: name.trim(),
        periodEnd,
        alertThreshold: parseFloat(alertThreshold) / 100,
      });
      onClose();
    } catch (err) {
      if (err instanceof HttpError && err.fields) {
        setFieldErrors(err.fields);
      } else {
        setServerError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  }

  function clearErr(key: string) {
    if (fieldErrors[key]) setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  return (
    <Modal open={!!budget} onClose={onClose} title="Edit budget">
      <Form
        onSubmit={handleSubmit}
        error={serverError}
        actions={
          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={updateBudget.isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={updateBudget.isPending}>
              {updateBudget.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        }
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <Input
            label="Budget name"
            value={name}
            maxLength={100}
            onChange={(e) => { setName(e.target.value); clearErr("name"); }}
            aria-invalid={!!fieldErrors.name || undefined}
            aria-describedby={fieldErrors.name ? "err-edit-name" : undefined}
          />
          <FormFieldError id="err-edit-name" message={fieldErrors.name} />
        </div>

        {/* End date */}
        <div className="flex flex-col gap-1">
          <DatePicker
            label="End date"
            value={periodEnd}
            onChange={(v) => { setPeriodEnd(v); clearErr("periodEnd"); }}
            min={budget?.periodStart}
            size="md"
            aria-invalid={!!fieldErrors.periodEnd || undefined}
            aria-describedby={fieldErrors.periodEnd ? "err-edit-end" : undefined}
          />
          <FormFieldError id="err-edit-end" message={fieldErrors.periodEnd} />
        </div>

        {/* Alert threshold */}
        <div className="flex flex-col gap-1">
          <Input
            label="Alert threshold"
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            step="1"
            value={alertThreshold}
            onChange={(e) => { setAlertThreshold(e.target.value); clearErr("alertThreshold"); }}
            trail={<span className="text-sm font-mono text-(--ink-3)">%</span>}
            aria-invalid={!!fieldErrors.alertThreshold || undefined}
            aria-describedby={fieldErrors.alertThreshold ? "err-edit-threshold" : undefined}
          />
          <FormFieldError id="err-edit-threshold" message={fieldErrors.alertThreshold} />
        </div>
      </Form>
    </Modal>
  );
}
