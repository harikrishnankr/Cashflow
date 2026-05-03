/*
  Warnings:

  - The primary key for the `budgets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `budgets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `recurringExpenseId` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `incomes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `incomes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `recurringIncomeId` column on the `incomes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `notification_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `notification_settings` table. All the data in the column will be lost.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `recurring_expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `recurring_expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `recurring_incomes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `recurring_incomes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `refresh_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_recurringExpenseId_fkey";

-- DropForeignKey
ALTER TABLE "incomes" DROP CONSTRAINT "incomes_recurringIncomeId_fkey";

-- DropIndex
DROP INDEX "notification_settings_userId_key";

-- AlterTable
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "budgets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "recurringExpenseId",
ADD COLUMN     "recurringExpenseId" INTEGER,
ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "incomes" DROP CONSTRAINT "incomes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "recurringIncomeId",
ADD COLUMN     "recurringIncomeId" INTEGER,
ADD CONSTRAINT "incomes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recurring_expenses" DROP CONSTRAINT "recurring_expenses_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "recurring_expenses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recurring_incomes" DROP CONSTRAINT "recurring_incomes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "recurring_incomes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_recurringExpenseId_fkey" FOREIGN KEY ("recurringExpenseId") REFERENCES "recurring_expenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_recurringIncomeId_fkey" FOREIGN KEY ("recurringIncomeId") REFERENCES "recurring_incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
