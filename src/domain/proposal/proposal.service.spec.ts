import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProposalStatus } from "@prisma/client";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { ProposalService } from "./proposal.service";

global.fetch = jest.fn();

describe("ProposalService", () => {
	let service: ProposalService;
	let prisma: jest.Mocked<RepositoryService>;

	const validCnpj = cnpj.generate();
	const validCpf = cpf.generate();

	const mockCompany = {
		id: "company-1",
		name: "Empresa Ltda",
		cnpj: validCnpj,
		email: "empresa@test.com",
		cpf: cpf.generate(),
		legalName: "Empresa Legal Ltda",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	const mockEmployee = {
		id: "employee-1",
		fullName: "João Silva",
		email: "funcionario@gmail.com",
		cpf: validCpf,
		salary: 500000,
		currentlyEmployed: true,
		companyId: "company-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	const mockProposal = {
		id: "proposal-1",
		status: ProposalStatus.APPROVED,
		totalLoanAmount: 100000,
		numberOfInstallments: 2,
		installmentAmount: 50000,
		firstDueDate: new Date(),
		installmentsPaid: 0,
		companyName: "Empresa Ltda",
		employerEmail: "funcionario@gmail.com",
		companyCnpj: validCnpj,
		employeeCpf: validCpf,
		employeeCreditScore: 600,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		company: {
			id: "company-1",
			name: "Empresa Ltda",
			email: "empresa@test.com",
			cnpj: validCnpj,
			legalName: "Empresa Legal Ltda",
		},
		employee: {
			id: "employee-1",
			fullName: "João Silva",
			email: "funcionario@gmail.com",
			cpf: validCpf,
			salary: 500000,
			currentlyEmployed: true,
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProposalService,
				{
					provide: RepositoryService,
					useValue: {
						proposal: {
							create: jest.fn(),
							findMany: jest.fn(),
							findFirst: jest.fn(),
							update: jest.fn(),
						},
						company: {
							findUnique: jest.fn(),
						},
						employee: {
							findUnique: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<ProposalService>(ProposalService);
		prisma = module.get<RepositoryService>(RepositoryService) as typeof prisma;

		jest.clearAllMocks();

		(global.fetch as jest.Mock).mockResolvedValue({
			json: jest.fn().mockResolvedValue({ score: 600 }),
		});

		(prisma.proposal.create as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.findMany as jest.Mock).mockResolvedValue([mockProposal]);
		(prisma.proposal.findFirst as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.update as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee);
	});

	describe("create", () => {
		it("should create a proposal when approved", async () => {
			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const result = await service.create(dto);

			expect(result).toEqual({
				success: true,
				data: mockProposal,
			});
			expect(prisma.company.findUnique).toHaveBeenCalledWith({
				where: { cnpj: dto.companyCnpj, deletedAt: null },
			});
			expect(prisma.employee.findUnique).toHaveBeenCalledWith({
				where: { cpf: dto.employeeCpf, deletedAt: null },
			});
			expect(prisma.proposal.create).toHaveBeenCalledWith({
				data: {
					status: "APPROVED",
					companyCnpj: dto.companyCnpj,
					employeeCpf: dto.employeeCpf,
					totalLoanAmount: 100000,
					numberOfInstallments: 2,
					installmentAmount: 50000,
					firstDueDate: expect.any(Date),
					installmentsPaid: 0,
					companyName: mockCompany.name,
					employerEmail: mockEmployee.email,
					employeeCreditScore: 600,
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
		});

		it("should return rejection message when credit score is insufficient", async () => {
			(global.fetch as jest.Mock).mockResolvedValue({
				json: jest.fn().mockResolvedValue({ score: 300 }),
			});

			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(null);

			const mockRejectedProposal = {
				...mockProposal,
				status: ProposalStatus.REJECTED,
				employeeCreditScore: 300,
			};
			(prisma.proposal.create as jest.Mock).mockResolvedValueOnce(mockRejectedProposal);

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const result = await service.create(dto);

			expect(result).toEqual({
				success: false,
				message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
			});
		});

		it("should throw BadRequestException when company not found", async () => {
			(prisma.company.findUnique as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateProposalDto = {
				companyCnpj: cnpj.generate(),
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException when employee not found", async () => {
			(prisma.employee.findUnique as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: cpf.generate(),
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
		});

		it("should return existing approved proposal if found", async () => {
			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(mockProposal);

			const result = await service.create(dto);

			expect(result).toEqual({
				success: true,
				data: mockProposal,
			});
			expect(prisma.proposal.create).not.toHaveBeenCalled();
		});

		it("should return rejection message for existing rejected proposal", async () => {
			(global.fetch as jest.Mock).mockResolvedValue({
				json: jest.fn().mockResolvedValue({ score: 300 }),
			});

			const mockRejectedProposal = {
				...mockProposal,
				status: ProposalStatus.REJECTED,
				employeeCreditScore: 300,
			};

			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(mockRejectedProposal);

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const result = await service.create(dto);

			expect(result).toEqual({
				success: false,
				message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
			});
			expect(prisma.proposal.create).not.toHaveBeenCalled();
		});

		it("should throw BadRequestException when fetch fails", async () => {
			(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
		});
	});

	describe("findAll", () => {
		it("should return a list of proposals", async () => {
			const result = await service.findAll();

			expect(result).toEqual([mockProposal]);
			expect(prisma.proposal.findMany).toHaveBeenCalledWith({
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
		});
	});

	describe("findOne", () => {
		it("should return a proposal by ID", async () => {
			const result = await service.findOne("proposal-1");

			expect(result).toEqual(mockProposal);
			expect(prisma.proposal.findFirst).toHaveBeenCalledWith({
				where: { id: "proposal-1", deletedAt: null },
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
		});

		it("should return null if proposal not found", async () => {
			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(null);

			const result = await service.findOne("invalid-id");

			expect(result).toBeNull();
		});
	});

	describe("update", () => {
		it("should update a proposal", async () => {
			const dto: UpdateProposalDto = {
				status: ProposalStatus.REJECTED,
				installmentsPaid: 1,
			};

			const updatedProposal = { ...mockProposal, ...dto };
			(prisma.proposal.update as jest.Mock).mockResolvedValueOnce(updatedProposal);

			const result = await service.update("proposal-1", dto);

			expect(result).toEqual(updatedProposal);
			expect(prisma.proposal.update).toHaveBeenCalledWith({
				where: { id: "proposal-1" },
				data: dto,
			});
		});

		it("should throw error if proposal not found for update", async () => {
			const dto: UpdateProposalDto = {
				status: ProposalStatus.REJECTED,
			};

			(prisma.proposal.update as jest.Mock).mockRejectedValueOnce(new Error("Record to update not found"));

			await expect(service.update("invalid-id", dto)).rejects.toThrow();
		});
	});

	describe("remove", () => {
		it("should soft delete a proposal", async () => {
			const deletedProposal = { ...mockProposal, deletedAt: new Date() };
			(prisma.proposal.update as jest.Mock).mockResolvedValueOnce(deletedProposal);

			const result = await service.remove("proposal-1");

			expect(result).toEqual(deletedProposal);
			expect(prisma.proposal.update).toHaveBeenCalledWith({
				where: { id: "proposal-1" },
				data: {
					deletedAt: expect.any(Date),
				},
			});
		});

		it("should throw error if proposal not found for deletion", async () => {
			(prisma.proposal.update as jest.Mock).mockRejectedValueOnce(new Error("Record to update not found"));

			await expect(service.remove("invalid-id")).rejects.toThrow();
		});
	});
});
