"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) el.showModal();
    else el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "bg-(--paper) rounded-(--r-lg) p-6 shadow-(--shadow-lg) w-full max-w-lg",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "open:flex open:flex-col open:gap-4",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--ink) m-0">{title}</h2>
          <button
            onClick={onClose}
            className="text-(--ink-3) hover:text-(--ink) transition-colors p-1 rounded-(--r-sm)"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      {children}
    </dialog>
  );
}
