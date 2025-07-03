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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const repository_service_1 = require("../../repository/repository.service");
const create_employee_schema_1 = require("./schema/create-employee.schema");
const update_employee_schema_1 = require("./schema/update-employee.schema");
let EmployeeService = class EmployeeService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            const data = create_employee_schema_1.createEmployeeSchema.parse(dto);
            if (data.companyCnpj) {
                const companyExists = await this.repository.company.findUnique({
                    where: {
                        cnpj: data.companyCnpj,
                        deletedAt: null,
                    },
                });
                if (!companyExists) {
                    throw new common_1.NotFoundException("Company not found.");
                }
            }
            else {
                data.currentlyEmployed = false;
            }
            const employeeData = {
                fullName: data.fullName,
                email: data.email,
                cpf: data.cpf,
                salary: data.salary,
                currentlyEmployed: data.currentlyEmployed,
            };
            if (data.companyCnpj) {
                employeeData.companyCnpj = data.companyCnpj;
            }
            const employee = await this.repository.employee.create({
                data: employeeData,
            });
            return employee;
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
                message: error?.message ?? "Unexpected error while creating employee",
            });
        }
    }
    async findAll() {
        return await this.repository.employee.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cnpj: true,
                        legalName: true,
                    },
                },
                proposals: {
                    select: {
                        id: true,
                        status: true,
                        totalLoanAmount: true,
                        numberOfInstallments: true,
                        installmentAmount: true,
                        firstDueDate: true,
                        installmentsPaid: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const employee = await this.repository.employee.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cnpj: true,
                        legalName: true,
                    },
                },
                proposals: {
                    select: {
                        id: true,
                        status: true,
                        totalLoanAmount: true,
                        numberOfInstallments: true,
                        installmentAmount: true,
                        firstDueDate: true,
                        installmentsPaid: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!employee)
            throw new common_1.NotFoundException("Employee not found");
        return employee;
    }
    async update(id, dto) {
        const data = update_employee_schema_1.updateEmployeeSchema.parse(dto);
        if (data.companyCnpj) {
            const companyExists = await this.repository.company.findUnique({
                where: {
                    cnpj: data.companyCnpj,
                    deletedAt: null,
                },
            });
            if (!companyExists) {
                throw new common_1.NotFoundException("Company not found.");
            }
        }
        return await this.repository.employee.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return await this.repository.employee.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map