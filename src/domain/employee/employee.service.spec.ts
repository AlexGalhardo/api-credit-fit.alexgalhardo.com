import { randomUUID } from "node:crypto";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { RepositoryService } from "../../repository/repository.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";

describe("EmployeeService", () => {
	let service: EmployeeService;
	let prisma: jest.Mocked<RepositoryService>;

	const validCpf = cpf.generate();
	const companyId = randomUUID();
	const companyCpf = cpf.generate();
	const companyCnpj = cnpj.generate();

	const mockCompany = {
		id: companyId,
		name: "Empresa Teste",
		email: "empresa@test.com",
		cpf: companyCpf,
		cnpj: companyCnpj,
		legalName: "Empresa Teste Ltda",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	const mockEmployee = {
		id: randomUUID(),
		fullName: "João Silva",
		email: "joao.silva@example.com",
		cpf: validCpf,
		salary: 350000,
		currentlyEmployed: true,
		companyId: companyId,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		company: mockCompany,
		proposals: [],
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
					},
				},
			],
		}).compile();

		service = module.get<EmployeeService>(EmployeeService);
		prisma = module.get(RepositoryService);

		jest.clearAllMocks();

		(prisma.employee.create as jest.Mock).mockResolvedValue(mockEmployee);
		(prisma.employee.findMany as jest.Mock).mockResolvedValue([mockEmployee]);
		(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee);
		(prisma.employee.update as jest.Mock).mockResolvedValue(mockEmployee);
		(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany);
	});

	describe("create", () => {
		it("should create an employee when company exists", async () => {
			const dto: CreateEmployeeDto = {
				fullName: "João Silva",
				email: "joao.silva@example.com",
				cpf: validCpf,
				salary: 350000,
				currentlyEmployed: true,
				companyCnpj: companyCnpj,
			};

			const result = await service.create(dto);

			expect(result).toEqual(mockEmployee);
			expect(prisma.company.findUnique).toHaveBeenCalledWith({
				where: { cnpj: dto.companyCnpj },
			});
			expect(prisma.employee.create).toHaveBeenCalledWith({
				data: {
					fullName: dto.fullName,
					email: dto.email,
					cpf: dto.cpf,
					salary: dto.salary,
					currentlyEmployed: dto.currentlyEmployed,
					companyCnpj: dto.companyCnpj,
				},
			});
		});

		it("should create an employee without company", async () => {
			const dto: CreateEmployeeDto = {
				fullName: "Maria Santos",
				email: "maria.santos@example.com",
				cpf: cpf.generate(),
				salary: 250000,
				currentlyEmployed: false,
			};

			const employeeWithoutCompany = {
				...mockEmployee,
				companyId: null,
				company: null,
				currentlyEmployed: false,
				salary: 250000,
			};
			(prisma.employee.create as jest.Mock).mockResolvedValueOnce(employeeWithoutCompany);

			const result = await service.create(dto);

			expect(result).toEqual(employeeWithoutCompany);
			expect(prisma.company.findUnique).not.toHaveBeenCalled();
			expect(prisma.employee.create).toHaveBeenCalledWith({
				data: {
					fullName: dto.fullName,
					email: dto.email,
					cpf: dto.cpf,
					salary: dto.salary,
					currentlyEmployed: false,
					companyCnpj: dto.companyCnpj,
				},
			});
		});

		it("should throw BadRequestException when company does not exist", async () => {
			(prisma.company.findUnique as jest.Mock).mockResolvedValueOnce(null);

			const dto: CreateEmployeeDto = {
				fullName: "João Silva",
				email: "joao.silva@example.com",
				cpf: cpf.generate(),
				salary: 300000,
				currentlyEmployed: true,
				companyCnpj: cnpj.generate(),
			};

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
			expect(prisma.company.findUnique).toHaveBeenCalledWith({
				where: { cnpj: dto.companyCnpj },
			});
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
			const result = await service.findOne(mockEmployee.id);

			expect(result).toEqual(mockEmployee);
			expect(prisma.employee.findFirst).toHaveBeenCalledWith({
				where: { id: mockEmployee.id, deletedAt: null },
				include: { company: true, proposals: true },
			});
		});
	});

	describe("update", () => {
		it("should update an employee without changing company", async () => {
			const dto: UpdateEmployeeDto = {
				fullName: "João Souza",
				salary: 400000,
			};

			const updatedEmployee = { ...mockEmployee, ...dto };
			(prisma.employee.update as jest.Mock).mockResolvedValueOnce(updatedEmployee);

			const result = await service.update(mockEmployee.id, dto);

			expect(result).toEqual(updatedEmployee);
			expect(prisma.company.findUnique).not.toHaveBeenCalled();
			expect(prisma.employee.update).toHaveBeenCalledWith({
				where: { id: mockEmployee.id },
				data: dto,
			});
		});

		it("should update an employee with valid company", async () => {
			const newCompanyCnpj = cnpj.generate();
			const dto: UpdateEmployeeDto = {
				fullName: "João Souza",
				companyCnpj: newCompanyCnpj,
			};

			const newCompany = { ...mockCompany, cnpj: newCompanyCnpj };
			(prisma.company.findUnique as jest.Mock).mockResolvedValueOnce(newCompany);

			const updatedEmployee = { ...mockEmployee, ...dto };
			(prisma.employee.update as jest.Mock).mockResolvedValueOnce(updatedEmployee);

			const result = await service.update(mockEmployee.id, dto);

			expect(result).toEqual(updatedEmployee);
			expect(prisma.company.findUnique).toHaveBeenCalledWith({
				where: { id: newCompanyCnpj },
			});
			expect(prisma.employee.update).toHaveBeenCalledWith({
				where: { id: mockEmployee.id },
				data: dto,
			});
		});
	});

	describe("remove", () => {
		it("should soft delete an employee", async () => {
			const deletedEmployee = { ...mockEmployee, deletedAt: new Date() };
			(prisma.employee.update as jest.Mock).mockResolvedValueOnce(deletedEmployee);

			const result = await service.remove(mockEmployee.id);

			expect(result).toEqual(deletedEmployee);
			expect(prisma.employee.update).toHaveBeenCalledWith({
				where: { id: mockEmployee.id },
				data: { deletedAt: expect.any(Date) },
			});
		});
	});
});
