import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MONTHS } from "../../constants";
import { Button } from "@/components/ui";

export function BudgetFilter({
  onPrev,
  onNext,
  onCreate,
  month,
  year,
}: {
  onPrev: () => void;
  onNext: () => void;
  onCreate: () => void;
  month: number;
  year: number;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-(--r-sm) border border-(--hairline-strong) bg-(--card) flex items-center justify-center text-(--ink-3) hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="min-w-30 text-center text-sm font-medium text-(--ink-2) px-1">
          {MONTHS[month - 1]} {year}
        </span>
        <button
          onClick={onNext}
          className="w-8 h-8 rounded-(--r-sm) border border-(--hairline-strong) bg-(--card) flex items-center justify-center text-(--ink-3) hover:bg-(--paper-2) hover:text-(--ink) transition-colors cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <Button size="sm" onClick={onCreate}>
        <Plus size={15} />
        New budget
      </Button>
    </div>
  );
}
