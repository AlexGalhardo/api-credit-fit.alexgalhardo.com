import { z } from "zod";
export declare const createCompanySchema: z.ZodEffects<z.ZodObject<{
    legalName: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    cpf: z.ZodEffects<z.ZodString, string, string>;
    cnpj: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    legalName: string;
}, {
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    legalName: string;
}>, {
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    legalName: string;
}, {
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    legalName: string;
}>;
