import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

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
	cpf: string;

	@ApiProperty({
		example: 500000,
		description: "Salary of the employee (in cents)",
	})
	@IsNumber()
	salary: number;

	@ApiProperty({
		example: true,
		description: "Whether the employee is currently employed",
		default: false,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	currentlyEmployed?: boolean;

	@ApiProperty({
		example: "a857c5db-7f67-4cf0-9c7c-2b3f9c7e4a4b",
		description: "Optional company ID the employee is associated with",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	companyId?: string;
}
