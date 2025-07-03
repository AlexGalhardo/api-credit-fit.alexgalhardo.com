import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare class IsCpfConstraint implements ValidatorConstraintInterface {
    validate(value: any, _args: ValidationArguments): boolean;
    defaultMessage(_args: ValidationArguments): string;
}
export declare function IsCpf(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
