import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createProposalSchema = z.object({
	companyCnpj: z
		.string()
		.min(1, { message: "CNPJ is required" })
		.refine((value) => cnpj.isValid(value), { message: "Invalid CNPJ" }),
	employerCpf: z
		.string()
		.min(1, { message: "CPF is required" })
		.refine((value) => cpf.isValid(value), { message: "Invalid CPF" }),
	totalLoanAmount: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), { message: "totalLoanAmount must be a number" })
		.transform((val) => Number(val))
		.refine((val) => val >= 100_000 && val <= 2_000_000, {
			message: "totalLoanAmount must be between 100000 and 2000000",
		}),
	numberOfInstallments: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), { message: "numberOfInstallments must be a number" })
		.transform((val) => Number(val))
		.refine((val) => val >= 1 && val <= 10, {
			message: "numberOfInstallments must be between 1 and 10",
		}),
});
