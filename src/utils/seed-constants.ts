import { CompanyDataInterface, EmployeeDataInterface } from "./seed";

export const SEED_PREFIX = "SEED -";

export const MOCK_COMPANIES: CompanyDataInterface[] = [
	{ cnpj: "84207733000191", name: "SEED - Tech Solutions Ltda", cpf: "11111111111" },
	{ cnpj: "63604249000126", name: "SEED - Inovação Digital S.A.", cpf: "22222222222" },
	{ cnpj: "20824809000145", name: "SEED - Consultoria Moderna Ltda", cpf: "33333333333" },
	{ cnpj: "13734757000150", name: "SEED - Logística Rápida ME", cpf: "44444444444" },
	{ cnpj: "83604036000101", name: "SEED - AgroTech Brasil Ltda", cpf: "55555555555" },
];

export const MOCK_EMPLOYEES: EmployeeDataInterface[] = [
	{
		name: "SEED - EMPREGADO",
		email: "empregado@gmail.com",
		salary: 1500000,
		cpf: "04501133880",
		companyCnpj: "84207733000191",
	},
	{
		name: "SEED - EMPREGADO 12",
		email: "empregado-12@gmail.com",
		salary: 1200000,
		cpf: "27147123123",
		companyCnpj: "63604249000126",
	},
	{
		name: "SEED - EMPREGADO 9",
		email: "empregado-9@gmail.com",
		salary: 900000,
		cpf: "52522513630",
		companyCnpj: "20824809000145",
	},
	{
		name: "SEED - EMPREGADO 6",
		email: "empregado-6@gmail.com",
		salary: 600000,
		cpf: "26385255107",
		companyCnpj: "13734757000150",
	},
	{
		name: "SEED - EMPREGADO 3",
		email: "empregado-3@gmail.com",
		salary: 300000,
		cpf: "22521727890",
		companyCnpj: "83604036000101",
	},
];

export const LOAN_VALUES = Array.from({ length: 10 }, (_, i) => (i + 1) * 100_000);

export const INSTALLMENT_RANGE = { min: 1, max: 4 };
export const DAYS_TO_FIRST_DUE = 30;
export const DEFAULT_CREDIT_SCORE = 650;
