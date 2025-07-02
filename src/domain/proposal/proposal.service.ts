import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { createProposalSchema } from "./schema/create-proposal.schema";

@Injectable()
export class ProposalService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: CreateProposalDto) {
		try {
			const data = createProposalSchema.parse(dto);

			const company = await this.repository.company.findUnique({
				where: {
					cnpj: data.companyCnpj,
					deletedAt: null,
				},
			});

			if (!company) throw new NotFoundException("Company not found with this CNPJ");

			const employee = await this.repository.employee.findUnique({
				where: {
					cpf: data.employeeCpf,
					deletedAt: null,
				},
			});

			if (!employee) throw new NotFoundException("Employee not found with this CPF");

			const existingProposal = await this.repository.proposal.findFirst({
				where: {
					companyCnpj: data.companyCnpj,
					employeeCpf: data.employeeCpf,
					totalLoanAmount: data.totalLoanAmount,
					numberOfInstallments: data.numberOfInstallments,
					status: "approved",
					deletedAt: null,
				},
				include: {
					company: {
						select: {
							name: true,
							email: true,
							cnpj: true,
							legalName: true,
						},
					},
					employee: {
						select: {
							fullName: true,
							email: true,
							cpf: true,
						},
					},
				},
			});

			if (existingProposal) return existingProposal;

			const proposal = await this.repository.proposal.create({
				data: {
					status: "approved",
					companyCnpj: data.companyCnpj,
					employeeCpf: data.employeeCpf,
					totalLoanAmount: data.totalLoanAmount,
					numberOfInstallments: data.numberOfInstallments,
					installmentAmount: Math.floor(data.totalLoanAmount / data.numberOfInstallments),
					firstDueDate: addDays(new Date(), 30),
					installmentsPaid: 0,
					companyName: company.name,
					employerEmail: employee.email,
				},
				include: {
					company: {
						select: {
							name: true,
							email: true,
							cnpj: true,
							legalName: true,
						},
					},
					employee: {
						select: {
							fullName: true,
							email: true,
							cpf: true,
						},
					},
				},
			});

			return proposal;
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					const fields = (error.meta?.target as string[]) || [];
					const messages = fields.map((field) => `${field} already registered`);
					throw new BadRequestException({
						success: false,
						message: messages.join(", "),
					});
				}
			}

			throw new BadRequestException({
				success: false,
				message: error?.message ?? "Unexpected error while creating proposal",
			});
		}
	}

	async findAll() {
		return await this.repository.proposal.findMany({
			where: { deletedAt: null },
			include: {
				company: {
					select: {
						id: true,
						name: true,
						email: true,
						cnpj: true,
						legalName: true,
					},
				},
				employee: {
					select: {
						id: true,
						fullName: true,
						email: true,
						cpf: true,
						salary: true,
						currentlyEmployed: true,
					},
				},
			},
		});
	}

	async findOne(id: string) {
		return await this.repository.proposal.findFirst({
			where: { id, deletedAt: null },
			include: {
				company: {
					select: {
						id: true,
						name: true,
						email: true,
						cnpj: true,
						legalName: true,
					},
				},
				employee: {
					select: {
						id: true,
						fullName: true,
						email: true,
						cpf: true,
						salary: true,
						currentlyEmployed: true,
					},
				},
			},
		});
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
