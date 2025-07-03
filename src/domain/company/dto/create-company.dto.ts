import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { IsCnpj } from "../../../utils/is-cnpj";
import { IsCpf } from "../../../utils/is-cpf";

export class CreateCompanyDto {
	@ApiProperty({
		example: "Green Valley Ltda",
		description: "The legal name of the company",
	})
	@IsString()
	@Length(3, 100)
	legalName: string;

	@ApiProperty({
		example: "Green Valley",
		description: "The display name of the company",
	})
	@IsString()
	@Length(1, 100)
	name: string;

	@ApiProperty({
		example: "contact@greenvalley.com",
		description: "The company's email address",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "123.456.789-00",
		description: "The company's CPF number (if individual)",
	})
	@IsString()
	@IsCpf()
	cpf: string;

	@ApiProperty({
		example: "12.345.678/0001-90",
		description: "The company's CNPJ number (if legal entity)",
	})
	@IsString()
	@IsCnpj()
	cnpj: string;
}
