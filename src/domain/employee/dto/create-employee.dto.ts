import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { IsCnpj } from "../../../utils/isCnpj";
import { IsCpf } from "../../../utils/isCpf";

export class CreateEmployeeDto {
	@ApiProperty({
		example: "João da Silva",
		description: "Full name of the employee",
	})
	@IsString()
	fullName: string;

	@ApiProperty({
		example: "joao.silva@gmail.com",
		description: "Email address of the employee",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "123.456.789-00",
		description: "CPF of the employee",
	})
	@IsString()
	@IsCpf({ message: "CPF inválido" })
	cpf: string;

	@ApiProperty({
		example: 500000,
		description: "Salary of the employee (in cents)",
	})
	@IsNumber()
	salary: number;

	@ApiProperty({
		example: true,
		description: "Whether the employee is currently employed (default false if no companyCnpj)",
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	currentlyEmployed?: boolean;

	@ApiProperty({
		example: "12.345.678/0001-90",
		description: "Optional CNPJ of the company the employee is associated with",
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsCnpj({ message: "CNPJ inválido" })
	companyCnpj?: string;
}
