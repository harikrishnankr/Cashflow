import { ReactNode } from "react";

export function HeadingTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      className="text-[2rem] font-normal tracking-[-0.02em] m-0"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </h1>
  );
}
