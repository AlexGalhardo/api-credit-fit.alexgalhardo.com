import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

export const createCompanySchema = z
	.object({
		legalName: z.string().min(3, "legalName must have at least 3 characters"),
		name: z.string().min(1, "name is required"),
		email: z.string().email("Invalid email format"),
		cpf: z.string().regex(cpfRegex, "CPF must have the format XXX.XXX.XXX-XX"),
		cnpj: z.string().regex(cnpjRegex, "CNPJ must have the format XX.XXX.XXX/XXXX-XX"),
	})
	.refine((data) => data.cpf || data.cnpj, {
		message: "Either cpf or cnpj must be provided",
		path: ["cpf", "cnpj"],
	});
