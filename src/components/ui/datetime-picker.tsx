"use client";

import { cn } from "@/lib/utils";
import { DatePicker } from "./date-picker";
import { CapsLabel } from "./caps-label";

interface DateTimePickerProps {
  value: string; // "YYYY-MM-DDTHH:mm" or ""
  onChange: (v: string) => void;
  label?: string;
  required?: boolean;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
}

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nowTimeStr(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  required,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: DateTimePickerProps) {
  const [datePart = "", timePart = ""] = value ? value.split("T") : [];
  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  function handleDateChange(newDate: string) {
    const time = timePart || nowTimeStr();
    onChange(newDate ? `${newDate}T${time}` : "");
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const time = e.target.value;
    const date = datePart || todayDateStr();
    onChange(`${date}T${time}`);
  }

  return (
    <div className="flex flex-col gap-1.75">
      {label && (
        <CapsLabel>
          {label}
          {required && <span className="text-(--negative) ml-0.5">*</span>}
        </CapsLabel>
      )}
      <div className="flex gap-2">
        <DatePicker
          value={datePart}
          onChange={handleDateChange}
          placeholder="Pick a date"
          size="md"
          aria-invalid={ariaInvalid}
          className="flex-1 gap-0"
        />
        <input
          type="time"
          value={timePart}
          onChange={handleTimeChange}
          required={required}
          aria-label="Time"
          aria-describedby={ariaDescribedby}
          className={cn(
            "h-12 w-28 shrink-0 font-sans text-sm bg-(--card) border rounded-(--r-sm)",
            "px-3 text-(--ink) outline-none",
            "focus:border-(--orange) focus:shadow-[0_0_0_3px_var(--orange-wash)]",
            "transition-[border-color,box-shadow] scheme-light-dark",
            isInvalid ? "border-(--negative)" : "border-(--hairline-strong)",
          )}
        />
      </div>
    </div>
  );
}
