import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProposalStatus } from "@prisma/client";
import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { ProposalService } from "./proposal.service";

describe("ProposalService", () => {
	let service: ProposalService;
	let prisma: jest.Mocked<RepositoryService>;

	const mockProposal = {
		id: "proposal-1",
		status: ProposalStatus.approved,
		totalLoanAmount: 100000,
		numberOfInstallments: 2,
		installmentAmount: 50000,
		firstDueDate: new Date(),
		installmentsPaid: 0,
		companyName: "empresa-ltda",
		employerEmail: "funcionario@gmail.com",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProposalService,
				{
					provide: RepositoryService,
					useValue: {
						proposal: {
							create: jest.fn() as jest.Mock,
							findMany: jest.fn() as jest.Mock,
							findFirst: jest.fn() as jest.Mock,
							update: jest.fn() as jest.Mock,
						},
						company: {
							findFirst: jest.fn() as jest.Mock,
						},
						employee: {
							findFirst: jest.fn() as jest.Mock,
						},
					},
				},
			],
		}).compile();

		service = module.get<ProposalService>(ProposalService);
		prisma = module.get<RepositoryService>(RepositoryService) as typeof prisma;

		(prisma.proposal.create as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.findMany as jest.Mock).mockResolvedValue([mockProposal]);
		(prisma.proposal.findFirst as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.proposal.update as jest.Mock).mockResolvedValue(mockProposal);
		(prisma.company.findFirst as jest.Mock).mockResolvedValue({ name: "empresa-ltda" });
		(prisma.employee.findFirst as jest.Mock).mockResolvedValue({ email: "funcionario@gmail.com" });
	});

	describe("create", () => {
		it("should create a proposal", async () => {
			const dto: CreateProposalDto = {
				companyCnpj: "12.345.678/0001-00",
				employerCpf: "123.456.789-00",
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const result = await service.create(dto);
			expect(result).toEqual(mockProposal);
			expect(prisma.company.findFirst).toHaveBeenCalled();
			expect(prisma.employee.findFirst).toHaveBeenCalled();
			expect(prisma.proposal.create).toHaveBeenCalled();
		});

		it("should throw BadRequestException on invalid input", async () => {
			const invalidDto = {
				companyCnpj: "invalid",
				employerCpf: "invalid",
				totalLoanAmount: "abc",
				numberOfInstallments: "xyz",
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
			});
		});
	});

	describe("findOne", () => {
		it("should return a proposal by ID", async () => {
			const result = await service.findOne("proposal-1");

			expect(result).toEqual(mockProposal);
			expect(prisma.proposal.findFirst).toHaveBeenCalledWith({
				where: { id: "proposal-1", deletedAt: null },
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

		it("should throw BadRequestException on invalid update input", async () => {
			const invalidDto = {
				status: "invalid-status",
			};

			await expect(service.update("proposal-1", invalidDto as any)).rejects.toThrow(BadRequestException);
		});
	});

	describe("remove", () => {
		it("should soft delete a proposal", async () => {
			const result = await service.remove("proposal-1");

			expect(result).toEqual(mockProposal);
			expect(prisma.proposal.update).toHaveBeenCalledWith({
				where: { id: "proposal-1" },
				data: {
					deletedAt: expect.any(Date),
				},
			});
		});
	});
});
