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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const repository_service_1 = require("../../repository/repository.service");
const create_company_schema_1 = require("./schema/create-company.schema");
const update_company_schema_1 = require("./schema/update-company.schema");
let CompanyService = class CompanyService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            const parsed = create_company_schema_1.createCompanySchema.parse(dto);
            return await this.repository.company.create({ data: parsed });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    const fields = error.meta?.target || [];
                    const messages = fields.map((field) => `${field} already registered`);
                    throw new common_1.BadRequestException({
                        success: false,
                        message: messages.join(", "),
                    });
                }
            }
            throw new common_1.BadRequestException({
                success: false,
                message: error?.message,
            });
        }
    }
    async findAll() {
        return await this.repository.company.findMany({
            where: { deletedAt: null },
            include: {
                employees: true,
                proposals: true,
            },
        });
    }
    async findOne(id) {
        const company = await this.repository.company.findFirst({
            where: { id, deletedAt: null },
            include: {
                employees: true,
                proposals: true,
            },
        });
        if (!company)
            throw new common_1.NotFoundException("Company not found");
        return company;
    }
    async update(id, dto) {
        const parsed = update_company_schema_1.updateCompanySchema.parse(dto);
        const data = {
            ...parsed,
            cpf: parsed.cpf || undefined,
            cnpj: parsed.cnpj || undefined,
        };
        if (!data.cpf)
            data.cpf = undefined;
        if (!data.cnpj)
            data.cnpj = undefined;
        return await this.repository.company.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return await this.repository.company.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService])
], CompanyService);
//# sourceMappingURL=company.service.js.map