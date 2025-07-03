-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('approved', 'rejected');

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "companyCnpj" TEXT NOT NULL,
    "employeeCpf" TEXT NOT NULL,
    "totalLoanAmount" INTEGER NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "installmentAmount" INTEGER NOT NULL,
    "firstDueDate" TIMESTAMP(3) NOT NULL,
    "installmentsPaid" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "employerEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "currentlyEmployed" BOOLEAN NOT NULL DEFAULT true,
    "companyCnpj" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposal_lookup_idx" ON "proposals"("companyCnpj", "employeeCpf", "totalLoanAmount", "numberOfInstallments");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_companyCnpj_employeeCpf_totalLoanAmount_numberOfI_key" ON "proposals"("companyCnpj", "employeeCpf", "totalLoanAmount", "numberOfInstallments");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cpf_key" ON "companies"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_key" ON "employees"("cpf");

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_companyCnpj_fkey" FOREIGN KEY ("companyCnpj") REFERENCES "companies"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_employeeCpf_fkey" FOREIGN KEY ("employeeCpf") REFERENCES "employees"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyCnpj_fkey" FOREIGN KEY ("companyCnpj") REFERENCES "companies"("cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
