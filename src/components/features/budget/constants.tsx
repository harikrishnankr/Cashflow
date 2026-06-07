import type { LucideIcon } from "lucide-react";
import {
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  ShoppingBag,
  BookOpen,
  Plane,
  Home,
  Sparkles,
  TrendingUp,
  PiggyBank,
  Package,
} from "lucide-react";
import type { ExpenseCategory } from "@/schema/transaction/constants";

export type CategoryMeta = { color: string; icon: LucideIcon };

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  FOOD:          { color: "#E25A1C", icon: Utensils },
  TRANSPORT:     { color: "#2A5B8C", icon: Car },
  BILLS:         { color: "#7A6A3B", icon: Zap },
  ENTERTAINMENT: { color: "#B23A2A", icon: Film },
  HEALTH:        { color: "#2F7D4F", icon: Heart },
  SHOPPING:      { color: "#6B645B", icon: ShoppingBag },
  EDUCATION:     { color: "#5B4A8A", icon: BookOpen },
  TRAVEL:        { color: "#1A7A6E", icon: Plane },
  HOUSING:       { color: "#4A7B3B", icon: Home },
  PERSONAL_CARE: { color: "#8A5B8A", icon: Sparkles },
  INVESTMENTS:   { color: "#1E6B8A", icon: TrendingUp },
  SAVINGS:       { color: "#3A6B5A", icon: PiggyBank },
  OTHER:         { color: "#6B6460", icon: Package },
};

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function lastDayOfMonth(year: number, month: number): string {
  const d = new Date(year, month, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
