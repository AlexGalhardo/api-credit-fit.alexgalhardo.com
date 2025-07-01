import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class RepositoryService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RepositoryService.name);

	constructor() {
		super({
			log: ["query", "info", "warn", "error"],
			errorFormat: "minimal",
		});
		this.logger.log("RepositoryService initialized");
	}

	async onModuleInit() {
		this.logger.log("Connecting to database...");
		try {
			await this.$connect();
			this.logger.log("Connected to database");
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.logger.error(`Failed to connect to database: ${errorMessage}`);
			throw error;
		}
	}

	async onModuleDestroy() {
		this.logger.log("Disconnecting from database...");
		await this.$disconnect();
		this.logger.log("Disconnected from database");
	}
}
