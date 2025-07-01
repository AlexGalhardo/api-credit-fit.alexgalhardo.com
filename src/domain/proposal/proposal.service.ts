import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ZodError } from "zod";
import { RepositoryService } from "../../repository/repository.service";
import { createProposalSchema } from "./schema/create-proposal.schema";

@Injectable()
export class ProposalService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: any) {
		try {
			const data = createProposalSchema.parse(dto);

			const company = await this.repository.company.findFirst({
				where: {
					cnpj: data.companyCnpj,
					deletedAt: null,
				},
			});

			if (!company) {
				throw new NotFoundException("Company not found with this CNPJ");
			}

			const employee = await this.repository.employee.findFirst({
				where: {
					cpf: data.employerCpf,
					deletedAt: null,
				},
			});

			if (!employee) {
				throw new NotFoundException("Employee not found with this CPF");
			}

			const proposal = await this.repository.proposal.create({
				data: {
					status: "approved",
					totalLoanAmount: data.totalLoanAmount,
					numberOfInstallments: data.numberOfInstallments,
					installmentAmount: Math.floor(data.totalLoanAmount / data.numberOfInstallments),
					firstDueDate: new Date(),
					installmentsPaid: 0,
					companyName: company.name,
					employerEmail: employee.email,
				},
			});

			return proposal;
		} catch (err: unknown) {
			if (err instanceof ZodError) {
				throw new BadRequestException(
					err.errors.map((e) => ({
						path: e.path.join("."),
						message: e.message,
					})),
				);
			}
			throw err;
		}
	}

	async findAll() {
		return await this.repository.proposal.findMany({
			where: { deletedAt: null },
			include: {
				company: true,
				employee: true,
			},
		});
	}

	async findOne(id: string) {
		const proposal = await this.repository.proposal.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				company: true,
				employee: true,
			},
		});

		if (!proposal) throw new NotFoundException("Proposal not found");
		return proposal;
	}

	async update(id: string, dto: Partial<{ status: "approved" | "rejected"; installmentsPaid: number }>) {
		return await this.repository.proposal.update({
			where: { id },
			data: {
				...dto,
			},
		});
	}

	async remove(id: string) {
		return await this.repository.proposal.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});
	}
}
