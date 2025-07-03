import { ProposalService } from "./proposal.service";
export declare class ProposalController {
    private readonly proposalService;
    private readonly logger;
    constructor(proposalService: ProposalService);
    create(dto: any): Promise<{
        success: boolean;
        data: {
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
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: ({
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
        }) | null;
    }>;
    update(id: string, dto: Partial<{
        status: "approved" | "rejected";
        installmentsPaid: number;
    }>): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
