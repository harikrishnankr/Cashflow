import { cn } from "@/lib/utils";

type StateVariant = "loading" | "error" | "empty";

interface StateMessageProps {
  variant?: StateVariant;
  message?: string;
  /** Wrap in a bordered card (matches the list/card container style). */
  card?: boolean;
  className?: string;
}

const defaults: Record<StateVariant, string> = {
  loading: "Loading…",
  error: "Something went wrong.",
  empty: "Nothing here yet.",
};

export function StateMessage({
  variant = "loading",
  message,
  card = false,
  className,
}: StateMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-16",
        card && "bg-(--card) border border-(--hairline) rounded-(--r-md)",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm font-mono",
          variant === "error" ? "text-(--negative)" : "text-(--ink-3)",
        )}
      >
        {message ?? defaults[variant]}
      </p>
    </div>
  );
}
