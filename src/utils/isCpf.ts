import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";
import { cpf } from "cpf-cnpj-validator";

@ValidatorConstraint({ async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
	validate(value: any, _args: ValidationArguments) {
		if (typeof value !== "string") return false;
		return cpf.isValid(value);
	}

	defaultMessage(_args: ValidationArguments) {
		return "CPF inválido.";
	}
}

export function IsCpf(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsCpfConstraint,
		});
	};
}
