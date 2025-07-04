"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProposalSchema = void 0;
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const zod_1 = require("zod");
exports.createProposalSchema = zod_1.z.object({
    companyCnpj: zod_1.z
        .string()
        .min(1, { message: "CNPJ is required" })
        .refine((value) => cpf_cnpj_validator_1.cnpj.isValid(value), { message: "Invalid CNPJ" }),
    employeeCpf: zod_1.z
        .string()
        .min(1, { message: "CPF is required" })
        .refine((value) => cpf_cnpj_validator_1.cpf.isValid(value), { message: "Invalid CPF" }),
    totalLoanAmount: zod_1.z.number().refine((val) => val >= 100000 && val <= 1200000, {
        message: "totalLoanAmount must be between 100000 and 1200000",
    }),
    numberOfInstallments: zod_1.z.number().refine((val) => val >= 1 && val <= 4, {
        message: "numberOfInstallments must be between 1 and 4",
    }),
});
//# sourceMappingURL=create-proposal.schema.js.map