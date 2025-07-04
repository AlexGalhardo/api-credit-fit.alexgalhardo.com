import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProposalStatus } from "@prisma/client";
import { addDays } from "date-fns";
import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { createProposalSchema } from "./schema/create-proposal.schema";

@Injectable()
export class ProposalService {
	constructor(private readonly repository: RepositoryService) {}

	private async verifyEmployeeCreditScore(employeeCpf: string): Promise<number> {
		try {
			const response = await fetch("https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf");
			const { score } = await response.json();
			return score;
		} catch (error: any) {
			throw new BadRequestException({
				success: false,
				message: error?.message ?? "Não foi possível verificar o score de crédito do empregado",
			});
		}
	}

	private verifyIfEmployeeCreditScoreIsEnoughToApproveLoan(
		employeeCreditScore: number,
		employeeSalary: number,
	): boolean {
		if (employeeSalary <= 200000) return employeeCreditScore >= 400;
		if (employeeSalary <= 400000) return employeeCreditScore >= 500;
		if (employeeSalary <= 800000) return employeeCreditScore >= 600;
		if (employeeSalary <= 1200000) return employeeCreditScore >= 700;
		return false;
	}

	async create(dto: CreateProposalDto) {
		try {
			const data = createProposalSchema.parse(dto);

			const company = await this.repository.company.findUnique({
				where: {
					cnpj: data.companyCnpj,
					deletedAt: null,
				},
			});
			if (!company) throw new NotFoundException(`Empresa não encontrada com CNPJ ${data.companyCnpj}`);

			const employee = await this.repository.employee.findUnique({
				where: {
					cpf: data.employeeCpf,
					deletedAt: null,
				},
			});
			if (!employee) throw new NotFoundException(`Empregado não encontrado com CPF ${data.employeeCpf}`);

			const employeeCreditScore = await this.verifyEmployeeCreditScore(employee.cpf);

			const approveLoan = this.verifyIfEmployeeCreditScoreIsEnoughToApproveLoan(
				employeeCreditScore,
				employee.salary,
			);

			const proposalStatus = approveLoan ? ProposalStatus.APPROVED : ProposalStatus.REJECTED;

			const existingProposal = await this.repository.proposal.findFirst({
				where: {
					companyCnpj: data.companyCnpj,
					employeeCpf: data.employeeCpf,
					totalLoanAmount: data.totalLoanAmount,
					numberOfInstallments: data.numberOfInstallments,
					status: proposalStatus,
					employeeCreditScore,
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

			if (existingProposal) {
				return approveLoan
					? { success: true, data: existingProposal }
					: {
							success: false,
							message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
						};
			}

			const proposal = await this.repository.proposal.create({
				data: {
					status: proposalStatus,
					companyCnpj: data.companyCnpj,
					employeeCpf: data.employeeCpf,
					totalLoanAmount: data.totalLoanAmount,
					numberOfInstallments: data.numberOfInstallments,
					installmentAmount: Math.floor(data.totalLoanAmount / data.numberOfInstallments),
					firstDueDate: addDays(new Date(), 30),
					installmentsPaid: 0,
					companyName: company.name,
					employerEmail: employee.email,
					employeeCreditScore,
				},
				include: approveLoan
					? {
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
						}
					: undefined,
			});

			return approveLoan
				? { success: true, data: proposal }
				: {
						success: false,
						message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
					};
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					const fields = (error.meta?.target as string[]) || [];
					const messages = fields.map((field) => `${field} já registrado`);
					throw new BadRequestException({
						success: false,
						message: messages.join(", "),
					});
				}
			}

			throw new BadRequestException({
				success: false,
				message: error?.message ?? "Erro inesperado ao criar proposta",
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

	async update(id: string, dto: Partial<{ status: "APPROVED" | "REJECTED"; installmentsPaid: number }>) {
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
