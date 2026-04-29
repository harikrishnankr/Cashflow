import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard · CashFlow" };

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-[32px] font-normal tracking-[-0.02em] m-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-(--ink-3) mt-1">Here&apos;s your financial overview for April 2026.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Balance", value: "$4,208.52", change: "+$240 vs March", positive: true },
          { label: "Income", value: "$3,800.00", change: "+$0 vs March", positive: true },
          { label: "Expenses", value: "$1,591.48", change: "+$160 vs March", positive: false },
        ].map((card) => (
          <div key={card.label} className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-5">
            <p className="text-[11px] font-semibold tracking-(--ls-caps) uppercase text-(--ink-3) m-0 mb-2">
              {card.label}
            </p>
            <p
              className="text-[28px] font-normal tracking-[-0.02em] m-0"
              style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}
            >
              {card.value}
            </p>
            <p className={`text-xs mt-1 m-0 ${card.positive ? "text-(--positive)" : "text-(--negative)"}`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-(--card) border border-(--hairline) rounded-(--r-md) p-5">
        <h2 className="text-base font-semibold text-(--ink) m-0 mb-4">Recent transactions</h2>
        <p className="text-sm text-(--ink-3)">Connect your accounts to see transactions here.</p>
      </div>
    </div>
  );
}
