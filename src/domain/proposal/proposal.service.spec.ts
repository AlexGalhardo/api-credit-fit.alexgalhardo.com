import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProposalStatus } from "@prisma/client";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { ProposalService } from "./proposal.service";

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
		status: ProposalStatus.approved,
		totalLoanAmount: 100000,
		numberOfInstallments: 2,
		installmentAmount: 50000,
		firstDueDate: new Date(),
		installmentsPaid: 0,
		companyName: "Empresa Ltda",
		employerEmail: "funcionario@gmail.com",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		company: mockCompany,
		employee: mockEmployee,
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
							findFirst: jest.fn(),
						},
						employee: {
							findFirst: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<ProposalService>(ProposalService);
		prisma = module.get<RepositoryService>(RepositoryService) as typeof prisma;

		jest.clearAllMocks();

		(prisma.proposal.create as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.findMany as jest.Mock).mockResolvedValue([mockProposal]);
		(prisma.proposal.findFirst as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.update as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.company.findFirst as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee);
	});

	describe("create", () => {
		it("should create a proposal", async () => {
			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const result = await service.create(dto);

			expect(result).toEqual(mockProposal);
			expect(prisma.company.findFirst).toHaveBeenCalledWith({
				where: { cnpj: dto.companyCnpj, deletedAt: null },
			});
			expect(prisma.employee.findFirst).toHaveBeenCalledWith({
				where: { cpf: dto.employeeCpf, deletedAt: null },
			});
			expect(prisma.proposal.create).toHaveBeenCalledWith({
				data: {
					status: "approved",
					totalLoanAmount: 100000,
					numberOfInstallments: 2,
					installmentAmount: 50000,
					firstDueDate: expect.any(Date),
					installmentsPaid: 0,
					companyName: mockCompany.name,
					employerEmail: mockEmployee.email,
				},
			});
		});

		it("should throw BadRequestException on invalid CNPJ", async () => {
			const invalidDto = {
				companyCnpj: "invalid-cnpj",
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException on invalid CPF", async () => {
			const invalidDto = {
				companyCnpj: validCnpj,
				employeeCpf: "invalid-cpf",
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException on invalid totalLoanAmount", async () => {
			const invalidDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "abc",
				numberOfInstallments: "2",
			};

			await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException when company not found", async () => {
			(prisma.company.findFirst as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateProposalDto = {
				companyCnpj: cnpj.generate(),
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
			expect(prisma.company.findFirst).toHaveBeenCalledWith({
				where: { cnpj: dto.companyCnpj, deletedAt: null },
			});
		});

		it("should throw BadRequestException when employee not found", async () => {
			(prisma.employee.findFirst as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateProposalDto = {
				companyCnpj: validCnpj,
				employeeCpf: cpf.generate(),
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
			expect(prisma.employee.findFirst).toHaveBeenCalledWith({
				where: { cpf: dto.employeeCpf, deletedAt: null },
			});
		});

		it("should throw BadRequestException on zero numberOfInstallments", async () => {
			const invalidDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "100000",
				numberOfInstallments: "0",
			};

			await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException on negative totalLoanAmount", async () => {
			const invalidDto = {
				companyCnpj: validCnpj,
				employeeCpf: validCpf,
				totalLoanAmount: "-1000",
				numberOfInstallments: "2",
			};

			await expect(service.create(invalidDto as any)).rejects.toThrow(BadRequestException);
		});
	});

	describe("findAll", () => {
		it("should return a list of proposals", async () => {
			const result = await service.findAll();

			expect(result).toEqual([mockProposal]);
			expect(prisma.proposal.findMany).toHaveBeenCalledWith({
				where: { deletedAt: null },
				include: {
					company: true,
					employee: true,
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
					company: true,
					employee: true,
				},
			});
		});

		it("should throw NotFoundException if proposal not found", async () => {
			(prisma.proposal.findFirst as jest.Mock).mockResolvedValueOnce(null);

			await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException);
		});
	});

	describe("update", () => {
		it("should update a proposal", async () => {
			const dto: UpdateProposalDto = {
				status: ProposalStatus.rejected,
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
				status: ProposalStatus.rejected,
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
