"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const database_service_1 = require("./services/database.service");
const seeder_service_1 = require("./services/seeder.service");
const prisma = new client_1.PrismaClient();
async function main() {
    const databaseService = new database_service_1.DatabaseService(prisma);
    const seederService = new seeder_service_1.SeederService(databaseService);
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
//# sourceMappingURL=seed.js.map