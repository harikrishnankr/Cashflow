"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type {
  CreateIncomeFormValues,
  UpdateIncomeFormValues,
  CreateExpenseFormValues,
  UpdateExpenseFormValues,
  CreateRecurringIncomeFormValues,
  UpdateRecurringIncomeFormValues,
  CreateRecurringExpenseFormValues,
  UpdateRecurringExpenseFormValues,
  TransactionListResponse,
  RecurringListResponse,
  IncomeDto,
  ExpenseDto,
  RecurringIncomeDto,
  RecurringExpenseDto,
} from "@/schema/transaction";

// ─── Query-param helper ────────────────────────────────────────────────────

function toSearchParams(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ─── Transactions ──────────────────────────────────────────────────────────

export type TransactionListParams = {
  type?: "income" | "expense";
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  category?: string;
  sortBy?: "date" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export function useTransactions(params: TransactionListParams = {}) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () =>
      http<TransactionListResponse>(`/transaction${toSearchParams(params)}`),
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateIncomeFormValues) =>
      http<IncomeDto>("/transaction/income", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateIncomeFormValues & { id: number }) =>
      http<IncomeDto>(`/transaction/income/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      http(`/transaction/income/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateExpenseFormValues) =>
      http<ExpenseDto>("/transaction/expense", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateExpenseFormValues & { id: number }) =>
      http<ExpenseDto>(`/transaction/expense/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      http(`/transaction/expense/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// ─── Recurring ─────────────────────────────────────────────────────────────

export type RecurringListParams = {
  type?: "income" | "expense";
  page?: number;
  pageSize?: number;
  source?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: "nextDueDate" | "startDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export function useRecurring(params: RecurringListParams = {}) {
  return useQuery({
    queryKey: ["recurring", params],
    queryFn: () =>
      http<RecurringListResponse>(`/recurring${toSearchParams(params)}`),
  });
}

export function useCreateRecurringIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRecurringIncomeFormValues) =>
      http<RecurringIncomeDto>("/recurring/income", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useUpdateRecurringIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateRecurringIncomeFormValues & { id: number }) =>
      http<RecurringIncomeDto>(`/recurring/income/${id}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useDeleteRecurringIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      http(`/recurring/income/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useCreateRecurringExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRecurringExpenseFormValues) =>
      http<RecurringExpenseDto>("/recurring/expense", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useUpdateRecurringExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateRecurringExpenseFormValues & { id: number }) =>
      http<RecurringExpenseDto>(`/recurring/expense/${id}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useDeleteRecurringExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      http(`/recurring/expense/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
}
