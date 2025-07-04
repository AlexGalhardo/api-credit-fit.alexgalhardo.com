import { RepositoryService } from "../../repository/repository.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
export declare class EmployeeService {
    private readonly repository;
    constructor(repository: RepositoryService);
    create(dto: CreateEmployeeDto): Promise<{
        id: string;
        email: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string | null;
    }>;
    findAll(): Promise<({
        company: {
            name: string;
            id: string;
            email: string;
            cnpj: string;
            legalName: string;
        } | null;
        proposals: {
            id: string;
            createdAt: Date;
            status: string;
            totalLoanAmount: number;
            numberOfInstallments: number;
            installmentAmount: number;
            firstDueDate: Date;
            installmentsPaid: number;
        }[];
    } & {
        id: string;
        email: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string | null;
    })[]>;
    findOne(id: string): Promise<{
        company: {
            name: string;
            id: string;
            email: string;
            cnpj: string;
            legalName: string;
        } | null;
        proposals: {
            id: string;
            createdAt: Date;
            status: string;
            totalLoanAmount: number;
            numberOfInstallments: number;
            installmentAmount: number;
            firstDueDate: Date;
            installmentsPaid: number;
        }[];
    } & {
        id: string;
        email: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string | null;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        id: string;
        email: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string | null;
    }>;
}
