"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RepositoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let RepositoryService = RepositoryService_1 = class RepositoryService extends client_1.PrismaClient {
    logger = new common_1.Logger(RepositoryService_1.name);
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
        }
        catch (error) {
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
};
exports.RepositoryService = RepositoryService;
exports.RepositoryService = RepositoryService = RepositoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RepositoryService);
//# sourceMappingURL=repository.service.js.map