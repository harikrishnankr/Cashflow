"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MENU_H = 120;

const MenuContext = createContext<{ close: () => void }>({ close: () => {} });

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  "aria-label"?: string;
  triggerClassName?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  "aria-label": ariaLabel,
  triggerClassName,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [, setSide] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({ position: "fixed" });

  function handleToggle() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      rectRef.current = rect;
      const nextSide = window.innerHeight - rect.bottom >= MENU_H ? "bottom" : "top";
      setSide(nextSide);
      setMenuStyle(getMenuStyle(rect, nextSide));
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouse);
    return () => document.removeEventListener("mousedown", onMouse);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const idx = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  function getMenuStyle(rect: DOMRect | null, side: "top" | "bottom"): CSSProperties {
    const style: CSSProperties = { position: "fixed" };
    if (!rect) return style;
    if (side === "bottom") {
      style.top = rect.bottom + 6;
    } else {
      style.bottom = window.innerHeight - rect.top + 6;
    }
    if (align === "end") {
      style.right = window.innerWidth - rect.right;
    } else {
      style.left = rect.left;
    }
    return style;
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={triggerClassName}
      >
        {trigger}
      </button>

      {open &&
        createPortal(
          <MenuContext.Provider value={{ close }}>
            <div
              ref={menuRef}
              role="menu"
              style={menuStyle}
              onKeyDown={onMenuKeyDown}
              className="z-50 bg-(--card) border border-(--hairline) rounded-(--r-md) shadow-(--shadow-md) min-w-36 py-1"
            >
              {children}
            </div>
          </MenuContext.Provider>,
          document.body,
        )}
    </div>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  icon?: ReactNode;
}

export function MenuItem({
  children,
  onClick,
  href,
  variant = "default",
  icon,
}: MenuItemProps) {
  const { close } = useContext(MenuContext);

  const cls = cn(
    "flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors no-underline cursor-pointer outline-none",
    "focus-visible:bg-(--paper-2)",
    variant === "destructive"
      ? "text-(--negative) hover:bg-(--negative-wash) focus-visible:bg-(--negative-wash)"
      : "text-(--ink-2) hover:bg-(--paper-2)",
  );

  if (href) {
    return (
      <Link href={href} role="menuitem" tabIndex={-1} onClick={close} className={cls}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={() => { onClick?.(); close(); }}
      className={cls}
    >
      {icon}
      {children}
    </button>
  );
}
