"use client";

import { usePathname } from "next/navigation";
import { MobileTabs } from "../constants";
import { NavTab } from "./nav-tab";
import { FabTab } from "./fab-tab";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-(--paper) border-t border-(--hairline) flex lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14 w-full">
        {MobileTabs.map((tab) =>
          tab.fab ? (
            <FabTab key={tab.href} tab={tab} />
          ) : (
            <NavTab key={tab.href} tab={tab} pathname={pathname} />
          ),
        )}
      </div>
    </nav>
  );
}
