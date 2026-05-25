"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CapsLabel } from "./caps-label";

type PopoverSide = "top" | "bottom";
type PopoverAlign = "start" | "end";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  min?: string; // "YYYY-MM-DD"
  max?: string; // "YYYY-MM-DD"
  disabled?: boolean;
  size?: "sm" | "md";
  /** Horizontal alignment of the popover relative to the trigger. Default: "start". */
  align?: PopoverAlign;
  /** Which side the popover opens toward. Default: "auto" (detects viewport space). */
  side?: PopoverSide | "auto";
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
}

function parseDateStr(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? undefined : date;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toDisplayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CALENDAR_H = 320;

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  min,
  max,
  disabled,
  size = "sm",
  align = "start",
  side = "auto",
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<PopoverSide>("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = parseDateStr(value);
  const minDate = min ? parseDateStr(min) : undefined;
  const maxDate = max ? parseDateStr(max) : undefined;
  const isInvalid = ariaInvalid === true || ariaInvalid === "true";
  const h = size === "md" ? "h-12" : "h-9";

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);


  function handleOpen() {
    if (disabled) return;
    if (!open) {
      const resolved =
        side !== "auto"
          ? side
          : (() => {
              const rect = triggerRef.current?.getBoundingClientRect();
              if (!rect) return "bottom" as PopoverSide;
              const spaceBelow = window.innerHeight - rect.bottom;
              const spaceAbove = rect.top;
              return spaceBelow >= CALENDAR_H || spaceBelow >= spaceAbove ? "bottom" : "top";
            })();
      setResolvedSide(resolved);
    }
    setOpen((o) => !o);
  }

  function handleSelect(day: Date | undefined) {
    onChange(day ? toDateStr(day) : "");
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleClear(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    if ("key" in e && e.key !== "Enter" && e.key !== " ") return;
    onChange("");
    triggerRef.current?.focus();
  }

  return (
    <div className={cn("flex flex-col gap-1", className)} ref={containerRef}>
      {label && <CapsLabel>{label}</CapsLabel>}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 font-sans",
            "bg-(--card) border rounded-(--r-sm) text-sm text-left outline-none",
            "transition-[border-color,box-shadow] cursor-pointer",
            "focus-visible:border-(--orange) focus-visible:shadow-[0_0_0_3px_var(--orange-wash)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            h,
            open
              ? "border-(--orange) shadow-[0_0_0_3px_var(--orange-wash)]"
              : isInvalid
              ? "border-(--negative)"
              : "border-(--hairline-strong)",
            selected ? "text-(--ink)" : "text-(--ink-4)",
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Calendar size={14} className="text-(--ink-3) shrink-0" />
            <span className="truncate">{selected ? toDisplayLabel(selected) : placeholder}</span>
          </span>
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={handleClear}
              className="shrink-0 text-(--ink-3) hover:text-(--ink) transition-colors p-0.5 rounded cursor-pointer"
              aria-label="Clear date"
            >
              <X size={12} />
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label ? `${label} calendar` : "Pick a date"}
            className={cn(
              "absolute z-50",
              resolvedSide === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
              align === "end" ? "right-0" : "left-0",
              "bg-(--paper) border border-(--hairline-strong) rounded-(--r-md)",
              "shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3",
              "min-w-68",
            )}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              defaultMonth={selected ?? new Date()}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              classNames={{
                root: "font-sans select-none",
                months: "flex flex-col",
                month: "space-y-2",
                month_caption: "flex items-center justify-between px-1 mb-1",
                caption_label: "text-sm font-semibold text-(--ink)",
                nav: "flex items-center gap-0.5",
                button_previous: cn(
                  "h-7 w-7 flex items-center justify-center rounded-(--r-sm)",
                  "text-(--ink-3) hover:bg-(--paper-2) hover:text-(--ink)",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-(--orange) disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
                ),
                button_next: cn(
                  "h-7 w-7 flex items-center justify-center rounded-(--r-sm)",
                  "text-(--ink-3) hover:bg-(--paper-2) hover:text-(--ink)",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-(--orange) disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
                ),
                month_grid: "w-full border-collapse",
                weekdays: "",
                weekday:
                  "text-[0.6875rem] font-semibold text-(--ink-4) text-center w-9 h-8 pb-1",
                week: "",
                day: "text-center p-0 relative",
                day_button: cn(
                  "h-9 w-9 text-sm rounded-(--r-sm) flex items-center justify-center mx-auto",
                  "transition-colors cursor-pointer",
                  "hover:bg-(--orange-wash) hover:text-(--orange)",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--orange) focus-visible:ring-offset-1",
                  "disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed",
                ),
                selected:
                  "bg-(--orange)! text-white! rounded-(--r-sm)! font-semibold",
                today: "font-semibold text-(--orange)",
                outside: "text-(--ink-4) opacity-40",
                disabled: "opacity-30 pointer-events-none",
                hidden: "invisible",
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === "left" ? (
                    <ChevronLeft size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
