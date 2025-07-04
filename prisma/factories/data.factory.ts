import { faker } from "@faker-js/faker";
import { ProposalStatus } from "@prisma/client";
import { addDays } from "date-fns";
import {
	CompanyDataInterface,
	CreatedCompanyInterface,
	CreatedEmployeeInterface,
	EmployeeDataInterface,
	ProposalDataInterface,
} from "src/utils/seed";
import {
	DAYS_TO_FIRST_DUE,
	DEFAULT_CREDIT_SCORE,
	INSTALLMENT_RANGE,
	SEED_PREFIX,
} from "../../src/utils/seed-constants";

export class DataFactory {
	static createCompanyEmail(name: string): string {
		return `${name
			.toLowerCase()
			.replace(/seed - |ltda|s\.a\.|me/gi, "")
			.trim()
			.replace(/\s+/g, "-")}@gmail.com`;
	}

	static createCompanyLegalName(name: string): string {
		return name.replace(SEED_PREFIX, "") + " LTDA";
	}

	static createCompanyFromData(data: CompanyDataInterface) {
		return {
			name: data.name,
			email: this.createCompanyEmail(data.name),
			cpf: data.cpf,
			cnpj: data.cnpj,
			legalName: this.createCompanyLegalName(data.name),
		};
	}

	static createEmployeeFromData(data: EmployeeDataInterface) {
		return {
			fullName: data.name,
			email: data.email,
			cpf: data.cpf,
			salary: data.salary,
			currentlyEmployed: true,
			companyCnpj: data.companyCnpj,
		};
	}

	static createProposal(
		amount: number,
		company: CreatedCompanyInterface,
		employee: CreatedEmployeeInterface,
	): ProposalDataInterface {
		const numberOfInstallments = faker.number.int(INSTALLMENT_RANGE);
		const installmentAmount = Math.floor(amount / numberOfInstallments);

		return {
			status: faker.helpers.arrayElement([ProposalStatus.APPROVED, ProposalStatus.REJECTED]),
			companyCnpj: company.cnpj,
			employeeCpf: employee.cpf,
			totalLoanAmount: amount,
			numberOfInstallments,
			installmentAmount,
			firstDueDate: addDays(new Date(), DAYS_TO_FIRST_DUE),
			installmentsPaid: 0,
			companyName: company.name,
			employerEmail: employee.email,
			employeeCreditScore: DEFAULT_CREDIT_SCORE,
		};
	}

	static getRandomEmployee(employees: CreatedEmployeeInterface[]): CreatedEmployeeInterface {
		return faker.helpers.arrayElement(employees);
	}
}
