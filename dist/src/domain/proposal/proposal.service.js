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
exports.ProposalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const repository_service_1 = require("../../repository/repository.service");
const create_proposal_schema_1 = require("./schema/create-proposal.schema");
let ProposalService = class ProposalService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async verifyEmployeeCreditScore(employeeCpf) {
        try {
            const response = await fetch("https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf");
            const { score } = await response.json();
            return score;
        }
        catch (error) {
            throw new common_1.BadRequestException({
                success: false,
                message: error?.message ?? "Não foi possível verificar o score de crédito do empregado",
            });
        }
    }
    verifyIfEmployeeCreditScoreIsEnoughToApproveLoan(employeeCreditScore, employeeSalary) {
        if (employeeSalary <= 200000)
            return employeeCreditScore >= 400;
        if (employeeSalary <= 400000)
            return employeeCreditScore >= 500;
        if (employeeSalary <= 800000)
            return employeeCreditScore >= 600;
        if (employeeSalary <= 1200000)
            return employeeCreditScore >= 700;
        return false;
    }
    async create(dto) {
        try {
            const data = create_proposal_schema_1.createProposalSchema.parse(dto);
            const company = await this.repository.company.findUnique({
                where: {
                    cnpj: data.companyCnpj,
                    deletedAt: null,
                },
            });
            if (!company)
                throw new common_1.NotFoundException(`Empresa não encontrada com CNPJ ${data.companyCnpj}`);
            const employee = await this.repository.employee.findUnique({
                where: {
                    cpf: data.employeeCpf,
                    deletedAt: null,
                },
            });
            if (!employee)
                throw new common_1.NotFoundException(`Empregado não encontrado com CPF ${data.employeeCpf}`);
            const employeeCreditScore = await this.verifyEmployeeCreditScore(employee.cpf);
            const approveLoan = this.verifyIfEmployeeCreditScoreIsEnoughToApproveLoan(employeeCreditScore, employee.salary);
            const proposalStatus = approveLoan ? client_1.ProposalStatus.APPROVED : client_1.ProposalStatus.REJECTED;
            const existingProposal = await this.repository.proposal.findFirst({
                where: {
                    companyCnpj: data.companyCnpj,
                    employeeCpf: data.employeeCpf,
                    totalLoanAmount: data.totalLoanAmount,
                    numberOfInstallments: data.numberOfInstallments,
                    status: proposalStatus,
                    employeeCreditScore,
                    deletedAt: null,
                },
                include: {
                    company: {
                        select: {
                            name: true,
                            email: true,
                            cnpj: true,
                            legalName: true,
                        },
                    },
                    employee: {
                        select: {
                            fullName: true,
                            email: true,
                            cpf: true,
                        },
                    },
                },
            });
            if (existingProposal) {
                return approveLoan
                    ? { success: true, data: existingProposal }
                    : {
                        success: false,
                        message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
                    };
            }
            const proposal = await this.repository.proposal.create({
                data: {
                    status: proposalStatus,
                    companyCnpj: data.companyCnpj,
                    employeeCpf: data.employeeCpf,
                    totalLoanAmount: data.totalLoanAmount,
                    numberOfInstallments: data.numberOfInstallments,
                    installmentAmount: Math.floor(data.totalLoanAmount / data.numberOfInstallments),
                    firstDueDate: (0, date_fns_1.addDays)(new Date(), 30),
                    installmentsPaid: 0,
                    companyName: company.name,
                    employerEmail: employee.email,
                    employeeCreditScore,
                },
                include: approveLoan
                    ? {
                        company: {
                            select: {
                                name: true,
                                email: true,
                                cnpj: true,
                                legalName: true,
                            },
                        },
                        employee: {
                            select: {
                                fullName: true,
                                email: true,
                                cpf: true,
                            },
                        },
                    }
                    : undefined,
            });
            return approveLoan
                ? { success: true, data: proposal }
                : {
                    success: false,
                    message: "Score de crédito do empregado insuficiente para aprovação do empréstimo",
                };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    const fields = error.meta?.target || [];
                    const messages = fields.map((field) => `${field} já registrado`);
                    throw new common_1.BadRequestException({
                        success: false,
                        message: messages.join(", "),
                    });
                }
            }
            throw new common_1.BadRequestException({
                success: false,
                message: error?.message ?? "Erro inesperado ao criar proposta",
            });
        }
    }
    async findAll() {
        return await this.repository.proposal.findMany({
            where: { deletedAt: null },
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
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        cpf: true,
                        salary: true,
                        currentlyEmployed: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        return await this.repository.proposal.findFirst({
            where: { id, deletedAt: null },
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
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        cpf: true,
                        salary: true,
                        currentlyEmployed: true,
                    },
                },
            },
        });
    }
    async update(id, dto) {
        return await this.repository.proposal.update({
            where: { id },
            data: {
                ...dto,
            },
        });
    }
    async remove(id) {
        return await this.repository.proposal.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.ProposalService = ProposalService;
exports.ProposalService = ProposalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService])
], ProposalService);
//# sourceMappingURL=proposal.service.js.map