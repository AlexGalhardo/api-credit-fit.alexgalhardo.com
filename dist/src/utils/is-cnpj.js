"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCnpjConstraint = void 0;
exports.IsCnpj = IsCnpj;
const class_validator_1 = require("class-validator");
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
let IsCnpjConstraint = class IsCnpjConstraint {
    validate(value, _args) {
        if (typeof value !== "string")
            return false;
        return cpf_cnpj_validator_1.cnpj.isValid(value);
    }
    defaultMessage(_args) {
        return "CNPJ inválido.";
    }
};
exports.IsCnpjConstraint = IsCnpjConstraint;
exports.IsCnpjConstraint = IsCnpjConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsCnpjConstraint);
function IsCnpj(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCnpjConstraint,
        });
    };
}
//# sourceMappingURL=is-cnpj.js.map