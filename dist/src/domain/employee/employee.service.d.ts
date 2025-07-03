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
        companyCnpj: string | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
    }>;
    findAll(): Promise<({
        company: {
            id: string;
            name: string;
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
        companyCnpj: string | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
    })[]>;
    findOne(id: string): Promise<{
        company: {
            id: string;
            name: string;
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
        companyCnpj: string | null;
        fullName: string;
        salary: number;
        currentlyEmployed: boolean;
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
