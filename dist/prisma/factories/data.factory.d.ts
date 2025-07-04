import { CompanyDataInterface, CreatedCompanyInterface, CreatedEmployeeInterface, EmployeeDataInterface, ProposalDataInterface } from "src/utils/seed";
export declare class DataFactory {
    static createCompanyEmail(name: string): string;
    static createCompanyLegalName(name: string): string;
    static createCompanyFromData(data: CompanyDataInterface): {
        name: string;
        email: string;
        cpf: string;
        cnpj: string;
        legalName: string;
    };
    static createEmployeeFromData(data: EmployeeDataInterface): {
        fullName: string;
        email: string;
        cpf: string;
        salary: number;
        currentlyEmployed: boolean;
        companyCnpj: string;
    };
    static createProposal(amount: number, company: CreatedCompanyInterface, employee: CreatedEmployeeInterface): ProposalDataInterface;
    static getRandomEmployee(employees: CreatedEmployeeInterface[]): CreatedEmployeeInterface;
}
