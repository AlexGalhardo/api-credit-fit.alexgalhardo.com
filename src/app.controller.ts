import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { CustomLogger } from "./utils/customer-logger";
import { getErrorMessage, getErrorStack } from "./utils/functions";
import { LoginDto } from "./dtos/login.dto";

@Controller()
export class AppController {
	private readonly logger = new CustomLogger();

	constructor(private readonly appService: AppService) {}

	@Get("/")
	async getDashboard() {
		try {
			return await this.appService.index();
		} catch (error: unknown) {
			this.logger.error("Error fetching dashboard", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while fetching dashboard",
			});
		}
	}

	@Post("/login")
	async login(@Body() dto: LoginDto) {
		try {
			const { id, name, email, role } = await this.appService.login(dto);
			if (!id || !name || !email || !role) return { success: false, error: "Invalid credentials" };
			return { success: true, data: { id, name, email, role } };
		} catch (error: unknown) {
			this.logger.error("Error logging in", getErrorStack(error));
			throw new BadRequestException({
				success: false,
				error: getErrorMessage(error) || "Unknown error while logging in",
			});
		}
	}
}
