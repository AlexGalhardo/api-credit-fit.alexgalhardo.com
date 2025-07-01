import { Test, TestingModule } from "@nestjs/testing";
import { ProposalController } from "./proposal.controller";
import { ProposalService } from "./proposal.service";

describe("ProposalController", () => {
	let controller: ProposalController;

	const mockProposalService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProposalController],
			providers: [{ provide: ProposalService, useValue: mockProposalService }],
		}).compile();

		controller = module.get<ProposalController>(ProposalController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a proposal and return success response", async () => {
			const dto = {
				companyCnpj: "12.345.678/0001-00",
				employerCpf: "123.456.789-00",
				totalLoanAmount: "100000",
				numberOfInstallments: "2",
			};

			const createdProposal = {
				id: "proposal-1",
				totalLoanAmount: 100000,
				numberOfInstallments: 2,
				installmentAmount: 50000,
				firstDueDate: new Date(),
				status: "approved",
				companyName: "Empresa Ltda",
				employerEmail: "funcionario@gmail.com",
			};

			mockProposalService.create.mockResolvedValue(createdProposal);

			const response = await controller.create(dto);
			expect(response).toEqual({ success: true, data: createdProposal });
			expect(mockProposalService.create).toHaveBeenCalledWith(dto);
		});
	});

	describe("findAll", () => {
		it("should return all proposals", async () => {
			const proposals = [{ id: "proposal-1", totalLoanAmount: 200000, numberOfInstallments: 4 }];

			mockProposalService.findAll.mockResolvedValue(proposals);

			const response = await controller.findAll();
			expect(response).toEqual({ success: true, data: proposals });
			expect(mockProposalService.findAll).toHaveBeenCalled();
		});
	});

	describe("findOne", () => {
		it("should return a single proposal by id", async () => {
			const proposal = { id: "proposal-1", totalLoanAmount: 300000, numberOfInstallments: 6 };

			mockProposalService.findOne.mockResolvedValue(proposal);

			const response = await controller.findOne("proposal-1");
			expect(response).toEqual({ success: true, data: proposal });
			expect(mockProposalService.findOne).toHaveBeenCalledWith("proposal-1");
		});
	});

	describe("update", () => {
		it("should update a proposal", async () => {
			const dto: Partial<{ status: "approved" | "rejected"; installmentsPaid: number }> = {
				status: "rejected",
				installmentsPaid: 1,
			};
			const updatedProposal = {
				id: "proposal-1",
				status: "rejected",
				installmentsPaid: 1,
			};

			mockProposalService.update.mockResolvedValue(updatedProposal);

			const response = await controller.update("proposal-1", dto);
			expect(response).toEqual({ success: true, data: updatedProposal });
			expect(mockProposalService.update).toHaveBeenCalledWith("proposal-1", dto);
		});
	});

	describe("remove", () => {
		it("should soft delete a proposal", async () => {
			const deletedProposal = { id: "proposal-1", deletedAt: new Date() };
			mockProposalService.remove.mockResolvedValue(deletedProposal);

			const response = await controller.remove("proposal-1");
			expect(response).toEqual({ success: true, data: deletedProposal });
			expect(mockProposalService.remove).toHaveBeenCalledWith("proposal-1");
		});
	});
});
