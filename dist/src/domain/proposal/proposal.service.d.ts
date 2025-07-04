import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
export declare class ProposalService {
    private readonly repository;
    constructor(repository: RepositoryService);
    private verifyEmployeeCreditScore;
    private verifyIfEmployeeCreditScoreIsEnoughToApproveLoan;
    create(dto: CreateProposalDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyCnpj: string;
            status: string;
            employeeCpf: string;
            totalLoanAmount: number;
            numberOfInstallments: number;
            installmentAmount: number;
            firstDueDate: Date;
            installmentsPaid: number;
            companyName: string;
            employerEmail: string;
            employeeCreditScore: number;
        };
        message?: undefined;
    }>;
    findAll(): Promise<({
        company: {
            name: string;
            id: string;
            email: string;
            cnpj: string;
            legalName: string;
        };
        employee: {
            id: string;
            email: string;
            cpf: string;
            fullName: string;
            salary: number;
            currentlyEmployed: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        companyCnpj: string;
        status: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
        employeeCreditScore: number;
    })[]>;
    findOne(id: string): Promise<({
        company: {
            name: string;
            id: string;
            email: string;
            cnpj: string;
            legalName: string;
        };
        employee: {
            id: string;
            email: string;
            cpf: string;
            fullName: string;
            salary: number;
            currentlyEmployed: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        companyCnpj: string;
        status: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
        employeeCreditScore: number;
    }) | null>;
    update(id: string, dto: Partial<{
        status: "APPROVED" | "REJECTED";
        installmentsPaid: number;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        companyCnpj: string;
        status: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
        employeeCreditScore: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        companyCnpj: string;
        status: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
        employeeCreditScore: number;
    }>;
}
