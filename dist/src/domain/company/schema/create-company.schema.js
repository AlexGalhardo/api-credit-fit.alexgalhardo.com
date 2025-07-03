"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanySchema = void 0;
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const zod_1 = require("zod");
exports.createCompanySchema = zod_1.z
    .object({
    legalName: zod_1.z.string().min(8, "A razão social da empresa deve ter no mínimo 8 caracteres"),
    name: zod_1.z.string().min(4, "O nome fantasia da empresa deve ter no mínimo 4 caracteres"),
    email: zod_1.z.string().email("Formato de e-mail inválido"),
    cpf: zod_1.z.string().refine((value) => cpf_cnpj_validator_1.cpf.isValid(value), {
        message: "CPF inválido",
    }),
    cnpj: zod_1.z.string().refine((value) => cpf_cnpj_validator_1.cnpj.isValid(value), {
        message: "CNPJ inválido",
    }),
})
    .refine((data) => data.cpf || data.cnpj, {
    message: "CPF ou CNPJ deve ser informado",
    path: ["cpf", "cnpj"],
});
//# sourceMappingURL=create-company.schema.js.map