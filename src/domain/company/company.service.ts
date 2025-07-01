import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RepositoryService } from "../../repository/repository.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { createCompanySchema } from "./schema/create-company.schema";
import { updateCompanySchema } from "./schema/update-company.schema";

@Injectable()
export class CompanyService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: CreateCompanyDto) {
		try {
			const parsed = createCompanySchema.parse(dto);
			return await this.repository.company.create({ data: parsed });
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
				message: error?.message,
			});
		}
	}

	async findAll() {
		return await this.repository.company.findMany({
			where: { deletedAt: null },
			include: {
				employers: true,
				proposals: true,
			},
		});
	}

	async findOne(id: string) {
		const company = await this.repository.company.findFirst({
			where: { id, deletedAt: null },
			include: {
				employers: true,
				proposals: true,
			},
		});

		if (!company) throw new NotFoundException("Company not found");
		return company;
	}

	async update(id: string, dto: UpdateCompanyDto) {
		const parsed = updateCompanySchema.parse(dto);

		const data = {
			...parsed,
			cpf: parsed.cpf || undefined,
			cnpj: parsed.cnpj || undefined,
		};

		if (!data.cpf) data.cpf = undefined;
		if (!data.cnpj) data.cnpj = undefined;

		return await this.repository.company.update({
			where: { id },
			data,
		});
	}

	async remove(id: string) {
		return await this.repository.company.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});
	}
}
