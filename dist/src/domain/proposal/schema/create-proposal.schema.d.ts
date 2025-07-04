import { z } from "zod";
export declare const createProposalSchema: z.ZodObject<{
    companyCnpj: z.ZodEffects<z.ZodString, string, string>;
    employeeCpf: z.ZodEffects<z.ZodString, string, string>;
    totalLoanAmount: z.ZodEffects<z.ZodNumber, number, number>;
    numberOfInstallments: z.ZodEffects<z.ZodNumber, number, number>;
}, "strip", z.ZodTypeAny, {
    companyCnpj: string;
    employeeCpf: string;
    totalLoanAmount: number;
    numberOfInstallments: number;
}, {
    companyCnpj: string;
    employeeCpf: string;
    totalLoanAmount: number;
    numberOfInstallments: number;
}>;
