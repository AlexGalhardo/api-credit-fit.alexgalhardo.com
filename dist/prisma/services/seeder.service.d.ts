import { CreatedCompanyInterface, CreatedEmployeeInterface } from "src/utils/seed";
import { DatabaseService } from "./database.service";
export declare class SeederService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    clearData(): Promise<void>;
    seedCompanies(): Promise<CreatedCompanyInterface[]>;
    seedEmployees(): Promise<CreatedEmployeeInterface[]>;
    seedProposals(companies: CreatedCompanyInterface[], employees: CreatedEmployeeInterface[]): Promise<void>;
    seedAll(): Promise<void>;
}
