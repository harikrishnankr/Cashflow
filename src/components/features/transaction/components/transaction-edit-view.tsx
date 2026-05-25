"use client";

import { StateMessage } from "@/components/ui";
import { useExpense, useIncome } from "../hooks/use-transaction";
import { TransactionForm } from "./transaction-form";
import type { ExpenseDto, IncomeDto } from "@/schema/transaction";
import type { TransactionFormInitialValues } from "./transaction-form";

interface TransactionEditViewProps {
  id: number;
  type: "income" | "expense";
}

function expenseToInitial(tx: ExpenseDto): TransactionFormInitialValues {
  return {
    type: "expense",
    category: tx.category,
    amount: tx.amount,
    date: tx.date,
    notes: tx.notes,
  };
}

function incomeToInitial(tx: IncomeDto): TransactionFormInitialValues {
  return {
    type: "income",
    source: tx.source,
    amount: tx.amount,
    date: tx.date,
    notes: tx.notes,
  };
}

export function TransactionEditView({ id, type }: TransactionEditViewProps) {
  const expenseQuery = useExpense(type === "expense" ? id : 0);
  const incomeQuery = useIncome(type === "income" ? id : 0);

  const query = type === "expense" ? expenseQuery : incomeQuery;

  if (query.isLoading) return <StateMessage variant="loading" />;
  if (query.isError || !query.data) {
    return <StateMessage variant="error" message="Transaction not found." />;
  }

  const initialValues =
    type === "expense"
      ? expenseToInitial(query.data as ExpenseDto)
      : incomeToInitial(query.data as IncomeDto);

  return (
    <TransactionForm
      mode="edit"
      id={id}
      initialValues={initialValues}
    />
  );
}
