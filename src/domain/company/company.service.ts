import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RepositoryService } from "../../repository/repository.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { createCompanySchema } from "./schema/create-company.schema";
import { updateCompanySchema } from "./schema/update-company.schema";
import { ZodError } from "zod";

@Injectable()
export class CompanyService {
	constructor(private readonly repository: RepositoryService) {}

	async create(dto: CreateCompanyDto) {
		try {
			const parsed = createCompanySchema.parse(dto);
			return await this.repository.company.create({ data: parsed});
		} catch (err: unknown) {
			if (err instanceof ZodError) {
				throw new BadRequestException(
					err.errors.map((e) => ({
						path: e.path.join("."),
						message: e.message,
					})),
				);
			}
			throw err;
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

		if (!data.cpf) delete data.cpf;
		if (!data.cnpj) delete data.cnpj;

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
