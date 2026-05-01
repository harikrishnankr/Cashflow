interface PreviewStatementProps {
  period: string;
  balance: string;
  balanceCents: string;
  change: string;
}

const PREVIEW_TRANSACTIONS = [
  { label: "Salary · Quanta", amount: "+ $3,800.00", positive: true },
  { label: "Blue Bottle Coffee", amount: "- $4.50" },
  { label: "Whole Foods", amount: "- $68.12" },
  { label: "Con Edison", amount: "- $94.00" },
];

export function PreviewStatement({
  period,
  balance,
  balanceCents,
  change,
}: PreviewStatementProps) {
  return (
    <div
      className="absolute right-6 top-11 w-80 bg-(--paper) text-(--ink) rounded-[0.625rem] py-4.5 px-5 font-sans"
      style={{
        boxShadow: "0 1.875rem 3.75rem rgba(0,0,0,0.35), 0 0.25rem 0.75rem rgba(0,0,0,0.2)",
        transform: "rotate(4deg)",
      }}
    >
      <span className="text-[0.625rem] text-(--ink-3) tracking-[0.08em] uppercase font-semibold">
        {period}
      </span>
      <div
        className="font-display text-4xl leading-none mt-2 tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-display)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span className="text-(--ink-3) text-[1.375rem]">$</span>
        {balance}
        <span className="text-(--ink-3)">.{balanceCents}</span>
      </div>
      <div className="flex gap-2 mt-2.5">
        <span className="text-[0.625rem] px-2 py-0.5 rounded-full bg-(--positive-wash) text-(--positive) font-medium">
          {change}
        </span>
      </div>
      <hr className="my-3.5 border-0 h-px bg-(--hairline)" />
      {PREVIEW_TRANSACTIONS.map((tx, i) => (
        <div
          key={i}
          className="flex justify-between gap-2.5 text-xs mb-1.5 text-(--ink-2)"
        >
          <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
            {tx.label}
          </span>
          <span
            className="font-mono font-medium whitespace-nowrap flex-none"
            style={{
              fontVariantNumeric: "tabular-nums",
              color: tx.positive ? "var(--ink)" : "var(--negative)",
            }}
          >
            {tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
