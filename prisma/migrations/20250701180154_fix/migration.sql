/*
  Warnings:

  - You are about to drop the column `companyId` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_companyId_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "companyId",
ADD COLUMN     "companyCnpj" TEXT;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyCnpj_fkey" FOREIGN KEY ("companyCnpj") REFERENCES "companies"("cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
