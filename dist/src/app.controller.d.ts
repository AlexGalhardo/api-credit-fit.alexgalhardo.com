import { AppService } from "./app.service";
import { LoginDto } from "./dtos/login.dto";
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    index(): Promise<{
        success: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            name: string;
            email: string;
            role: string;
            salary: number;
            cpf: string;
            companyCnpj: string;
        };
        error?: undefined;
    }>;
}
