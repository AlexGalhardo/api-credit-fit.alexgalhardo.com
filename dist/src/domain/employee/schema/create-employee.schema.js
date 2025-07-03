"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployeeSchema = void 0;
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const zod_1 = require("zod");
exports.createEmployeeSchema = zod_1.z
    .object({
    fullName: zod_1.z
        .string()
        .min(4, "O nome deve ter no mínimo 4 caracteres")
        .max(32, "O nome deve ter no máximo 32 caracteres"),
    email: zod_1.z.string().email("E-mail inválido"),
    cpf: zod_1.z.string().refine((val) => cpf_cnpj_validator_1.cpf.isValid(val), { message: "CPF inválido" }),
    salary: zod_1.z
        .number()
        .int()
        .min(100000, "O salário deve ser no mínimo R$ 1.000,00")
        .max(1200000, "O salário deve ser no máximo R$ 12.000,00"),
    currentlyEmployed: zod_1.z.boolean().default(false),
    companyCnpj: zod_1.z
        .string()
        .optional()
        .refine((val) => (val ? cpf_cnpj_validator_1.cnpj.isValid(val) : true), { message: "CNPJ inválido" }),
})
    .superRefine((data, ctx) => {
    if (!data.companyCnpj && data.currentlyEmployed !== false) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "currentlyEmployed deve ser false se companyCnpj não for fornecido",
            path: ["currentlyEmployed"],
        });
    }
});
//# sourceMappingURL=create-employee.schema.js.map