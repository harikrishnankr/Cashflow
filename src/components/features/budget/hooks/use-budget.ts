"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { BudgetListResponse, BudgetDto } from "@/schema/budget";
import type { CreateBudgetInput, UpdateBudgetInput } from "@/schema/budget/budget.schema";

function toSearchParams(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function useBudgets(month: number, year: number) {
  return useQuery({
    queryKey: ["budgets", month, year],
    queryFn: () =>
      http<BudgetListResponse>(`/budget${toSearchParams({ month, year })}`),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBudgetInput) =>
      http<BudgetDto>("/budget", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateBudgetInput & { id: number }) =>
      http<BudgetDto>(`/budget/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => http(`/budget/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}
