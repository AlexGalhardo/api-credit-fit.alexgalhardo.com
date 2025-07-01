import { randomUUID } from "node:crypto";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";

describe("EmployeeController", () => {
	let controller: EmployeeController;

	const mockEmployeeService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EmployeeController],
			providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
		}).compile();

		controller = module.get<EmployeeController>(EmployeeController);
	});

	afterEach(() => jest.clearAllMocks());

	it("should create an employee and return success response", async () => {
		const dto: CreateEmployeeDto = {
			fullName: "João Silva",
			email: "joao.silva@example.com",
			cpf: "12345678900",
			salary: 3000,
			currentlyEmployed: true,
			companyId: randomUUID(),
		};
		const createdEmployee = { id: randomUUID(), ...dto };

		mockEmployeeService.create.mockResolvedValue(createdEmployee);

		const response = await controller.create(dto);
		expect(response).toEqual({ success: true, data: createdEmployee });

		expect(mockEmployeeService.create).toHaveBeenCalledWith(dto);
	});

	it("should return all employees", async () => {
		const employees = [
			{
				id: randomUUID(),
				fullName: "Maria Souza",
				email: "maria.souza@example.com",
				cpf: "98765432100",
				salary: 4000,
				currentlyEmployed: true,
				companyId: randomUUID(),
			},
		];
		mockEmployeeService.findAll.mockResolvedValue(employees);

		const response = await controller.findAll();
		expect(response).toEqual({ success: true, data: employees });

		expect(mockEmployeeService.findAll).toHaveBeenCalled();
	});

	it("should return a single employee by id", async () => {
		const employee = {
			id: "employee-uuid-1",
			fullName: "Carlos Pereira",
			email: "carlos.pereira@example.com",
			cpf: "12312312399",
			salary: 3500,
			currentlyEmployed: false,
			companyId: randomUUID(),
		};
		mockEmployeeService.findOne.mockResolvedValue(employee);

		const response = await controller.findOne("employee-uuid-1");
		expect(response).toEqual({ success: true, data: employee });

		expect(mockEmployeeService.findOne).toHaveBeenCalledWith("employee-uuid-1");
	});

	it("should update an employee", async () => {
		const dto: UpdateEmployeeDto = { fullName: "Carlos P." };
		const updatedEmployee = {
			id: "employee-uuid-1",
			fullName: "Carlos P.",
			email: "carlos.pereira@example.com",
			cpf: "12312312399",
			salary: 3500,
			currentlyEmployed: false,
			companyId: randomUUID(),
		};

		mockEmployeeService.update.mockResolvedValue(updatedEmployee);

		const response = await controller.update("employee-uuid-1", dto);
		expect(response).toEqual({ success: true, data: updatedEmployee });

		expect(mockEmployeeService.update).toHaveBeenCalledWith("employee-uuid-1", dto);
	});

	it("should delete an employee", async () => {
		const deletedEmployee = {
			id: "employee-uuid-1",
			fullName: "To Be Deleted",
			email: "tobedeleted@example.com",
			cpf: "00000000000",
			salary: 0,
			currentlyEmployed: false,
			companyId: randomUUID(),
		};
		mockEmployeeService.remove.mockResolvedValue(deletedEmployee);

		const response = await controller.remove("employee-uuid-1");
		expect(response).toEqual({ success: true, data: deletedEmployee });

		expect(mockEmployeeService.remove).toHaveBeenCalledWith("employee-uuid-1");
	});
});
