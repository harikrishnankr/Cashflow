import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { CreateIncomeInput, UpdateIncomeInput } from "@/schema/transaction/income.schema";
import type { CreateExpenseInput, UpdateExpenseInput } from "@/schema/transaction/expense.schema";
import type {
  CreateRecurringIncomeInput,
  UpdateRecurringIncomeInput,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
} from "@/schema/transaction/recurring.schema";
import type {
  ListTransactionsQuery,
  ListRecurringQuery,
  TransactionStatsQuery,
  TransactionStats,
  TransactionListItem,
  IncomeListItem,
  ExpenseListItem,
  RecurringListItem,
  RecurringIncomeListItem,
  RecurringExpenseListItem,
} from "@/schema/transaction";

// ─── Raw row type returned by $queryRaw ───────────────────────────────────
// pg driver returns: INT4→number, NUMERIC→string, DATE→string "YYYY-MM-DD",
// TIMESTAMP→Date. Handle both Date and string for date defensively.

type RawRow = {
  type: "income" | "expense";
  id: number;
  amount: string;
  date: Date | string;
  notes: string | null;
  source: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  total_count: number; // COUNT(*)::int
};

function toDateString(v: Date | string): string {
  return v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10);
}

function toISOString(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : String(v);
}

function mapRawRow(row: RawRow): TransactionListItem {
  const base = {
    id: row.id,
    amount: parseFloat(row.amount),
    date: toDateString(row.date),
    notes: row.notes,
    createdAt: toISOString(row.createdAt),
    updatedAt: toISOString(row.updatedAt),
  };

  if (row.type === "income") {
    return {
      type: "income",
      source: row.source as IncomeListItem["source"],
      ...base,
    };
  }
  return {
    type: "expense",
    category: row.category as ExpenseListItem["category"],
    ...base,
  };
}

// ─── Repository ────────────────────────────────────────────────────────────

export const transactionRepository = {
  // ── List / search ──────────────────────────────────────────────────────
  //
  // Strategy: build two Prisma.sql arms (income / expense), compose them
  // into a UNION ALL (or single arm when type is specified), wrap in an
  // outer SELECT that adds COUNT(*) OVER ()::int for the total without a
  // second round-trip, then apply ORDER BY / LIMIT / OFFSET at DB level.
  //
  // Nullable parameters + "(${p} IS NULL OR condition)" lets every filter
  // be optional without building dynamic SQL strings.

  async listTransactions(userId: string, q: ListTransactionsQuery) {
    const skip = (q.page - 1) * q.pageSize;
    const dateFrom = q.dateFrom ? new Date(q.dateFrom) : null;
    const dateTo = q.dateTo ? new Date(q.dateTo) : null;
    const searchPattern = q.search ? `%${q.search}%` : null;
    const sourceVal = q.source ?? null;
    const categoryVal = q.category ?? null;

    // sortBy/sortOrder are Zod-validated to specific string literals — safe
    // to inject as raw SQL identifiers.
    const sortCol = Prisma.raw(q.sortBy === "date" ? '"date"' : '"createdAt"');
    const sortDir = Prisma.raw(q.sortOrder === "asc" ? "ASC" : "DESC");

    const incomeArm = Prisma.sql`
      SELECT
        'income'::text  AS type,
        id, amount, date, notes,
        source::text    AS source,
        NULL::text      AS category,
        "createdAt", "updatedAt"
      FROM incomes
      WHERE "userId"    = ${userId}::uuid
        AND "deletedAt" IS NULL
        AND (${dateFrom}::date    IS NULL OR date        >= ${dateFrom}::date)
        AND (${dateTo}::date      IS NULL OR date        <= ${dateTo}::date)
        AND (${sourceVal}::text   IS NULL OR source::text = ${sourceVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR notes        ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    const expenseArm = Prisma.sql`
      SELECT
        'expense'::text AS type,
        id, amount, date, notes,
        NULL::text      AS source,
        category::text  AS category,
        "createdAt", "updatedAt"
      FROM expenses
      WHERE "userId"      = ${userId}::uuid
        AND "deletedAt"   IS NULL
        AND (${dateFrom}::date    IS NULL OR date          >= ${dateFrom}::date)
        AND (${dateTo}::date      IS NULL OR date          <= ${dateTo}::date)
        AND (${categoryVal}::text IS NULL OR category::text = ${categoryVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR notes        ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    // Conditionally compose: single arm or UNION ALL
    const dataArm =
      q.type === "income"
        ? incomeArm
        : q.type === "expense"
          ? expenseArm
          : Prisma.sql`${incomeArm} UNION ALL ${expenseArm}`;

    const rows = await prisma.$queryRaw<RawRow[]>(
      Prisma.sql`
        SELECT
          type, id, amount, date, notes, source, category,
          "createdAt", "updatedAt",
          COUNT(*) OVER ()::int AS total_count
        FROM (${dataArm}) AS combined
        ORDER BY ${sortCol} ${sortDir}
        LIMIT ${q.pageSize} OFFSET ${skip}
      `,
    );

    const total: number = rows[0]?.total_count ?? 0;

    return {
      items: rows.map(mapRawRow),
      total,
      page: q.page,
      pageSize: q.pageSize,
      totalPages: Math.ceil(total / q.pageSize),
    };
  },

  // ── Stats (filter-aware totals, no pagination) ─────────────────────────

  async getTransactionStats(userId: string, q: TransactionStatsQuery): Promise<TransactionStats> {
    const dateFrom = q.dateFrom ? new Date(q.dateFrom) : null;
    const dateTo = q.dateTo ? new Date(q.dateTo) : null;
    const searchPattern = q.search ? `%${q.search}%` : null;
    const sourceVal = q.source ?? null;
    const categoryVal = q.category ?? null;

    const incomeArm = Prisma.sql`
      SELECT 'income'::text AS type, amount
      FROM incomes
      WHERE "userId"    = ${userId}::uuid
        AND "deletedAt" IS NULL
        AND (${dateFrom}::date  IS NULL OR date        >= ${dateFrom}::date)
        AND (${dateTo}::date    IS NULL OR date        <= ${dateTo}::date)
        AND (${sourceVal}::text IS NULL OR source::text = ${sourceVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR notes        ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    const expenseArm = Prisma.sql`
      SELECT 'expense'::text AS type, amount
      FROM expenses
      WHERE "userId"      = ${userId}::uuid
        AND "deletedAt"   IS NULL
        AND (${dateFrom}::date    IS NULL OR date          >= ${dateFrom}::date)
        AND (${dateTo}::date      IS NULL OR date          <= ${dateTo}::date)
        AND (${categoryVal}::text IS NULL OR category::text = ${categoryVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR notes        ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    const dataArm =
      q.type === "income"
        ? incomeArm
        : q.type === "expense"
          ? expenseArm
          : Prisma.sql`${incomeArm} UNION ALL ${expenseArm}`;

    type StatsRow = { income: string; spending: string; count: number };

    const [row] = await prisma.$queryRaw<StatsRow[]>(Prisma.sql`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)::numeric AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::numeric AS spending,
        COUNT(*)::int AS count
      FROM (${dataArm}) AS combined
    `);

    const income = parseFloat(row?.income ?? "0");
    const spending = parseFloat(row?.spending ?? "0");
    return { income, spending, net: income - spending, count: row?.count ?? 0 };
  },

  // ── Income CRUD ────────────────────────────────────────────────────────

  async createIncome(userId: string, data: CreateIncomeInput) {
    return prisma.income.create({
      data: {
        userId,
        source: data.source,
        amount: data.amount,
        date: new Date(data.date),
        notes: data.notes,
      },
    });
  },

  async updateIncome(id: number, userId: string, data: UpdateIncomeInput) {
    return prisma.income.updateMany({
      where: { id, userId, deletedAt: null },
      data: {
        ...(data.source !== undefined && { source: data.source }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  },

  async softDeleteIncome(id: number, userId: string) {
    return prisma.income.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  async findIncomeById(id: number, userId: string) {
    return prisma.income.findFirst({ where: { id, userId, deletedAt: null } });
  },

  // ── Expense CRUD ───────────────────────────────────────────────────────

  async createExpense(userId: string, data: CreateExpenseInput) {
    return prisma.expense.create({
      data: {
        userId,
        category: data.category,
        amount: data.amount,
        date: new Date(data.date),
        notes: data.notes,
      },
    });
  },

  async updateExpense(id: number, userId: string, data: UpdateExpenseInput) {
    return prisma.expense.updateMany({
      where: { id, userId, deletedAt: null },
      data: {
        ...(data.category !== undefined && { category: data.category }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  },

  async softDeleteExpense(id: number, userId: string) {
    return prisma.expense.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  async findExpenseById(id: number, userId: string) {
    return prisma.expense.findFirst({ where: { id, userId, deletedAt: null } });
  },

  // ── Recurring list ─────────────────────────────────────────────────────
  //
  // Same UNION + window-function pattern as listTransactions.
  // DELETE on recurring = deactivate (isActive=false), not hard-delete,
  // because RecurringIncome/RecurringExpense have FK relations to
  // Income/Expense and no deletedAt column.

  async listRecurring(userId: string, q: ListRecurringQuery) {
    const skip = (q.page - 1) * q.pageSize;
    const searchPattern = q.search ? `%${q.search}%` : null;
    const sourceVal = q.source ?? null;
    const categoryVal = q.category ?? null;
    const isActiveVal = q.isActive ?? null; // null = no filter

    const sortColName =
      q.sortBy === "nextDueDate"
        ? '"nextDueDate"'
        : q.sortBy === "startDate"
          ? '"startDate"'
          : '"createdAt"';
    const sortCol = Prisma.raw(sortColName);
    const sortDir = Prisma.raw(q.sortOrder === "asc" ? "ASC" : "DESC");

    type RecurringRawRow = {
      type: "income" | "expense";
      id: number;
      amount: string;
      description: string;
      frequency: string;
      startDate: Date | string;
      endDate: Date | string | null;
      nextDueDate: Date | string;
      isActive: boolean;
      reminderDaysBefore: number;
      notes: string | null;
      source: string | null;
      category: string | null;
      createdAt: Date;
      updatedAt: Date;
      total_count: number;
    };

    function mapRecurringRow(row: RecurringRawRow): RecurringListItem {
      const base = {
        id: row.id,
        amount: parseFloat(row.amount),
        description: row.description,
        frequency: row.frequency as RecurringIncomeListItem["frequency"],
        startDate: toDateString(row.startDate),
        endDate: row.endDate ? toDateString(row.endDate) : null,
        nextDueDate: toDateString(row.nextDueDate),
        isActive: row.isActive,
        reminderDaysBefore: row.reminderDaysBefore,
        notes: row.notes,
        createdAt: toISOString(row.createdAt),
        updatedAt: toISOString(row.updatedAt),
      };
      if (row.type === "income") {
        return {
          type: "income",
          source: row.source as RecurringIncomeListItem["source"],
          ...base,
        };
      }
      return {
        type: "expense",
        category: row.category as RecurringExpenseListItem["category"],
        ...base,
      };
    }

    const incomeArm = Prisma.sql`
      SELECT
        'income'::text  AS type,
        id, amount, description, frequency,
        "startDate", "endDate", "nextDueDate",
        "isActive", "reminderDaysBefore", notes,
        source::text    AS source,
        NULL::text      AS category,
        "createdAt", "updatedAt"
      FROM recurring_incomes
      WHERE "userId" = ${userId}::uuid
        AND (${isActiveVal}::boolean IS NULL OR "isActive" = ${isActiveVal}::boolean)
        AND (${sourceVal}::text IS NULL OR source::text = ${sourceVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR description ILIKE ${searchPattern}
          OR notes       ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    const expenseArm = Prisma.sql`
      SELECT
        'expense'::text AS type,
        id, amount, description, frequency,
        "startDate", "endDate", "nextDueDate",
        "isActive", "reminderDaysBefore", notes,
        NULL::text      AS source,
        category::text  AS category,
        "createdAt", "updatedAt"
      FROM recurring_expenses
      WHERE "userId" = ${userId}::uuid
        AND (${isActiveVal}::boolean IS NULL OR "isActive" = ${isActiveVal}::boolean)
        AND (${categoryVal}::text IS NULL OR category::text = ${categoryVal}::text)
        AND (
          ${searchPattern}::text IS NULL
          OR description ILIKE ${searchPattern}
          OR notes       ILIKE ${searchPattern}
          OR amount::text ILIKE ${searchPattern}
        )`;

    const dataArm =
      q.type === "income"
        ? incomeArm
        : q.type === "expense"
          ? expenseArm
          : Prisma.sql`${incomeArm} UNION ALL ${expenseArm}`;

    const rows = await prisma.$queryRaw<RecurringRawRow[]>(
      Prisma.sql`
        SELECT
          type, id, amount, description, frequency,
          "startDate", "endDate", "nextDueDate",
          "isActive", "reminderDaysBefore", notes,
          source, category, "createdAt", "updatedAt",
          COUNT(*) OVER ()::int AS total_count
        FROM (${dataArm}) AS combined
        ORDER BY ${sortCol} ${sortDir}
        LIMIT ${q.pageSize} OFFSET ${skip}
      `,
    );

    const total: number = rows[0]?.total_count ?? 0;

    return {
      items: rows.map(mapRecurringRow),
      total,
      page: q.page,
      pageSize: q.pageSize,
      totalPages: Math.ceil(total / q.pageSize),
    };
  },

  // ── Recurring Income CRUD ──────────────────────────────────────────────

  async createRecurringIncome(userId: string, data: CreateRecurringIncomeInput) {
    const startDate = new Date(data.startDate);
    return prisma.recurringIncome.create({
      data: {
        userId,
        source: data.source,
        description: data.description,
        amount: data.amount,
        frequency: data.frequency,
        startDate,
        endDate: data.endDate ? new Date(data.endDate) : null,
        nextDueDate: startDate,
        notes: data.notes,
        reminderDaysBefore: data.reminderDaysBefore ?? 3,
        isActive: data.isActive ?? true,
      },
    });
  },

  async updateRecurringIncome(
    id: number,
    userId: string,
    data: UpdateRecurringIncomeInput,
  ) {
    return prisma.recurringIncome.updateMany({
      where: { id, userId },
      data: {
        ...(data.source !== undefined && { source: data.source }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.frequency !== undefined && { frequency: data.frequency }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.reminderDaysBefore !== undefined && {
          reminderDaysBefore: data.reminderDaysBefore,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  },

  async deactivateRecurringIncome(id: number, userId: string) {
    return prisma.recurringIncome.updateMany({
      where: { id, userId },
      data: { isActive: false },
    });
  },

  async findRecurringIncomeById(id: number, userId: string) {
    return prisma.recurringIncome.findFirst({ where: { id, userId } });
  },

  // ── Recurring Expense CRUD ─────────────────────────────────────────────

  async createRecurringExpense(userId: string, data: CreateRecurringExpenseInput) {
    const startDate = new Date(data.startDate);
    return prisma.recurringExpense.create({
      data: {
        userId,
        category: data.category,
        description: data.description,
        amount: data.amount,
        frequency: data.frequency,
        startDate,
        endDate: data.endDate ? new Date(data.endDate) : null,
        nextDueDate: startDate,
        notes: data.notes,
        reminderDaysBefore: data.reminderDaysBefore ?? 3,
        isActive: data.isActive ?? true,
      },
    });
  },

  async updateRecurringExpense(
    id: number,
    userId: string,
    data: UpdateRecurringExpenseInput,
  ) {
    return prisma.recurringExpense.updateMany({
      where: { id, userId },
      data: {
        ...(data.category !== undefined && { category: data.category }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.frequency !== undefined && { frequency: data.frequency }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.reminderDaysBefore !== undefined && {
          reminderDaysBefore: data.reminderDaysBefore,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  },

  async deactivateRecurringExpense(id: number, userId: string) {
    return prisma.recurringExpense.updateMany({
      where: { id, userId },
      data: { isActive: false },
    });
  },

  async findRecurringExpenseById(id: number, userId: string) {
    return prisma.recurringExpense.findFirst({ where: { id, userId } });
  },
};
