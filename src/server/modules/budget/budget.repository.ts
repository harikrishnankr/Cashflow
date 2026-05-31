import { prisma } from "@/lib/prisma";
import type {
  CreateBudgetInput,
  UpdateBudgetInput,
} from "@/schema/budget/budget.schema";
import type { ListBudgetsQuery } from "@/schema/budget/query.schema";
import type { BudgetStatus } from "@/schema/budget";

export const budgetRepository = {
  async countByUser(userId: string): Promise<number> {
    return prisma.budget.count({ where: { userId } });
  },

  async create(userId: string, data: CreateBudgetInput) {
    return prisma.budget.create({
      data: {
        userId,
        name: data.name,
        category: data.category,
        amount: data.amount,
        period: data.period,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        alertThreshold: data.alertThreshold,
      },
    });
  },

  async findById(id: number, userId: string) {
    return prisma.budget.findFirst({ where: { id, userId } });
  },

  async update(id: number, userId: string, data: UpdateBudgetInput) {
    return prisma.budget.updateMany({
      where: { id, userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.periodEnd !== undefined && {
          periodEnd: new Date(data.periodEnd),
        }),
        ...(data.alertThreshold !== undefined && {
          alertThreshold: data.alertThreshold,
        }),
      },
    });
  },

  async remove(id: number, userId: string) {
    return prisma.budget.deleteMany({ where: { id, userId } });
  },

  async listWithSpending(userId: string, query: ListBudgetsQuery) {
    // UTC-safe month boundaries
    const firstDay = new Date(Date.UTC(query.year, query.month - 1, 1));
    const lastDay = new Date(Date.UTC(query.year, query.month, 0));

    // All budgets whose period overlaps with the requested month
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        periodStart: { lte: lastDay },
        periodEnd: { gte: firstDay },
      },
      orderBy: { createdAt: "asc" },
    });

    // Expense spending grouped by category for the month
    const expenseAggs = await prisma.expense.groupBy({
      by: ["category"],
      where: {
        userId,
        date: { gte: firstDay, lte: lastDay },
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalSpent = expenseAggs.reduce(
      (sum, agg) => sum + parseFloat(agg._sum.amount?.toString() ?? "0"),
      0,
    );

    const spendingByCategory = new Map(
      expenseAggs.map((agg) => [
        agg.category as string,
        {
          spent: parseFloat(agg._sum.amount?.toString() ?? "0"),
          count: agg._count.id,
        },
      ]),
    );

    let onTrack = 0;
    let nearLimit = 0;
    let overBudget = 0;
    let totalBudget = 0;

    const items = budgets.map((budget) => {
      const amount = parseFloat(budget.amount.toString());
      const threshold = parseFloat(budget.alertThreshold.toString());

      const agg = spendingByCategory.get(budget.category) ?? {
        spent: 0,
        count: 0,
      };

      let status: BudgetStatus;
      if (agg.spent >= amount) {
        status = "over_budget";
        overBudget++;
      } else if (agg.spent >= threshold * amount) {
        status = "near_limit";
        nearLimit++;
      } else {
        status = "on_track";
        onTrack++;
      }

      totalBudget += amount;

      return {
        id: budget.id,
        name: budget.name,
        category: budget.category,
        amount,
        period: budget.period,
        periodStart: budget.periodStart.toISOString().slice(0, 10),
        periodEnd: budget.periodEnd.toISOString().slice(0, 10),
        alertThreshold: threshold,
        isActive: budget.isActive,
        spent: agg.spent,
        transactionCount: agg.count,
        status,
        createdAt: budget.createdAt.toISOString(),
        updatedAt: budget.updatedAt.toISOString(),
      };
    });

    return {
      items,
      summary: {
        totalBudget,
        totalSpending: totalSpent,
        onTrack,
        nearLimit,
        overBudget,
      },
    };
  },
};
