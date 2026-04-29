export default function OfflinePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        gap: "16px",
        padding: "24px",
        fontFamily: "var(--font-sans)",
        background: "var(--paper)",
        color: "var(--ink)",
        textAlign: "center",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.4 }}
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <h1 style={{ fontSize: "var(--t-h2)", fontWeight: 600, margin: 0 }}>
        You&rsquo;re offline
      </h1>
      <p style={{ fontSize: "var(--t-body)", color: "var(--ink-3)", margin: 0, maxWidth: "280px" }}>
        Check your connection and try again. Pages you&rsquo;ve visited recently are still available.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "8px",
          padding: "10px 24px",
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
