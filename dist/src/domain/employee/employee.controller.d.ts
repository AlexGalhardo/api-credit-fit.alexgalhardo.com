import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";
export declare class EmployeeController {
    private readonly employeeService;
    private readonly logger;
    constructor(employeeService: EmployeeService);
    create(dto: CreateEmployeeDto): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
