import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createProposalSchema = z.object({
	companyCnpj: z
		.string()
		.min(1, { message: "CNPJ is required" })
		.refine((value) => cnpj.isValid(value), { message: "Invalid CNPJ" }),
	employeeCpf: z
		.string()
		.min(1, { message: "CPF is required" })
		.refine((value) => cpf.isValid(value), { message: "Invalid CPF" }),
	totalLoanAmount: z.number().refine((val) => val >= 100000 && val <= 1200000, {
		message: "totalLoanAmount must be between 100000 and 1200000",
	}),
	numberOfInstallments: z.number().refine((val) => val >= 1 && val <= 4, {
		message: "numberOfInstallments must be between 1 and 4",
	}),
});
