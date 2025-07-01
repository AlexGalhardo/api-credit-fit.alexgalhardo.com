import { ApiPropertyOptional } from "@nestjs/swagger";
import { ProposalStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateProposalDto {
	@ApiPropertyOptional({ enum: ProposalStatus, example: "approved" })
	@IsOptional()
	@IsEnum(ProposalStatus)
	status?: ProposalStatus;

	@ApiPropertyOptional({ example: 1, description: "Number of installments paid" })
	@IsOptional()
	@IsNumber()
	@Min(0)
	installmentsPaid?: number;
}
