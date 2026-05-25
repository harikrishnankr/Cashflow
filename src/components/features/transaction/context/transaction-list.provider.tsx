"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { SortValue, TransactionTypeFilter } from "@/schema/transaction";

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function currentMonthRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  return {
    dateFrom: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)),
    dateTo: toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export interface FilterState {
  search: string;
  typeFilter: TransactionTypeFilter;
  dateFrom: string;
  dateTo: string;
  source: string;
  category: string;
  sort: SortValue;
  page: number;
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TYPE"; payload: TransactionTypeFilter }
  | { type: "SET_DATE_FROM"; payload: string }
  | { type: "SET_DATE_TO"; payload: string }
  | { type: "SET_SOURCE"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT"; payload: SortValue }
  | { type: "SET_PAGE"; payload: number }
  | { type: "CLEAR_FILTERS" };

const initialState: FilterState = {
  search: "",
  typeFilter: "all",
  ...currentMonthRange(),
  source: "",
  category: "",
  sort: "date:desc",
  page: 1,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_TYPE":
      return { ...state, typeFilter: action.payload, page: 1 };
    case "SET_DATE_FROM":
      return { ...state, dateFrom: action.payload, page: 1 };
    case "SET_DATE_TO":
      return { ...state, dateTo: action.payload, page: 1 };
    case "SET_SOURCE":
      return { ...state, source: action.payload, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        ...currentMonthRange(),
        source: "",
        category: "",
        sort: "date:desc",
        page: 1,
      };
  }
}

interface TransactionListContextValue {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
}

const TransactionListContext =
  createContext<TransactionListContextValue | null>(null);

export function useTransactionList() {
  const ctx = useContext(TransactionListContext);
  if (!ctx)
    throw new Error(
      "useTransactionList must be used within TransactionListProvider",
    );
  return ctx;
}

export function TransactionListProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  return (
    <TransactionListContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionListContext.Provider>
  );
}
