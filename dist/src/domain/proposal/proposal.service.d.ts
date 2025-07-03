import { RepositoryService } from "../../repository/repository.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
export declare class ProposalService {
    private readonly repository;
    constructor(repository: RepositoryService);
    create(dto: CreateProposalDto): Promise<{
        company: {
            name: string;
            email: string;
            cnpj: string;
            legalName: string;
        };
        employee: {
            email: string;
            cpf: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        companyCnpj: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
    }>;
    findAll(): Promise<({
        company: {
            id: string;
            name: string;
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
        status: string;
        companyCnpj: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
    })[]>;
    findOne(id: string): Promise<({
        company: {
            id: string;
            name: string;
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
        status: string;
        companyCnpj: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
    }) | null>;
    update(id: string, dto: Partial<{
        status: "approved" | "rejected";
        installmentsPaid: number;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        companyCnpj: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        companyCnpj: string;
        employeeCpf: string;
        totalLoanAmount: number;
        numberOfInstallments: number;
        installmentAmount: number;
        firstDueDate: Date;
        installmentsPaid: number;
        companyName: string;
        employerEmail: string;
    }>;
}
