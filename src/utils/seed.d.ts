export interface CompanyDataInterface {
	cnpj: string;
	name: string;
	cpf: string;
}

export interface EmployeeDataInterface {
	name: string;
	email: string;
	salary: number;
	cpf: string;
	companyCnpj: string;
}

export interface ProposalDataInterface {
	status: string;
	companyCnpj: string;
	employeeCpf: string;
	totalLoanAmount: number;
	numberOfInstallments: number;
	installmentAmount: number;
	firstDueDate: Date;
	installmentsPaid: number;
	companyName: string;
	employerEmail: string;
	employeeCreditScore: number;
}

export interface CreatedCompanyInterface {
	id: string;
	name: string;
	email: string;
	cpf: string;
	cnpj: string;
	legalName: string;
}

export interface CreatedEmployeeInterface {
	id: string;
	fullName: string;
	email: string;
	cpf: string;
	salary: number;
	currentlyEmployed: boolean;
	companyCnpj: string;
}
