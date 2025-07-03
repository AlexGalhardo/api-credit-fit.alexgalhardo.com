import { z } from "zod";
export declare const createProposalSchema: z.ZodObject<{
    companyCnpj: z.ZodEffects<z.ZodString, string, string>;
    employeeCpf: z.ZodEffects<z.ZodString, string, string>;
    totalLoanAmount: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, number, string>, number, string>;
    numberOfInstallments: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, number, string>, number, string>;
}, "strip", z.ZodTypeAny, {
    companyCnpj: string;
    employeeCpf: string;
    totalLoanAmount: number;
    numberOfInstallments: number;
}, {
    companyCnpj: string;
    employeeCpf: string;
    totalLoanAmount: string;
    numberOfInstallments: string;
}>;
