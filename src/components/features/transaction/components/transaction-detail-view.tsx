"use client";

import { StateMessage } from "@/components/ui";
import { useExpense, useIncome } from "../hooks/use-transaction";
import { TransactionDetail } from "./transaction-detail";

interface TransactionDetailViewProps {
  id: number;
  type: "income" | "expense";
}

export function TransactionDetailView({ id, type }: TransactionDetailViewProps) {
  const expenseQuery = useExpense(type === "expense" ? id : 0);
  const incomeQuery = useIncome(type === "income" ? id : 0);

  const query = type === "expense" ? expenseQuery : incomeQuery;

  if (query.isLoading) return <StateMessage variant="loading" />;
  if (query.isError || !query.data) {
    return <StateMessage variant="error" message="Transaction not found." />;
  }

  return <TransactionDetail transaction={query.data} type={type} />;
}
