interface Transaction {
  label: string;
  amount: string;
  positive?: boolean;
}

interface PreviewStatementProps {
  period: string;
  balance: string;
  balanceCents: string;
  change: string;
  transactions: Transaction[];
}

export function PreviewStatement({ period, balance, balanceCents, change, transactions }: PreviewStatementProps) {
  return (
    <div
      className="absolute right-6 top-11 w-[320px] bg-(--paper) text-(--ink) rounded-[10px] p-[18px_20px] font-sans"
      style={{
        boxShadow: "0 30px 60px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
        transform: "rotate(4deg)",
      }}
    >
      <span className="text-[10px] text-(--ink-3) tracking-[0.08em] uppercase font-semibold">
        {period}
      </span>
      <div
        className="font-display text-[36px] leading-none mt-2 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums" }}
      >
        <span className="text-(--ink-3) text-[22px]">$</span>
        {balance}
        <span className="text-(--ink-3)">.{balanceCents}</span>
      </div>
      <div className="flex gap-2 mt-2.5">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--positive-wash) text-(--positive) font-medium">
          {change}
        </span>
      </div>
      <hr className="my-3.5 border-0 h-px bg-(--hairline)" />
      {transactions.map((tx, i) => (
        <div key={i} className="flex justify-between gap-2.5 text-xs mb-1.5 text-(--ink-2)">
          <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
            {tx.label}
          </span>
          <span
            className="font-mono font-medium whitespace-nowrap flex-none"
            style={{ fontVariantNumeric: "tabular-nums", color: tx.positive ? "var(--ink)" : "var(--negative)" }}
          >
            {tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
