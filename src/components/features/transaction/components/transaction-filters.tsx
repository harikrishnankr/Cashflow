"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, Select, DatePicker } from "@/components/ui";
import {
  INCOME_SOURCE_LABELS,
  EXPENSE_CATEGORY_LABELS,
} from "@/schema/transaction/constants";
import type { SortValue, TransactionTypeFilter } from "@/schema/transaction";
import { useTransactionList } from "../context/transaction-list.provider";

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "date:desc", label: "Date: Newest first" },
  { value: "date:asc", label: "Date: Oldest first" },
  { value: "createdAt:desc", label: "Added: Latest first" },
  { value: "createdAt:asc", label: "Added: Oldest first" },
];

function activeFilterCount(
  dateFrom: string,
  dateTo: string,
  source: string,
  category: string,
  sort: SortValue,
) {
  let n = 0;
  if (dateFrom) n++;
  if (dateTo) n++;
  if (source) n++;
  if (category) n++;
  if (sort !== "date:desc") n++;
  return n;
}

export function TransactionFilters() {
  const { state, dispatch } = useTransactionList();
  const { search, typeFilter, dateFrom, dateTo, source, category, sort } =
    state;

  const extraCount = activeFilterCount(
    dateFrom,
    dateTo,
    source,
    category,
    sort,
  );
  const showSource = typeFilter === "all" || typeFilter === "income";
  const showCategory = typeFilter === "all" || typeFilter === "expense";

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: Search + date range */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          compact
          containerClassName="w-full sm:flex-1 sm:min-w-0 sm:w-auto"
          type="text"
          placeholder="Search by notes or amount…"
          value={search}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
          lead={<Search size={14} />}
          trail={
            search ? (
              <button
                onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
                className="text-(--ink-3) hover:text-(--ink) transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            ) : undefined
          }
        />
        <DatePicker
          value={dateFrom}
          onChange={(v) => dispatch({ type: "SET_DATE_FROM", payload: v })}
          max={dateTo || undefined}
          placeholder="From"
          className="flex-1 sm:flex-none sm:w-48"
        />
        <DatePicker
          value={dateTo}
          onChange={(v) => dispatch({ type: "SET_DATE_TO", payload: v })}
          min={dateFrom || undefined}
          placeholder="To"
          className="flex-1 sm:flex-none sm:w-48"
          align="end"
        />
      </div>

      {/* Row 2: Type pills + source / category / sort + clear */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => dispatch({ type: "SET_TYPE", payload: opt.value })}
            className={cn(
              "flex-none h-8 px-4 rounded-full text-sm font-medium border transition-colors cursor-pointer",
              typeFilter === opt.value
                ? "bg-(--ink) text-(--paper) border-(--ink)"
                : "bg-(--card) text-(--ink-2) border-(--hairline-strong) hover:bg-(--paper-2)",
            )}
          >
            {opt.label}
          </button>
        ))}

        <div className="h-5 w-px bg-(--hairline-strong) shrink-0 mx-0.5" />

        {showSource && (
          <Select
            compact
            containerClassName="shrink-0 w-36"
            aria-label="Source"
            value={source}
            onChange={(e) =>
              dispatch({ type: "SET_SOURCE", payload: e.target.value })
            }
          >
            <option value="">All sources</option>
            {Object.entries(INCOME_SOURCE_LABELS).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </Select>
        )}

        {showCategory && (
          <Select
            compact
            containerClassName="shrink-0 w-40"
            aria-label="Category"
            value={category}
            onChange={(e) =>
              dispatch({ type: "SET_CATEGORY", payload: e.target.value })
            }
          >
            <option value="">All categories</option>
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </Select>
        )}

        <Select
          compact
          containerClassName="shrink-0 w-44"
          aria-label="Sort by"
          value={sort}
          onChange={(e) =>
            dispatch({ type: "SET_SORT", payload: e.target.value as SortValue })
          }
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {extraCount > 0 && (
          <button
            onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
            className="flex-none flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium border border-(--hairline-strong) bg-(--card) text-(--ink-2) hover:bg-(--paper-2) transition-colors cursor-pointer whitespace-nowrap ml-auto"
          >
            <SlidersHorizontal size={12} />
            {extraCount} filter{extraCount !== 1 ? "s" : ""}
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
