import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
	@ApiProperty({
		example: "email@gmail.com",
		description: "The email address to login",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "Password to login",
	})
	@IsString()
	password: string;
}
