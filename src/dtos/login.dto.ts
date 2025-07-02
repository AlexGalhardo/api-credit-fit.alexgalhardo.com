import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
	@ApiProperty({
		example: "employee@gmail.com",
		description: "The employee email address to login",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "User password",
	})
	@IsString()
	password: string;
}
