import { z } from "zod";
export declare const createEmployeeSchema: z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    cpf: z.ZodEffects<z.ZodString, string, string>;
    salary: z.ZodNumber;
    currentlyEmployed: z.ZodDefault<z.ZodBoolean>;
    companyCnpj: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    email: string;
    cpf: string;
    fullName: string;
    salary: number;
    currentlyEmployed: boolean;
    companyCnpj?: string | undefined;
}, {
    email: string;
    cpf: string;
    fullName: string;
    salary: number;
    currentlyEmployed?: boolean | undefined;
    companyCnpj?: string | undefined;
}>, {
    email: string;
    cpf: string;
    fullName: string;
    salary: number;
    currentlyEmployed: boolean;
    companyCnpj?: string | undefined;
}, {
    email: string;
    cpf: string;
    fullName: string;
    salary: number;
    currentlyEmployed?: boolean | undefined;
    companyCnpj?: string | undefined;
}>;
