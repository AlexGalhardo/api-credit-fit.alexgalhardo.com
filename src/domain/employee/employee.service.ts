import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RepositoryService } from "../../repository/repository.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { createEmployeeSchema } from "./schema/create-employee.schema";
import { updateEmployeeSchema } from "./schema/update-employee.schema";

@Injectable()
export class EmployeeService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: CreateEmployeeDto) {
		try {
			const data = createEmployeeSchema.parse(dto);

			if (data.companyCnpj) {
				const companyExists = await this.repository.company.findUnique({
					where: { cnpj: data.companyCnpj },
				});
				if (!companyExists) {
					throw new NotFoundException("Company not found.");
				}
			} else {
				data.currentlyEmployed = false;
			}

			const employee = await this.repository.employee.create({
				data: {
					fullName: data.fullName,
					email: data.email,
					cpf: data.cpf,
					salary: data.salary,
					currentlyEmployed: data.currentlyEmployed,
					companyCnpj: data.companyCnpj,
				},
			});

			return employee;
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					const fields = (error.meta?.target as string[]) || [];
					const messages = fields.map((field) => `${field} already registered`);
					throw new BadRequestException({
						success: false,
						message: messages.join(", "),
					});
				}
			}

			throw new BadRequestException({
				success: false,
				message: error?.message ?? "Unexpected error while creating employee",
			});
		}
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

		if (data.companyCnpj) {
			const companyExists = await this.repository.company.findUnique({
				where: { id: data.companyCnpj },
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
