"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCpfConstraint = void 0;
exports.IsCpf = IsCpf;
const class_validator_1 = require("class-validator");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
let IsCpfConstraint = class IsCpfConstraint {
    validate(value, _args) {
        if (typeof value !== "string")
            return false;
        return cpf_cnpj_validator_1.cpf.isValid(value);
    }
    defaultMessage(_args) {
        return "CPF inválido.";
    }
};
exports.IsCpfConstraint = IsCpfConstraint;
exports.IsCpfConstraint = IsCpfConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsCpfConstraint);
function IsCpf(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCpfConstraint,
        });
    };
}
//# sourceMappingURL=is-cpf.js.map