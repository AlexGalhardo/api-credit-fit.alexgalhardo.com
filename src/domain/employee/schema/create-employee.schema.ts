import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createEmployeeSchema = z.object({
	fullName: z.string().min(4, "Name must be at least 4 characters").max(32, "Name must be at most 32 characters"),
	email: z.string().email("Invalid email"),
	cpf: z
		.string()
		.min(11)
		.max(14)
		.refine((val) => cpf.isValid(val), { message: "Invalid CPF" }),
	salary: z.number().int().positive("Salary must be a positive integer"),
	currentlyEmployed: z.boolean().optional(),
	companyId: z.string().uuid().optional(),
});
