"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProposalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_cnpj_1 = require("../../../utils/is-cnpj");
const is_cpf_1 = require("../../../utils/is-cpf");
class CreateProposalDto {
    companyCnpj;
    employeeCpf;
    totalLoanAmount;
    numberOfInstallments;
}
exports.CreateProposalDto = CreateProposalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "12.345.678/0001-00",
        description: "CNPJ of the company requesting the loan",
    }),
    (0, class_validator_1.IsString)(),
    (0, is_cnpj_1.IsCnpj)({ message: "CNPJ inválido" }),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "companyCnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "123.456.789-00",
        description: "CPF of the employee receiving the loan",
    }),
    (0, class_validator_1.IsString)(),
    (0, is_cpf_1.IsCpf)({ message: "CPF inválido" }),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "employeeCpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "100000",
        description: "Total loan amount in cents (min: 100000, max: 2000000)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "totalLoanAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "4",
        description: "Number of installments (1 to 10)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "numberOfInstallments", void 0);
//# sourceMappingURL=create-proposal.dto.js.map