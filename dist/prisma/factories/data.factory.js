"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFactory = void 0;
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const seed_constants_1 = require("../../src/utils/seed-constants");
class DataFactory {
    static createCompanyEmail(name) {
        return `${name
            .toLowerCase()
            .replace(/seed - |ltda|s\.a\.|me/gi, "")
            .trim()
            .replace(/\s+/g, "-")}@gmail.com`;
    }
    static createCompanyLegalName(name) {
        return name.replace(seed_constants_1.SEED_PREFIX, "") + " LTDA";
    }
    static createCompanyFromData(data) {
        return {
            name: data.name,
            email: this.createCompanyEmail(data.name),
            cpf: data.cpf,
            cnpj: data.cnpj,
            legalName: this.createCompanyLegalName(data.name),
        };
    }
    static createEmployeeFromData(data) {
        return {
            fullName: data.name,
            email: data.email,
            cpf: data.cpf,
            salary: data.salary,
            currentlyEmployed: true,
            companyCnpj: data.companyCnpj,
        };
    }
    static createProposal(amount, company, employee) {
        const numberOfInstallments = faker_1.faker.number.int(seed_constants_1.INSTALLMENT_RANGE);
        const installmentAmount = Math.floor(amount / numberOfInstallments);
        return {
            status: faker_1.faker.helpers.arrayElement([client_1.ProposalStatus.APPROVED, client_1.ProposalStatus.REJECTED]),
            companyCnpj: company.cnpj,
            employeeCpf: employee.cpf,
            totalLoanAmount: amount,
            numberOfInstallments,
            installmentAmount,
            firstDueDate: (0, date_fns_1.addDays)(new Date(), seed_constants_1.DAYS_TO_FIRST_DUE),
            installmentsPaid: 0,
            companyName: company.name,
            employerEmail: employee.email,
            employeeCreditScore: seed_constants_1.DEFAULT_CREDIT_SCORE,
        };
    }
    static getRandomEmployee(employees) {
        return faker_1.faker.helpers.arrayElement(employees);
    }
}
exports.DataFactory = DataFactory;
//# sourceMappingURL=data.factory.js.map