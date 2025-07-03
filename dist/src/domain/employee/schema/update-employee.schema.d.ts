export declare const updateEmployeeSchema: import("zod").ZodObject<{
    fullName: import("zod").ZodOptional<import("zod").ZodString>;
    email: import("zod").ZodOptional<import("zod").ZodString>;
    cpf: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
    salary: import("zod").ZodOptional<import("zod").ZodNumber>;
    currentlyEmployed: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
    companyCnpj: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodString>, string | undefined, string | undefined>>;
}, "strip", import("zod").ZodTypeAny, {
    email?: string | undefined;
    cpf?: string | undefined;
    companyCnpj?: string | undefined;
    fullName?: string | undefined;
    salary?: number | undefined;
    currentlyEmployed?: boolean | undefined;
}, {
    email?: string | undefined;
    cpf?: string | undefined;
    companyCnpj?: string | undefined;
    fullName?: string | undefined;
    salary?: number | undefined;
    currentlyEmployed?: boolean | undefined;
}>;
