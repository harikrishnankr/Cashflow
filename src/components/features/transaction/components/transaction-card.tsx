"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, MenuItem } from "@/components/ui";
import { EXPENSE_CATEGORY_LABELS, INCOME_SOURCE_LABELS } from "@/schema/transaction";
import type { TransactionListItem } from "@/schema/transaction";
import { TransactionTypeIcon } from "./transaction-type-icon";
import { TransactionAmount } from "./transaction-amount";
import { formatShortDate } from "../utils/format";

interface TransactionCardProps {
  item: TransactionListItem;
  onDelete?: (item: TransactionListItem) => void;
}

export function TransactionCard({ item, onDelete }: TransactionCardProps) {
  const isIncome = item.type === "income";
  const label = isIncome
    ? INCOME_SOURCE_LABELS[item.source]
    : EXPENSE_CATEGORY_LABELS[item.category];

  const typeParam = `?type=${item.type}`;
  const detailHref = `/dashboard/transactions/${item.id}${typeParam}`;
  const editHref = `/dashboard/transactions/${item.id}/edit${typeParam}`;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-(--hairline) last:border-b-0 hover:bg-(--card-hover) transition-colors group">
      <TransactionTypeIcon
        type={item.type}
        category={isIncome ? undefined : item.category}
        source={isIncome ? item.source : undefined}
        size="md"
      />

      {/* Clickable content */}
      <Link href={detailHref} className="flex-1 min-w-0 no-underline!">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-(--ink) truncate">{label}</div>
            {item.notes && (
              <div className="text-xs text-(--ink-3) truncate mt-0.5">{item.notes}</div>
            )}
          </div>

          {/* Mobile: amount + date stacked */}
          <div className="flex flex-col items-end shrink-0 lg:hidden">
            <TransactionAmount amount={item.amount} type={item.type} size="sm" />
            <span className="text-[11px] text-(--ink-3) font-mono mt-0.5">
              {formatShortDate(item.date)}
            </span>
          </div>
        </div>
      </Link>

      {/* Desktop-only columns */}
      <div className="hidden lg:flex items-center gap-6 shrink-0">
        <span className="text-xs font-mono text-(--ink-3) uppercase tracking-[0.06em] w-28 text-right hidden xl:block truncate">
          {label}
        </span>
        <span className="text-xs text-(--ink-3) font-mono w-20 text-right">
          {formatShortDate(item.date)}
        </span>
        <TransactionAmount
          amount={item.amount}
          type={item.type}
          size="sm"
          className="w-28 text-right block"
        />
      </div>

      {/* Actions menu */}
      <DropdownMenu
        aria-label="Transaction actions"
        align="end"
        triggerClassName={cn(
          "w-7 h-7 flex items-center justify-center rounded-(--r-sm) text-(--ink-3)",
          "hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer",
          "group-hover:opacity-100 focus:opacity-100",
        )}
        trigger={<MoreHorizontal size={15} />}
      >
        <MenuItem href={editHref} icon={<Pencil size={13} />}>
          Edit
        </MenuItem>
        <MenuItem
          variant="destructive"
          onClick={() => onDelete?.(item)}
          icon={<Trash2 size={13} />}
        >
          Delete
        </MenuItem>
      </DropdownMenu>
    </div>
  );
}
