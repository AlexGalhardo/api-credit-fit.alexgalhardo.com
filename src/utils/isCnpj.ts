import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";
import { cnpj } from "cpf-cnpj-validator";

@ValidatorConstraint({ async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
	validate(value: any, _args: ValidationArguments) {
		if (typeof value !== "string") return false;
		return cnpj.isValid(value);
	}

	defaultMessage(_args: ValidationArguments) {
		return "CNPJ inválido.";
	}
}

export function IsCnpj(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsCnpjConstraint,
		});
	};
}
