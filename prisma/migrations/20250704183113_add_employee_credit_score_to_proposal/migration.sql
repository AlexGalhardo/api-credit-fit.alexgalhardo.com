/*
  Warnings:

  - Added the required column `employee_credit_score` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "employee_credit_score" INTEGER NOT NULL;
