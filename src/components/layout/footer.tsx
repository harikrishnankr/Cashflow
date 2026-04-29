import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-(--hairline) py-4 px-6 flex items-center justify-between text-xs text-(--ink-3)">
      <span>© {new Date().getFullYear()} CashFlow. All rights reserved.</span>
      <nav className="flex items-center gap-4">
        <Link href="/privacy" className="hover:text-(--ink) transition-colors no-underline">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-(--ink) transition-colors no-underline">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
