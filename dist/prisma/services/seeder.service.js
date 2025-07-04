"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const seed_constants_1 = require("../../src/utils/seed-constants");
const data_factory_1 = require("../factories/data.factory");
class SeederService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async clearData() {
        await this.databaseService.clearSeedData();
    }
    async seedCompanies() {
        const companies = [];
        for (const companyData of seed_constants_1.MOCK_COMPANIES) {
            const company = await this.databaseService.createCompany(data_factory_1.DataFactory.createCompanyFromData(companyData));
            companies.push(company);
        }
        return companies;
    }
    async seedEmployees() {
        const employees = [];
        for (const employeeData of seed_constants_1.MOCK_EMPLOYEES) {
            const employee = await this.databaseService.createEmployee(data_factory_1.DataFactory.createEmployeeFromData(employeeData));
            employees.push(employee);
        }
        return employees;
    }
    async seedProposals(companies, employees) {
        for (const amount of seed_constants_1.LOAN_VALUES) {
            const employee = data_factory_1.DataFactory.getRandomEmployee(employees);
            const company = companies.find((c) => c.cnpj === employee.companyCnpj);
            if (!company)
                continue;
            const proposalData = data_factory_1.DataFactory.createProposal(amount, company, employee);
            await this.databaseService.createProposal(proposalData);
        }
    }
    async seedAll() {
        await this.clearData();
        const companies = await this.seedCompanies();
        const employees = await this.seedEmployees();
        await this.seedProposals(companies, employees);
    }
}
exports.SeederService = SeederService;
//# sourceMappingURL=seeder.service.js.map