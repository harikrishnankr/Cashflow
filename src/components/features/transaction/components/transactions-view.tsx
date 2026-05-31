"use client";

import { useState } from "react";
import { Modal, Button, StateMessage } from "@/components/ui";
import type { TransactionListItem } from "@/schema/transaction";
import {
  useTransactions,
  useTransactionStats,
  useDeleteExpense,
  useDeleteIncome,
} from "../hooks/use-transaction";
import { TransactionList } from "./transaction-list";
import { TransactionFilters } from "./transaction-filters";
import { TransactionSummary } from "./transaction-summary";
import {
  TransactionListProvider,
  useTransactionList,
} from "../context/transaction-list.provider";
import { HeadingTitle } from "@/components/layout/heading-title";

export function TransactionsView() {
  return (
    <TransactionListProvider>
      <TransactionsContent />
    </TransactionListProvider>
  );
}

function TransactionsContent() {
  const { state, dispatch } = useTransactionList();
  const { search, typeFilter, dateFrom, dateTo, source, category, sort, page } =
    state;

  const [deleteTarget, setDeleteTarget] = useState<TransactionListItem | null>(
    null,
  );

  const [sortBy, sortOrder] = sort.split(":") as [
    "date" | "createdAt",
    "asc" | "desc",
  ];

  const filterParams = {
    type: typeFilter === "all" ? undefined : typeFilter,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    source: source || undefined,
    category: category || undefined,
    search: search || undefined,
  } as const;

  const { data, isLoading, isError } = useTransactions({
    ...filterParams,
    sortBy,
    sortOrder,
    page,
    pageSize: 20,
  });

  const { data: stats, isLoading: statsLoading } =
    useTransactionStats(filterParams);

  const deleteExpense = useDeleteExpense();
  const deleteIncome = useDeleteIncome();
  const isDeleting = deleteExpense.isPending || deleteIncome.isPending;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "expense") {
        await deleteExpense.mutateAsync(deleteTarget.id);
      } else {
        await deleteIncome.mutateAsync(deleteTarget.id);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <HeadingTitle>Transactions</HeadingTitle>
          {!isLoading && (
            <p className="text-sm text-(--ink-3)">
              {total} transaction{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Summary strip */}
      <TransactionSummary
        income={stats?.income ?? 0}
        spending={stats?.spending ?? 0}
        net={stats?.net ?? 0}
        count={stats?.count ?? 0}
        isLoading={statsLoading}
      />

      {/* Filters */}
      <div className="mb-4">
        <TransactionFilters />
      </div>

      {/* List states */}
      {isLoading && (
        <StateMessage variant="loading" message="Loading transactions…" card />
      )}
      {isError && (
        <StateMessage
          variant="error"
          message="Failed to load transactions."
          card
        />
      )}

      {!isLoading && !isError && (
        <TransactionList items={items} onDelete={setDeleteTarget} />
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-(--ink-3)">
          <span>
            Showing {items.length} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                dispatch({ type: "SET_PAGE", payload: Math.max(1, page - 1) })
              }
              disabled={page === 1}
              className="h-8 px-3 rounded-(--r-sm) border border-(--hairline-strong) text-sm disabled:opacity-40 hover:bg-(--paper-2) transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: "SET_PAGE",
                  payload: Math.min(totalPages, page + 1),
                })
              }
              disabled={page === totalPages}
              className="h-8 px-3 rounded-(--r-sm) border border-(--hairline-strong) text-sm disabled:opacity-40 hover:bg-(--paper-2) transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete transaction"
      >
        <p className="text-sm text-(--ink-2)">
          Are you sure you want to delete this transaction? This cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-(--negative) border-(--negative) hover:bg-(--negative)/90 text-white"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
