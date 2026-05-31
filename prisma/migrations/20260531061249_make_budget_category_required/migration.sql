/*
  Warnings:

  - Made the column `category` on table `budgets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "budgets" ALTER COLUMN "category" SET NOT NULL;
