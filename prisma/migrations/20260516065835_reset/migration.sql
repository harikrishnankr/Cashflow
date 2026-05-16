/*
  Warnings:

  - You are about to drop the column `primaryIncomeSource` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recurring_incomes" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reminderDaysBefore" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "primaryIncomeSource";
