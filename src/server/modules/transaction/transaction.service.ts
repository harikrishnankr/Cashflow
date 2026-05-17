import { NotFoundError } from "@/lib/errors";
import { transactionRepository } from "./transaction.repository";
import type { CreateIncomeInput, UpdateIncomeInput } from "@/schema/transaction/income.schema";
import type { CreateExpenseInput, UpdateExpenseInput } from "@/schema/transaction/expense.schema";
import type {
  CreateRecurringIncomeInput,
  UpdateRecurringIncomeInput,
  CreateRecurringExpenseInput,
  UpdateRecurringExpenseInput,
} from "@/schema/transaction/recurring.schema";
import type { ListTransactionsQuery, ListRecurringQuery } from "@/schema/transaction";

export const transactionService = {
  // ── Transactions ───────────────────────────────────────────────────────

  async listTransactions(userId: string, query: ListTransactionsQuery) {
    return transactionRepository.listTransactions(userId, query);
  },

  async getIncome(id: number, userId: string) {
    return transactionRepository.findIncomeById(id, userId);
  },

  async addIncome(userId: string, data: CreateIncomeInput) {
    return transactionRepository.createIncome(userId, data);
  },

  async editIncome(id: number, userId: string, data: UpdateIncomeInput) {
    const result = await transactionRepository.updateIncome(id, userId, data);
    if (result.count === 0) throw new NotFoundError("Income transaction not found.");
    return transactionRepository.findIncomeById(id, userId);
  },

  async removeIncome(id: number, userId: string) {
    const result = await transactionRepository.softDeleteIncome(id, userId);
    if (result.count === 0) throw new NotFoundError("Income transaction not found.");
  },

  async getExpense(id: number, userId: string) {
    return transactionRepository.findExpenseById(id, userId);
  },

  async addExpense(userId: string, data: CreateExpenseInput) {
    return transactionRepository.createExpense(userId, data);
  },

  async editExpense(id: number, userId: string, data: UpdateExpenseInput) {
    const result = await transactionRepository.updateExpense(id, userId, data);
    if (result.count === 0) throw new NotFoundError("Expense transaction not found.");
    return transactionRepository.findExpenseById(id, userId);
  },

  async removeExpense(id: number, userId: string) {
    const result = await transactionRepository.softDeleteExpense(id, userId);
    if (result.count === 0) throw new NotFoundError("Expense transaction not found.");
  },

  // ── Recurring ──────────────────────────────────────────────────────────

  async listRecurring(userId: string, query: ListRecurringQuery) {
    return transactionRepository.listRecurring(userId, query);
  },

  async addRecurringIncome(userId: string, data: CreateRecurringIncomeInput) {
    return transactionRepository.createRecurringIncome(userId, data);
  },

  async editRecurringIncome(
    id: number,
    userId: string,
    data: UpdateRecurringIncomeInput,
  ) {
    const result = await transactionRepository.updateRecurringIncome(id, userId, data);
    if (result.count === 0) throw new NotFoundError("Recurring income not found.");
    return transactionRepository.findRecurringIncomeById(id, userId);
  },

  async deactivateRecurringIncome(id: number, userId: string) {
    const result = await transactionRepository.deactivateRecurringIncome(id, userId);
    if (result.count === 0) throw new NotFoundError("Recurring income not found.");
  },

  async addRecurringExpense(userId: string, data: CreateRecurringExpenseInput) {
    return transactionRepository.createRecurringExpense(userId, data);
  },

  async editRecurringExpense(
    id: number,
    userId: string,
    data: UpdateRecurringExpenseInput,
  ) {
    const result = await transactionRepository.updateRecurringExpense(id, userId, data);
    if (result.count === 0) throw new NotFoundError("Recurring expense not found.");
    return transactionRepository.findRecurringExpenseById(id, userId);
  },

  async deactivateRecurringExpense(id: number, userId: string) {
    const result = await transactionRepository.deactivateRecurringExpense(id, userId);
    if (result.count === 0) throw new NotFoundError("Recurring expense not found.");
  },
};
