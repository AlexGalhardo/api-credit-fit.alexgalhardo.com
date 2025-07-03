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
exports.CreateCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_cnpj_1 = require("../../../utils/is-cnpj");
const is_cpf_1 = require("../../../utils/is-cpf");
class CreateCompanyDto {
    legalName;
    name;
    email;
    cpf;
    cnpj;
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Green Valley Ltda",
        description: "The legal name of the company",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Green Valley",
        description: "The display name of the company",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "contact@greenvalley.com",
        description: "The company's email address",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "123.456.789-00",
        description: "The company's CPF number (if individual)",
    }),
    (0, class_validator_1.IsString)(),
    (0, is_cpf_1.IsCpf)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "12.345.678/0001-90",
        description: "The company's CNPJ number (if legal entity)",
    }),
    (0, class_validator_1.IsString)(),
    (0, is_cnpj_1.IsCnpj)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cnpj", void 0);
//# sourceMappingURL=create-company.dto.js.map