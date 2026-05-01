import { WifiOffIcon } from "@/components/ui/icons";

export default function OfflinePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        gap: "1rem",
        padding: "1.5rem",
        fontFamily: "var(--font-sans)",
        background: "var(--paper)",
        color: "var(--ink)",
        textAlign: "center",
      }}
    >
      <WifiOffIcon />
      <h1 style={{ fontSize: "var(--t-h2)", fontWeight: 600, margin: 0 }}>
        You&rsquo;re offline
      </h1>
      <p style={{ fontSize: "var(--t-body)", color: "var(--ink-3)", margin: 0, maxWidth: "17.5rem" }}>
        Check your connection and try again. Pages you&rsquo;ve visited recently are still available.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "1rem",
          padding: "0.625rem 1.5rem",
          background: "var(--ink)",
          color: "var(--paper)",
          border: "none",
          borderRadius: "var(--r-md)",
          fontSize: "var(--t-body)",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
