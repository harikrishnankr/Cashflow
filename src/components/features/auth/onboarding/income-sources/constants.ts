import { IncomeSource } from "@/schema/user";
import { FREQUENCIES, INCOME_SOURCES } from "@/schema/user/income.constants";
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Gift,
  Store,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface IncomeSourceData {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  defaultFrequency: string;
}

const IncomeSourceMap: Record<IncomeSource, IncomeSourceData> = {
  [INCOME_SOURCES[0]]: {
    id: INCOME_SOURCES[0],
    label: INCOME_SOURCES[0],
    sub: "Full-time employment, recurring.",
    icon: Briefcase,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[1]]: {
    id: INCOME_SOURCES[1],
    label: INCOME_SOURCES[1],
    sub: "Contract & project invoices.",
    icon: Laptop,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[2]]: {
    id: INCOME_SOURCES[2],
    label: INCOME_SOURCES[2],
    sub: "Dividends, interest, capital gains.",
    icon: TrendingUp,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[3]]: {
    id: INCOME_SOURCES[3],
    label: INCOME_SOURCES[3],
    sub: "Property or sublet income.",
    icon: Building2,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[4]]: {
    id: INCOME_SOURCES[4],
    label: INCOME_SOURCES[4],
    sub: "Revenue from a business you run.",
    icon: Store,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[5]]: {
    id: INCOME_SOURCES[5],
    label: INCOME_SOURCES[5],
    sub: "Gifts, refunds, one-offs.",
    icon: Gift,
    defaultFrequency: FREQUENCIES[3],
  },
  [INCOME_SOURCES[6]]: {
    id: INCOME_SOURCES[6],
    label: INCOME_SOURCES[6],
    sub: "Any other income source.",
    icon: MoreHorizontal,
    defaultFrequency: FREQUENCIES[3],
  },
} as const;

export const INCOME_SOURCES_DATA: IncomeSourceData[] = INCOME_SOURCES.map(
  (source) => IncomeSourceMap[source],
);
