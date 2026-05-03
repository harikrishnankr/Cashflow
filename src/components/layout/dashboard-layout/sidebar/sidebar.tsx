"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { DesktopTabs } from "../constants";
import { SidebarProps } from "../dashboard-layout.type";
import { NavSection } from "./nav-section";
import { Avatar } from "../avatar/avatar";

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const initials = user?.initials ?? user?.name.slice(0, 2).toUpperCase();

  return (
    <aside className="w-55 flex-none border-r border-(--hairline) bg-(--paper) hidden lg:flex flex-col py-4">
      <div className="px-4 mb-6">
        <Logo className="h-7 w-auto" dark />
      </div>

      <nav className="flex flex-col flex-1 px-2 overflow-y-auto">
        <NavSection
          label="Overview"
          items={DesktopTabs.filter((item) => item.type === "overview")}
          pathname={pathname}
        />
        <NavSection
          label="Manage"
          items={DesktopTabs.filter((item) => item.type === "manage")}
          pathname={pathname}
        />
      </nav>

      {user && (
        <div className="mx-2 pt-3 border-t border-(--hairline) flex items-center gap-2.5 px-1">
          <Avatar
            initials={initials || ""}
            isMobile={false}
            name={user.name}
            email={user.email}
          />
        </div>
      )}
    </aside>
  );
}
