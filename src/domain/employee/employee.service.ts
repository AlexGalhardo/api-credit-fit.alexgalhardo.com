import { Injectable, NotFoundException } from "@nestjs/common";
import { RepositoryService } from "../../repository/repository.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { createEmployeeSchema } from "./schema/create-employee.schema";
import { updateEmployeeSchema } from "./schema/update-employee.schema";

@Injectable()
export class EmployeeService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: CreateEmployeeDto) {
		const data = createEmployeeSchema.parse(dto);

		if (data.companyId) {
			const companyExists = await this.repository.company.findUnique({
				where: { id: data.companyId },
			});
			if (!companyExists) {
				throw new NotFoundException("Company not found.");
			}
		}

		const employee = await this.repository.employee.create({
			data: {
				fullName: data.fullName,
				email: data.email,
				cpf: data.cpf,
				salary: data.salary,
				currentlyEmployed: data.currentlyEmployed ?? false,
				companyId: data.companyId ?? null,
			},
		});

		return employee;
	}

	async findAll() {
		return await this.repository.employee.findMany({
			where: {
				deletedAt: null,
			},
			include: {
				company: true,
				proposals: true,
			},
		});
	}

	async findOne(id: string) {
		const employee = await this.repository.employee.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				company: true,
				proposals: true,
			},
		});

		if (!employee) throw new NotFoundException("Employee not found");
		return employee;
	}

	async update(id: string, dto: UpdateEmployeeDto) {
		const data = updateEmployeeSchema.parse(dto);

		if (data.companyId) {
			const companyExists = await this.repository.company.findUnique({
				where: { id: data.companyId },
			});
			if (!companyExists) {
				throw new NotFoundException("Company not found.");
			}
		}

		return await this.repository.employee.update({
			where: { id },
			data,
		});
	}

	async remove(id: string) {
		return await this.repository.employee.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});
	}
}
