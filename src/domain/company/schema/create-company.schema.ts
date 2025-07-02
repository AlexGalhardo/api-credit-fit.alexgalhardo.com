import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createCompanySchema = z
	.object({
		legalName: z.string().min(8, "A razão social da empresa deve ter no mínimo 8 caracteres"),
		name: z.string().min(4, "O nome fantasia da empresa deve ter no mínimo 4 caracteres"),
		email: z.string().email("Formato de e-mail inválido"),
		cpf: z.string().refine((value) => cpf.isValid(value), {
			message: "CPF inválido",
		}),
		cnpj: z.string().refine((value) => cnpj.isValid(value), {
			message: "CNPJ inválido",
		}),
	})
	.refine((data) => data.cpf || data.cnpj, {
		message: "CPF ou CNPJ deve ser informado",
		path: ["cpf", "cnpj"],
	});
