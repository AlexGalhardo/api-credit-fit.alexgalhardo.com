import { PrismaClient } from "@prisma/client";
import { CreatedCompanyInterface, CreatedEmployeeInterface, ProposalDataInterface } from "src/utils/seed";
import { SEED_PREFIX } from "../../src/utils/seed-constants";

export class DatabaseService {
	constructor(private readonly prisma: PrismaClient) {}

	async clearSeedData(): Promise<void> {
		await this.prisma.proposal.deleteMany({
			where: {
				companyName: {
					startsWith: SEED_PREFIX,
				},
			},
		});

		await this.prisma.employee.deleteMany({
			where: {
				fullName: {
					startsWith: SEED_PREFIX,
				},
			},
		});

		await this.prisma.company.deleteMany({
			where: {
				name: {
					startsWith: SEED_PREFIX,
				},
			},
		});
	}

	async createCompany(data: any): Promise<CreatedCompanyInterface> {
		return await this.prisma.company.create({ data });
	}

	async createEmployee(data: any): Promise<CreatedEmployeeInterface> {
		const employee = await this.prisma.employee.create({ data });
		return {
			...employee,
			companyCnpj: employee.companyCnpj ?? "",
		};
	}

	async createProposal(data: ProposalDataInterface): Promise<void> {
		await this.prisma.proposal.create({ data });
	}

	async disconnect(): Promise<void> {
		await this.prisma.$disconnect();
	}
}
