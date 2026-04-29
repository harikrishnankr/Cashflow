import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · CashFlow",
    default: "CashFlow",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
