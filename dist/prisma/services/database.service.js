"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const seed_constants_1 = require("../../src/utils/seed-constants");
class DatabaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async clearSeedData() {
        await this.prisma.proposal.deleteMany({
            where: {
                companyName: {
                    startsWith: seed_constants_1.SEED_PREFIX,
                },
            },
        });
        await this.prisma.employee.deleteMany({
            where: {
                fullName: {
                    startsWith: seed_constants_1.SEED_PREFIX,
                },
            },
        });
        await this.prisma.company.deleteMany({
            where: {
                name: {
                    startsWith: seed_constants_1.SEED_PREFIX,
                },
            },
        });
    }
    async createCompany(data) {
        return await this.prisma.company.create({ data });
    }
    async createEmployee(data) {
        const employee = await this.prisma.employee.create({ data });
        return {
            ...employee,
            companyCnpj: employee.companyCnpj ?? "",
        };
    }
    async createProposal(data) {
        await this.prisma.proposal.create({ data });
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map