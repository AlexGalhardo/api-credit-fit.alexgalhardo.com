import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { RepositoryService } from "../../repository/repository.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";

describe("EmployeeService", () => {
	let service: EmployeeService;
	let prisma: jest.Mocked<RepositoryService>;

	const mockEmployee = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		fullName: "João Silva",
		email: "joao.silva@example.com",
		cpf: "12345678900",
		salary: 3000,
		currentlyEmployed: true,
		companyId: "company-uuid-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EmployeeService,
				{
					provide: RepositoryService,
					useValue: {
						employee: {
							create: jest.fn(),
							findMany: jest.fn(),
							findFirst: jest.fn(),
							findUnique: jest.fn(),
							update: jest.fn(),
						},
						company: {
							findUnique: jest.fn(),
						},
					} as unknown as jest.Mocked<RepositoryService>,
				},
			],
		}).compile();

		service = module.get<EmployeeService>(EmployeeService);
		prisma = module.get(RepositoryService);

		jest.spyOn(prisma.employee, "create").mockResolvedValue(mockEmployee as any);
		jest.spyOn(prisma.employee, "findMany").mockResolvedValue([mockEmployee] as any);
		jest.spyOn(prisma.employee, "findFirst").mockResolvedValue(mockEmployee as any);
		jest.spyOn(prisma.employee, "update").mockResolvedValue(mockEmployee as any);
		jest.spyOn(prisma.company, "findUnique").mockResolvedValue({ id: "company-uuid-1", name: "Empresa X" } as any);
	});

	describe("create", () => {
		it("should create an employee when company exists", async () => {
			const dto: CreateEmployeeDto = {
				fullName: "João Silva",
				email: "joao.silva@example.com",
				cpf: "12345678900",
				salary: 3000,
				currentlyEmployed: true,
				companyId: "company-uuid-1",
			};

			const result = await service.create(dto);

			expect(result).toEqual(mockEmployee);
			expect(prisma.company.findUnique).toHaveBeenCalledWith({ where: { id: dto.companyId } });
			expect(prisma.employee.create).toHaveBeenCalledWith({
				data: {
					fullName: dto.fullName,
					email: dto.email,
					cpf: dto.cpf,
					salary: dto.salary,
					currentlyEmployed: dto.currentlyEmployed,
					companyId: dto.companyId,
				},
			});
		});

		it("should throw NotFoundException when company does not exist", async () => {
			jest.spyOn(prisma.company, "findUnique").mockResolvedValueOnce(null);

			const dto: CreateEmployeeDto = {
				fullName: "João Silva",
				email: "joao.silva@example.com",
				cpf: "12345678900",
				salary: 3000,
				currentlyEmployed: true,
				companyId: "non-existent-company",
			};

			await expect(service.create(dto)).rejects.toThrow(NotFoundException);
		});
	});

	describe("findAll", () => {
		it("should return a list of employees", async () => {
			const result = await service.findAll();

			expect(result).toEqual([mockEmployee]);
			expect(prisma.employee.findMany).toHaveBeenCalledWith({
				where: { deletedAt: null },
				include: { company: true, proposals: true },
			});
		});
	});

	describe("findOne", () => {
		it("should return an employee by ID", async () => {
			const result = await service.findOne("123e4567-e89b-12d3-a456-426614174000");

			expect(result).toEqual(mockEmployee);
			expect(prisma.employee.findFirst).toHaveBeenCalledWith({
				where: { id: "123e4567-e89b-12d3-a456-426614174000", deletedAt: null },
				include: { company: true, proposals: true },
			});
		});

		it("should throw NotFoundException if employee not found", async () => {
			jest.spyOn(prisma.employee, "findFirst").mockResolvedValueOnce(null);

			await expect(service.findOne("non-existent-id")).rejects.toThrow(NotFoundException);
		});
	});

	describe("update", () => {
		it("should update an employee", async () => {
			const dto: UpdateEmployeeDto = {
				fullName: "João Souza",
				salary: 3500,
			};

			jest.spyOn(prisma.company, "findUnique").mockResolvedValue({ id: "company-uuid-1" } as any);

			const updatedEmployee = { ...mockEmployee, ...dto };
			jest.spyOn(prisma.employee, "update").mockResolvedValueOnce(updatedEmployee as any);

			const result = await service.update("123e4567-e89b-12d3-a456-426614174000", dto);

			expect(result).toEqual(updatedEmployee);
			expect(prisma.company.findUnique).toHaveBeenCalledWith({ where: { id: undefined } }); // if dto.companyId is undefined, this might get called or not, so you may adjust
			expect(prisma.employee.update).toHaveBeenCalledWith({
				where: { id: "123e4567-e89b-12d3-a456-426614174000" },
				data: dto,
			});
		});

		it("should throw NotFoundException if companyId in update dto does not exist", async () => {
			jest.spyOn(prisma.company, "findUnique").mockResolvedValueOnce(null);

			const dto: UpdateEmployeeDto = { companyId: "non-existent-company" };

			await expect(service.update("123e4567-e89b-12d3-a456-426614174000", dto)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("remove", () => {
		it("should soft delete an employee", async () => {
			const deletedEmployee = { ...mockEmployee, deletedAt: new Date() };
			jest.spyOn(prisma.employee, "update").mockResolvedValueOnce(deletedEmployee as any);

			const result = await service.remove("123e4567-e89b-12d3-a456-426614174000");

			expect(result).toEqual(deletedEmployee);
			expect(prisma.employee.update).toHaveBeenCalledWith({
				where: { id: "123e4567-e89b-12d3-a456-426614174000" },
				data: { deletedAt: expect.any(Date) },
			});
		});
	});
});
