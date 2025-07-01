import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsCnpj } from "../../../utils/isCnpj";
import { IsCpf } from "../../../utils/isCpf";

export class CreateProposalDto {
	@ApiProperty({
		example: "12.345.678/0001-00",
		description: "CNPJ of the company requesting the loan",
	})
	@IsString()
	@IsCnpj({ message: "CNPJ inválido" })
	companyCnpj: string;

	@ApiProperty({
		example: "123.456.789-00",
		description: "CPF of the employee receiving the loan",
	})
	@IsString()
	@IsCpf({ message: "CPF inválido" })
	employeeCpf: string;

	@ApiProperty({
		example: "100000",
		description: "Total loan amount in cents (min: 100000, max: 2000000)",
	})
	@IsString()
	totalLoanAmount: string;

	@ApiProperty({
		example: "4",
		description: "Number of installments (1 to 10)",
	})
	@IsString()
	numberOfInstallments: string;
}
