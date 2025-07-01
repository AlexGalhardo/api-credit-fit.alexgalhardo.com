import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createEmployeeSchema = z
	.object({
		fullName: z.string().min(4, "Name must be at least 4 characters").max(32, "Name must be at most 32 characters"),
		email: z.string().email("Invalid email"),
		cpf: z.string().refine((val) => cpf.isValid(val), { message: "Invalid CPF" }),
		salary: z
			.number()
			.int()
			.min(100000, "Salary must be at least R$ 1,000.00")
			.max(1200000, "Salary must be at most R$ 12,000.00"),
		currentlyEmployed: z.boolean().default(false),
		companyCnpj: z
			.string()
			.optional()
			.refine((val) => (val ? cnpj.isValid(val) : true), { message: "Invalid CNPJ" }),
	})
	.superRefine((data, ctx) => {
		if (!data.companyCnpj && data.currentlyEmployed !== false) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "currentlyEmployed must be false if companyCnpj is not provided",
				path: ["currentlyEmployed"],
			});
		}
	});
