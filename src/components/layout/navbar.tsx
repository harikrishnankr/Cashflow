"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

interface NavbarProps {
  user?: { name: string; email: string; avatarUrl?: string };
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="h-14 border-b border-(--hairline) bg-(--paper) flex items-center px-6 gap-4">
      <Link href="/dashboard" className="flex items-center no-underline">
        <Logo className="h-6 w-auto" />
      </Link>

      <nav className="flex items-center gap-1 ml-6 flex-1">
        <Link
          href="/dashboard"
          className="px-3 py-1.5 text-sm text-(--ink-2) rounded-(--r-sm) hover:bg-(--paper-2) hover:text-(--ink) no-underline transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/transactions"
          className="px-3 py-1.5 text-sm text-(--ink-2) rounded-(--r-sm) hover:bg-(--paper-2) hover:text-(--ink) no-underline transition-colors"
        >
          Transactions
        </Link>
      </nav>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-(--ink-2)">{user.name}</span>
          <button
            onClick={onLogout}
            className="text-sm text-(--ink-3) hover:text-(--ink) transition-colors cursor-pointer bg-none border-0 p-0"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
