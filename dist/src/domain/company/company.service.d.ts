import { RepositoryService } from "../../repository/repository.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
export declare class CompanyService {
    private readonly repository;
    constructor(repository: RepositoryService);
    create(dto: CreateCompanyDto): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<({
        proposals: {
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
        }[];
        employees: {
            id: string;
            email: string;
            cpf: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyCnpj: string | null;
            fullName: string;
            salary: number;
            currentlyEmployed: boolean;
        }[];
    } & {
        id: string;
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        proposals: {
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
        }[];
        employees: {
            id: string;
            email: string;
            cpf: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyCnpj: string | null;
            fullName: string;
            salary: number;
            currentlyEmployed: boolean;
        }[];
    } & {
        id: string;
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateCompanyDto): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
