import { CreatedCompanyInterface, CreatedEmployeeInterface } from "src/utils/seed";
import { DatabaseService } from "./database.service";
import { LOAN_VALUES, MOCK_COMPANIES, MOCK_EMPLOYEES } from "../../src/utils/seed-constants";
import { DataFactory } from "../factories/data.factory";

export class SeederService {
	constructor(private readonly databaseService: DatabaseService) {}

	async clearData(): Promise<void> {
		await this.databaseService.clearSeedData();
	}

	async seedCompanies(): Promise<CreatedCompanyInterface[]> {
		const companies: CreatedCompanyInterface[] = [];

		for (const companyData of MOCK_COMPANIES) {
			const company = await this.databaseService.createCompany(DataFactory.createCompanyFromData(companyData));
			companies.push(company);
		}

		return companies;
	}

	async seedEmployees(): Promise<CreatedEmployeeInterface[]> {
		const employees: CreatedEmployeeInterface[] = [];

		for (const employeeData of MOCK_EMPLOYEES) {
			const employee = await this.databaseService.createEmployee(
				DataFactory.createEmployeeFromData(employeeData),
			);
			employees.push(employee);
		}

		return employees;
	}

	async seedProposals(companies: CreatedCompanyInterface[], employees: CreatedEmployeeInterface[]): Promise<void> {
		for (const amount of LOAN_VALUES) {
			const employee = DataFactory.getRandomEmployee(employees);
			const company = companies.find((c) => c.cnpj === employee.companyCnpj);

			if (!company) continue;

			const proposalData = DataFactory.createProposal(amount, company, employee);
			await this.databaseService.createProposal(proposalData);
		}
	}

	async seedAll(): Promise<void> {
		await this.clearData();
		const companies = await this.seedCompanies();
		const employees = await this.seedEmployees();
		await this.seedProposals(companies, employees);
	}
}
