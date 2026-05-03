"use client";

import Link from "next/link";
import { Bell, Calendar, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-14 flex-none border-b border-(--hairline) bg-(--paper) hidden lg:flex items-center gap-3 px-5">
      <div className="flex items-center gap-2 flex-1 max-w-sm bg-(--paper-2) rounded-(--r-sm) px-3 h-8 border border-(--hairline)">
        <Search size={13} className="text-(--ink-3) flex-none" />
        <input
          placeholder="Search transactions, merchants…"
          className="bg-transparent text-sm text-(--ink) placeholder:text-(--ink-3) outline-none w-full"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <NotificationButton />
        <IconButton aria-label="Calendar">
          <Calendar size={15} />
        </IconButton>
        <Link href="/dashboard/transactions/new" className="no-underline ml-1">
          <Button size="sm" className="gap-1.5">
            <Plus size={14} />
            Add transaction
          </Button>
        </Link>
      </div>
    </header>
  );
}

function NotificationButton() {
  return (
    <button
      aria-label="Notifications"
      className="relative w-8 h-8 rounded-(--r-sm) flex items-center justify-center text-(--ink-2) hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer"
    >
      <Bell size={15} />
      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-(--orange) border border-(--paper)" />
    </button>
  );
}

function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="w-8 h-8 rounded-(--r-sm) flex items-center justify-center text-(--ink-2) hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}
