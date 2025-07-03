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
exports.CreateEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_cnpj_1 = require("../../../utils/is-cnpj");
const is_cpf_1 = require("../../../utils/is-cpf");
class CreateEmployeeDto {
    fullName;
    email;
    cpf;
    salary;
    currentlyEmployed;
    companyCnpj;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "João da Silva",
        description: "Full name of the employee",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "joao.silva@gmail.com",
        description: "Email address of the employee",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "123.456.789-00",
        description: "CPF of the employee",
    }),
    (0, class_validator_1.IsString)(),
    (0, is_cpf_1.IsCpf)({ message: "CPF inválido" }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 500000,
        description: "Salary of the employee (in cents)",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: "Whether the employee is currently employed (default false if no companyCnpj)",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEmployeeDto.prototype, "currentlyEmployed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "12.345.678/0001-90",
        description: "Optional CNPJ of the company the employee is associated with",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, is_cnpj_1.IsCnpj)({ message: "CNPJ inválido" }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "companyCnpj", void 0);
//# sourceMappingURL=create-employee.dto.js.map