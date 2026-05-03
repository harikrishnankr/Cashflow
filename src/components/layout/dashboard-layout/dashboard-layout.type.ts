import { ElementType, ReactNode } from "react";

type BaseTab = {
  label: string;
  href: string;
};

export type MobileTab = BaseTab & {
  icon: ElementType;
  fab?: boolean;
  exactMatch?: boolean;
};

type DesktopNavType = "overview" | "manage";

export type DesktopNavItem = BaseTab & {
  icon: ReactNode;
  type: DesktopNavType;
};

export type SidebarUser = {
  name: string;
  email: string;
  initials?: string;
};

export type SidebarProps = {
  user?: SidebarUser;
};

export type AvatarProps =
  | {
      isMobile: false;
      initials: string;
      name: string;
      email: string;
    }
  | {
      isMobile: true;
      initials: string;
    };
