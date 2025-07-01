import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createCompanySchema = z
	.object({
		legalName: z.string().min(8, "legalName must have at least 8 characters"),
		name: z.string().min(4, "name must have at least 4 characters"),
		email: z.string().email("Invalid email format"),
		cpf: z.string().refine((value) => cpf.isValid(value), {
			message: "Invalid CPF",
		}),
		cnpj: z.string().refine((value) => cnpj.isValid(value), {
			message: "Invalid CNPJ",
		}),
	})
	.refine((data) => data.cpf || data.cnpj, {
		message: "Either cpf or cnpj must be provided",
		path: ["cpf", "cnpj"],
	});
