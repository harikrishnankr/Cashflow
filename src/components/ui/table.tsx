import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  className?: string;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, keyField, className, emptyMessage = "No data" }: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-(--hairline)">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn("px-4 py-3 text-left text-[0.6875rem] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3)", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-(--ink-3)">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[keyField])} className="border-b border-(--hairline) hover:bg-(--paper-2) transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-4 py-3 text-(--ink)", col.className)}>
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
