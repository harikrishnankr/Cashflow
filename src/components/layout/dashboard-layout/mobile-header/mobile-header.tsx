"use client";

import Link from "next/link";
import { LogoMark } from "../../../ui";
import { NotificationButton } from "./notification-button";
import { Avatar } from "../avatar/avatar";

export function MobileHeader({ initials }: { initials?: string }) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-(--paper) border-b border-(--hairline) flex-none lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2 no-underline">
        <LogoMark className="h-6.5 w-6.5" />
      </Link>

      <div className="flex items-center gap-1.5">
        <NotificationButton />
        <Avatar isMobile initials={initials ?? "CF"} />
      </div>
    </header>
  );
}
