import { LoginDto } from "./dtos/login.dto";
export declare class AppService {
    index(): Promise<{
        success: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        salary: number;
        cpf: string;
        companyCnpj: string;
    } | {
        id: null;
        name: null;
        email: null;
        role: null;
        salary: null;
        cpf: null;
        companyCnpj: null;
    }>;
}
