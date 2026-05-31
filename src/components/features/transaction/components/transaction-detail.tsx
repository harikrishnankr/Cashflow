"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Badge, CapsLabel, BackLink } from "@/components/ui";
import { EXPENSE_CATEGORY_LABELS, INCOME_SOURCE_LABELS } from "@/schema/transaction";
import type { ExpenseDto, IncomeDto } from "@/schema/transaction";
import { TransactionTypeIcon } from "./transaction-type-icon";
import { TransactionAmount } from "./transaction-amount";
import { useDeleteExpense, useDeleteIncome } from "../hooks/use-transaction";
import { HeadingTitle } from "@/components/layout/heading-title";

interface TransactionDetailProps {
  transaction: ExpenseDto | IncomeDto;
  type: "income" | "expense";
}

function formatFullDate(isoOrDate: string): string {
  return new Date(isoOrDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(isoOrDate: string): string {
  return new Date(isoOrDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TransactionDetail({ transaction, type }: TransactionDetailProps) {
  const router = useRouter();
  const deleteExpense = useDeleteExpense();
  const deleteIncome = useDeleteIncome();

  const isExpense = type === "expense";
  const label = isExpense
    ? EXPENSE_CATEGORY_LABELS[(transaction as ExpenseDto).category]
    : INCOME_SOURCE_LABELS[(transaction as IncomeDto).source];

  const editHref = `/dashboard/transactions/${transaction.id}/edit?type=${type}`;
  const isDeleting = deleteExpense.isPending || deleteIncome.isPending;

  async function handleDelete() {
    if (!confirm("Delete this transaction? This cannot be undone.")) return;
    try {
      if (isExpense) {
        await deleteExpense.mutateAsync(transaction.id);
      } else {
        await deleteIncome.mutateAsync(transaction.id);
      }
      router.push("/dashboard/transactions");
      router.refresh();
    } catch {
      // error is shown via mutation state if needed
    }
  }

  return (
    <div className="max-w-xl">
      <BackLink href="/dashboard/transactions" className="mb-6">Transactions</BackLink>

      {/* Page heading */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <HeadingTitle>Transaction detail</HeadingTitle>
          <p className="text-xs text-(--ink-3) font-mono uppercase tracking-(--ls-caps)">
            {type}-{transaction.id}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push(editHref)} className="shrink-0 mt-1">
          <Pencil size={13} />
          Edit
        </Button>
      </div>

      {/* Hero card */}
      <div className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-6 mb-4">
        {/* Merchant / category row */}
        <div className="flex items-center gap-4 mb-5">
          <TransactionTypeIcon
            type={type}
            category={isExpense ? (transaction as ExpenseDto).category : undefined}
            source={!isExpense ? (transaction as IncomeDto).source : undefined}
            size="lg"
          />
          <div>
            <div className="text-base font-semibold text-(--ink)">{label}</div>
            <div className="text-xs text-(--ink-3) mt-0.5">
              {formatFullDate(transaction.date)}
            </div>
          </div>
        </div>

        {/* Big amount */}
        <TransactionAmount
          amount={transaction.amount}
          type={type}
          size="lg"
          className="block mb-3"
        />

        <Badge variant={type === "income" ? "positive" : "default"} className="mb-5">
          {type === "income" ? "Income" : "Expense"}
        </Badge>

        {/* Details */}
        <div className="border-t border-(--hairline) pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <DetailRow
            label={isExpense ? "Category" : "Source"}
            value={label}
          />
          <DetailRow
            label="Date"
            value={formatShortDate(transaction.date)}
          />
          {transaction.notes && (
            <div className="col-span-2">
              <CapsLabel className="mb-1 block">Note</CapsLabel>
              <p className="text-sm text-(--ink-2) leading-relaxed m-0">
                {transaction.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete zone */}
      <div className="bg-(--negative-wash) border border-(--negative)/20 rounded-(--r-md) px-4 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-(--ink)">Delete this transaction</div>
          <div className="text-xs text-(--ink-3) mt-0.5">This action cannot be undone.</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 text-(--negative) border-(--negative)/30 hover:bg-(--negative-wash)"
        >
          <Trash2 size={13} />
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <CapsLabel className="mb-0.5 block">{label}</CapsLabel>
      <div className="text-sm text-(--ink)">{value}</div>
    </div>
  );
}
