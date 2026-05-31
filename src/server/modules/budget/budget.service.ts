import { BadRequestError, NotFoundError } from "@/lib/errors";
import { budgetRepository } from "./budget.repository";
import type { CreateBudgetInput, UpdateBudgetInput } from "@/schema/budget/budget.schema";
import type { ListBudgetsQuery } from "@/schema/budget/query.schema";

const MAX_BUDGETS_PER_USER = 20;

export const budgetService = {
  async list(userId: string, query: ListBudgetsQuery) {
    return budgetRepository.listWithSpending(userId, query);
  },

  async getOne(id: number, userId: string) {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget) throw new NotFoundError("Budget not found.");
    return budget;
  },

  async create(userId: string, data: CreateBudgetInput) {
    const count = await budgetRepository.countByUser(userId);
    if (count >= MAX_BUDGETS_PER_USER) {
      throw new BadRequestError(
        `You can have at most ${MAX_BUDGETS_PER_USER} budgets. Delete one to create a new budget.`,
      );
    }
    return budgetRepository.create(userId, data);
  },

  async update(id: number, userId: string, data: UpdateBudgetInput) {
    const result = await budgetRepository.update(id, userId, data);
    if (result.count === 0) throw new NotFoundError("Budget not found.");
    return budgetRepository.findById(id, userId);
  },

  async remove(id: number, userId: string) {
    const result = await budgetRepository.remove(id, userId);
    if (result.count === 0) throw new NotFoundError("Budget not found.");
  },
};
