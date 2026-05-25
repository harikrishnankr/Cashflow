import type { NextRequest } from "next/server";
import { transactionService } from "./transaction.service";
import { parseAndValidate, parseQuery } from "@/server/utils/validator.utils";
import { createIncomeSchema, updateIncomeSchema } from "@/schema/transaction/income.schema";
import { createExpenseSchema, updateExpenseSchema } from "@/schema/transaction/expense.schema";
import {
  createRecurringIncomeSchema,
  updateRecurringIncomeSchema,
  createRecurringExpenseSchema,
  updateRecurringExpenseSchema,
} from "@/schema/transaction/recurring.schema";
import { transactionStatsSchema, listTransactionsSchema, listRecurringSchema } from "@/schema/transaction/query.schema";

class TransactionController {
  // ── Transactions ─────────────────────────────────────────────────────

  async listTransactions(req: NextRequest, userId: string) {
    const query = parseQuery(req, listTransactionsSchema);
    return transactionService.listTransactions(userId, query);
  }

  async getTransactionStats(req: NextRequest, userId: string) {
    const query = parseQuery(req, transactionStatsSchema);
    return transactionService.getTransactionStats(userId, query);
  }

  async getIncome(userId: string, id: number) {
    return transactionService.getIncome(id, userId)
  }

  async createIncome(req: NextRequest, userId: string) {
    const data = await parseAndValidate(req, createIncomeSchema);
    return transactionService.addIncome(userId, data);
  }

  async updateIncome(req: NextRequest, userId: string, id: number) {
    const data = await parseAndValidate(req, updateIncomeSchema);
    return transactionService.editIncome(id, userId, data);
  }

  async deleteIncome(userId: string, id: number) {
    return transactionService.removeIncome(id, userId);
  }

  async getExpense(userId: string, id: number) {
    return transactionService.getExpense(id, userId);
  }

  async createExpense(req: NextRequest, userId: string) {
    const data = await parseAndValidate(req, createExpenseSchema);
    return transactionService.addExpense(userId, data);
  }

  async updateExpense(req: NextRequest, userId: string, id: number) {
    const data = await parseAndValidate(req, updateExpenseSchema);
    return transactionService.editExpense(id, userId, data);
  }

  async deleteExpense(userId: string, id: number) {
    return transactionService.removeExpense(id, userId);
  }

  // ── Recurring ────────────────────────────────────────────────────────

  async listRecurring(req: NextRequest, userId: string) {
    const query = parseQuery(req, listRecurringSchema);
    return transactionService.listRecurring(userId, query);
  }

  async createRecurringIncome(req: NextRequest, userId: string) {
    const data = await parseAndValidate(req, createRecurringIncomeSchema);
    return transactionService.addRecurringIncome(userId, data);
  }

  async updateRecurringIncome(req: NextRequest, userId: string, id: number) {
    const data = await parseAndValidate(req, updateRecurringIncomeSchema);
    return transactionService.editRecurringIncome(id, userId, data);
  }

  async deleteRecurringIncome(userId: string, id: number) {
    return transactionService.deactivateRecurringIncome(id, userId);
  }

  async createRecurringExpense(req: NextRequest, userId: string) {
    const data = await parseAndValidate(req, createRecurringExpenseSchema);
    return transactionService.addRecurringExpense(userId, data);
  }

  async updateRecurringExpense(req: NextRequest, userId: string, id: number) {
    const data = await parseAndValidate(req, updateRecurringExpenseSchema);
    return transactionService.editRecurringExpense(id, userId, data);
  }

  async deleteRecurringExpense(userId: string, id: number) {
    return transactionService.deactivateRecurringExpense(id, userId);
  }
}

export const transactionController = new TransactionController();
