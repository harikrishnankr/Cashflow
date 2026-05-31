import type { NextRequest } from "next/server";
import { budgetService } from "./budget.service";
import { parseAndValidate, parseQuery } from "@/server/utils/validator.utils";
import { createBudgetSchema, updateBudgetSchema } from "@/schema/budget/budget.schema";
import { listBudgetsSchema } from "@/schema/budget/query.schema";

class BudgetController {
  async list(req: NextRequest, userId: string) {
    const query = parseQuery(req, listBudgetsSchema);
    return budgetService.list(userId, query);
  }

  async getOne(userId: string, id: number) {
    return budgetService.getOne(id, userId);
  }

  async create(req: NextRequest, userId: string) {
    const data = await parseAndValidate(req, createBudgetSchema);
    return budgetService.create(userId, data);
  }

  async update(req: NextRequest, userId: string, id: number) {
    const data = await parseAndValidate(req, updateBudgetSchema);
    return budgetService.update(id, userId, data);
  }

  async remove(userId: string, id: number) {
    return budgetService.remove(id, userId);
  }
}

export const budgetController = new BudgetController();
