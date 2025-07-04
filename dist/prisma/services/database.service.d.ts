import { PrismaClient } from "@prisma/client";
import { CreatedCompanyInterface, CreatedEmployeeInterface, ProposalDataInterface } from "src/utils/seed";
export declare class DatabaseService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    clearSeedData(): Promise<void>;
    createCompany(data: any): Promise<CreatedCompanyInterface>;
    createEmployee(data: any): Promise<CreatedEmployeeInterface>;
    createProposal(data: ProposalDataInterface): Promise<void>;
    disconnect(): Promise<void>;
}
