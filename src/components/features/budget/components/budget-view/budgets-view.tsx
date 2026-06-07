"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button, Modal, StateMessage } from "@/components/ui";
import type { BudgetListItem } from "@/schema/budget";
import { MONTHS } from "../../constants";
import { useBudgets, useDeleteBudget } from "../../hooks/use-budget";
import { BudgetSummaryStrip } from "../budget-summary";
import { BudgetCard, AddBudgetCard } from "../budget-card";
import { CreateBudgetModal, EditBudgetModal } from "../budget-form";
import { BudgetsViewHeader } from "./budgets-view-header";
import { BudgetFilter } from "./budget-filter";

export function BudgetsView() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BudgetListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetListItem | null>(null);

  const { data, isLoading, isError } = useBudgets(month, year);
  const deleteBudget = useDeleteBudget();

  const items = data?.items ?? [];
  const summary = data?.summary ?? {
    totalBudget: 0,
    totalSpending: 0,
    onTrack: 0,
    nearLimit: 0,
    overBudget: 0,
  };

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBudget.mutateAsync(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <BudgetsViewHeader
          totalItems={items.length}
          year={year}
          month={month}
          isLoading={isLoading}
        />
        <BudgetFilter
          month={month}
          year={year}
          onPrev={prevMonth}
          onNext={nextMonth}
          onCreate={() => setCreateOpen(true)}
        />
      </div>

      {/* Summary strip */}
      <BudgetSummaryStrip
        summary={summary}
        items={items}
        month={month}
        year={year}
        isLoading={isLoading}
      />

      {/* States */}
      {isLoading && (
        <StateMessage variant="loading" message="Loading budgets…" card />
      )}
      {isError && (
        <StateMessage variant="error" message="Failed to load budgets." card />
      )}

      {/* Budget grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              month={month}
              year={year}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
          <AddBudgetCard onClick={() => setCreateOpen(true)} />
        </div>
      )}

      {/* Create modal */}
      <CreateBudgetModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Edit modal */}
      <EditBudgetModal
        budget={editTarget}
        onClose={() => setEditTarget(null)}
      />

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete budget"
      >
        <p className="text-sm text-(--ink-2)">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-(--ink)">
            {deleteTarget?.name}
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(null)}
            disabled={deleteBudget.isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={confirmDelete}
            disabled={deleteBudget.isPending}
            className="bg-(--negative) border-(--negative) hover:bg-(--negative)/90 text-white"
          >
            {deleteBudget.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
