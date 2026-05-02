import { cn } from "@/lib/utils";
import { MAX_BAR_PX, SPARK_HEIGHTS, TRANSACTIONS } from "../constants";

export function WelcomePreviewCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-(--r-lg) bg-(--card) border border-(--hairline) shadow-(--shadow-md) p-5 select-none",
        className,
      )}
    >
      <div
        className="text-[0.6875rem] uppercase tracking-widest text-(--ink-3) mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        April · month so far
      </div>

      <div
        className="font-medium tracking-tight leading-none mb-1.5 text-[2.25rem]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="text-[0.6em] text-(--ink-3)">$</span>4,208
        <span className="text-(--ink-3)">.52</span>
      </div>

      <div
        className="text-[0.6875rem] mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--positive)" }}
      >
        + $240 vs March
      </div>

      <div
        className="flex items-end gap-0.75 mb-5"
        style={{ height: `${MAX_BAR_PX}px` }}
      >
        {SPARK_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-xs ${h >= 0.95 ? "bg-(--orange)" : "bg-(--paper-3)"}`}
            style={{ height: `${Math.round(h * MAX_BAR_PX)}px` }}
          />
        ))}
      </div>

      <div className="hidden md:flex flex-col gap-2.5">
        {TRANSACTIONS.map(({ Icon, label, amount }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-(--r-sm) bg-(--paper-2) flex items-center justify-center text-(--ink-3) shrink-0">
              <Icon size={13} />
            </div>
            <span className="text-sm text-(--ink-2) flex-1 font-medium">
              {label}
            </span>
            <span
              className="text-xs text-(--ink-3)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
