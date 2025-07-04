-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "company_cnpj" TEXT NOT NULL,
    "employee_cpf" TEXT NOT NULL,
    "total_loan_amount" INTEGER NOT NULL,
    "number_of_installments" INTEGER NOT NULL,
    "installment_amount" INTEGER NOT NULL,
    "first_due_date" TIMESTAMP(3) NOT NULL,
    "installments_paid" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "employer_email" TEXT NOT NULL,
    "employee_credit_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "currently_employed" BOOLEAN NOT NULL DEFAULT true,
    "company_cnpj" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposal_lookup_idx" ON "proposals"("company_cnpj", "employee_cpf", "total_loan_amount", "number_of_installments");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_company_cnpj_employee_cpf_total_loan_amount_numbe_key" ON "proposals"("company_cnpj", "employee_cpf", "total_loan_amount", "number_of_installments");

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
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_company_cnpj_fkey" FOREIGN KEY ("company_cnpj") REFERENCES "companies"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_employee_cpf_fkey" FOREIGN KEY ("employee_cpf") REFERENCES "employees"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_cnpj_fkey" FOREIGN KEY ("company_cnpj") REFERENCES "companies"("cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
