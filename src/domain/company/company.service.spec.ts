import { randomUUID } from "node:crypto";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { RepositoryService } from "../../repository/repository.service";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

describe("CompanyService", () => {
	let service: CompanyService;
	let prisma: jest.Mocked<RepositoryService>;

	const mockCompany = {
		id: randomUUID(),
		legalName: "Green Valley Ltda",
		name: "Green Valley",
		email: "contact@greenvalley.com",
		cpf: cpf.generate(),
		cnpj: cnpj.generate(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		employers: [],
		proposals: [],
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CompanyService,
				{
					provide: RepositoryService,
					useValue: {
						company: {
							create: jest.fn(),
							findMany: jest.fn(),
							findFirst: jest.fn(),
							findUnique: jest.fn(),
							update: jest.fn(),
							delete: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<CompanyService>(CompanyService);
		prisma = module.get(RepositoryService);

		jest.clearAllMocks();

		(prisma.company.create as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.company.findMany as jest.Mock).mockResolvedValue([mockCompany]);
		(prisma.company.findFirst as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.company.update as jest.Mock).mockResolvedValue(mockCompany);
		(prisma.company.delete as jest.Mock).mockResolvedValue(mockCompany);
	});

	describe("create", () => {
		it("should create a company", async () => {
			const dto: CreateCompanyDto = {
				legalName: "Green Valley Ltda",
				name: "Green Valley",
				email: "contact@greenvalley.com",
				cpf: cpf.generate(),
				cnpj: cnpj.generate(),
			};

			const result = await service.create(dto);

			expect(result).toEqual(mockCompany);
			expect(prisma.company.create).toHaveBeenCalledWith({ data: dto });
		});
	});

	describe("findAll", () => {
		it("should return a list of companies", async () => {
			const result = await service.findAll();

			expect(result).toEqual([mockCompany]);
			expect(prisma.company.findMany).toHaveBeenCalledWith({
				where: { deletedAt: null },
				include: {
					employers: true,
					proposals: true,
				},
			});
		});
	});

	describe("findOne", () => {
		it("should return a company by ID", async () => {
			const result = await service.findOne("company-uuid");

			expect(result).toEqual(mockCompany);
			expect(prisma.company.findFirst).toHaveBeenCalledWith({
				where: { id: "company-uuid", deletedAt: null },
				include: {
					employers: true,
					proposals: true,
				},
			});
		});

		it("should throw NotFoundException if company not found", async () => {
			(prisma.company.findFirst as jest.Mock).mockResolvedValueOnce(null);

			await expect(service.findOne("invalid-id")).rejects.toThrow(NotFoundException);
		});
	});

	describe("update", () => {
		it("should update a company", async () => {
			const dto: UpdateCompanyDto = {
				name: "Updated Company",
				email: "updated@email.com",
			};

			const updatedMock = { ...mockCompany, ...dto };

			(prisma.company.update as jest.Mock).mockResolvedValueOnce(updatedMock);

			const result = await service.update("company-uuid", dto);

			expect(result).toEqual(updatedMock);
			expect(prisma.company.update).toHaveBeenCalledWith({
				where: { id: "company-uuid" },
				data: dto,
			});
		});

		it("should throw NotFoundException if company not found during update", async () => {
			const dto: UpdateCompanyDto = {
				name: "Updated Company",
			};

			(prisma.company.update as jest.Mock).mockRejectedValueOnce(new Error("Record to update not found"));

			await expect(service.update("invalid-id", dto)).rejects.toThrow();
		});
	});

	describe("remove", () => {
		it("should soft delete a company by ID", async () => {
			const deletedCompany = { ...mockCompany, deletedAt: new Date() };
			(prisma.company.update as jest.Mock).mockResolvedValueOnce(deletedCompany);

			const result = await service.remove("company-uuid");

			expect(result).toEqual(deletedCompany);
			expect(prisma.company.update).toHaveBeenCalledWith({
				where: { id: "company-uuid" },
				data: { deletedAt: expect.any(Date) },
			});
		});
	});
});
