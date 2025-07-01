import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CustomLogger } from "../../utils/customer-logger";
import { getErrorMessage, getErrorStack } from "../../utils/functions";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyService } from "./company.service";

@Controller("companies")
export class CompanyController {
	private readonly logger = new CustomLogger();

	constructor(private readonly companyService: CompanyService) {}

	@Post()
	async create(@Body() dto: CreateCompanyDto) {
		try {
			const result = await this.companyService.create(dto);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error("Error creating company", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while creating company",
			});
		}
	}

	@Get()
	async findAll() {
		try {
			const result = await this.companyService.findAll();
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error("Error fetching companies", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while fetching companies",
			});
		}
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		try {
			const result = await this.companyService.findOne(id);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error fetching company with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while fetching company with id ${id}`,
			});
		}
	}

	@Put(":id")
	async update(@Param("id") id: string, @Body() dto: UpdateCompanyDto) {
		try {
			const result = await this.companyService.update(id, dto);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error updating company with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while updating company with id ${id}`,
			});
		}
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		try {
			const result = await this.companyService.remove(id);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error removing company with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while removing company with id ${id}`,
			});
		}
	}
}
