import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createEmployeeSchema = z
	.object({
		fullName: z
			.string()
			.min(4, "O nome deve ter no mínimo 4 caracteres")
			.max(32, "O nome deve ter no máximo 32 caracteres"),
		email: z.string().email("E-mail inválido"),
		cpf: z.string().refine((val) => cpf.isValid(val), { message: "CPF inválido" }),
		salary: z
			.number()
			.int()
			.min(100000, "O salário deve ser no mínimo R$ 1.000,00")
			.max(1200000, "O salário deve ser no máximo R$ 12.000,00"),
		currentlyEmployed: z.boolean().default(false),
		companyCnpj: z
			.string()
			.optional()
			.refine((val) => (val ? cnpj.isValid(val) : true), { message: "CNPJ inválido" }),
	})
	.superRefine((data, ctx) => {
		if (!data.companyCnpj && data.currentlyEmployed !== false) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "currentlyEmployed deve ser false se companyCnpj não for fornecido",
				path: ["currentlyEmployed"],
			});
		}
	});
