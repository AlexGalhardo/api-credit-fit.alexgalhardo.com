import { PrismaClient } from "@prisma/client";
import { DatabaseService } from "./services/database.service";
import { SeederService } from "./services/seeder.service";

const prisma = new PrismaClient();

async function main() {
	const databaseService = new DatabaseService(prisma);
	const seederService = new SeederService(databaseService);

	await seederService.seedAll();
}

main()
	.catch((error) => {
		console.error("Error running database seed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
