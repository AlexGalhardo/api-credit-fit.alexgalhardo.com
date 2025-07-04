import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CustomLogger } from "../../utils/custom-logger";
import { getErrorMessage, getErrorStack } from "../../utils/functions";
import { ProposalService } from "./proposal.service";

@Controller("proposals")
export class ProposalController {
	private readonly logger = new CustomLogger();

	constructor(private readonly proposalService: ProposalService) {}

	@Post()
	async create(@Body() dto: any) {
		try {
			return await this.proposalService.create(dto);
		} catch (error: unknown) {
			this.logger.error("Error creating proposal: ", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while creating proposal",
			});
		}
	}

	@Get()
	async findAll() {
		try {
			const result = await this.proposalService.findAll();
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error("Error fetching proposals", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while fetching proposals",
			});
		}
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		try {
			const result = await this.proposalService.findOne(id);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error fetching proposal with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while fetching proposal with id ${id}`,
			});
		}
	}

	@Put(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: Partial<{ status: "APPROVED" | "REJECTED"; installmentsPaid: number }>,
	) {
		try {
			const result = await this.proposalService.update(id, dto);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error updating proposal with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while updating proposal with id ${id}`,
			});
		}
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		try {
			const result = await this.proposalService.remove(id);
			return { success: true, data: result };
		} catch (error: unknown) {
			this.logger.error(`Error removing proposal with id ${id}`, getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || `Unknown error while removing proposal with id ${id}`,
			});
		}
	}
}
