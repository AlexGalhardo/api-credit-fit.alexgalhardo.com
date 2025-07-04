import { PrismaClient, ProposalStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function clearSeedData() {
	await prisma.proposal.deleteMany({
		where: {
			companyName: {
				startsWith: "SEED -",
			},
		},
	});

	await prisma.employee.deleteMany({
		where: {
			fullName: {
				startsWith: "SEED -",
			},
		},
	});

	await prisma.company.deleteMany({
		where: {
			name: {
				startsWith: "SEED -",
			},
		},
	});
}

async function createSeedData() {
	const mockCompanies = [
		{ cnpj: "84207733000191", name: "SEED - Tech Solutions Ltda", cpf: "11111111111" },
		{ cnpj: "63604249000126", name: "SEED - Inovação Digital S.A.", cpf: "22222222222" },
		{ cnpj: "20824809000145", name: "SEED - Consultoria Moderna Ltda", cpf: "33333333333" },
		{ cnpj: "13734757000150", name: "SEED - Logística Rápida ME", cpf: "44444444444" },
		{ cnpj: "83604036000101", name: "SEED - AgroTech Brasil Ltda", cpf: "55555555555" },
	];

	const companies: Awaited<ReturnType<typeof prisma.company.create>>[] = [];

	for (const { name, cnpj: cnpjValue, cpf: cpfValue } of mockCompanies) {
		const company = await prisma.company.create({
			data: {
				name,
				email: `${name
					.toLowerCase()
					.replace(/seed - |ltda|s\.a\.|me/gi, "")
					.trim()
					.replace(/\s+/g, "-")}@gmail.com`,
				cpf: cpfValue,
				cnpj: cnpjValue,
				legalName: name.replace("SEED - ", "") + " LTDA",
			},
		});
		companies.push(company);
	}

	const fixedEmployees = [
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

	const employees: Awaited<ReturnType<typeof prisma.employee.create>>[] = [];

	for (const employeeData of fixedEmployees) {
		const employee = await prisma.employee.create({
			data: {
				fullName: employeeData.name,
				email: employeeData.email,
				cpf: employeeData.cpf,
				salary: employeeData.salary,
				currentlyEmployed: true,
				companyCnpj: employeeData.companyCnpj,
			},
		});
		employees.push(employee);
	}

	const loanValues: number[] = [];
	for (let val = 100_000; val <= 1_000_000; val += 100_000) {
		loanValues.push(val);
	}

	for (const amount of loanValues) {
		const employee = faker.helpers.arrayElement(employees);
		const company = companies.find((c) => c.cnpj === employee.companyCnpj);

		if (!company) continue;

		const numberOfInstallments = faker.number.int({ min: 1, max: 4 });
		const installmentAmount = Math.floor(amount / numberOfInstallments);

		await prisma.proposal.create({
			data: {
				status: faker.helpers.arrayElement([ProposalStatus.APPROVED, ProposalStatus.REJECTED]),
				companyCnpj: company.cnpj,
				employeeCpf: employee.cpf,
				totalLoanAmount: amount,
				numberOfInstallments,
				installmentAmount,
				firstDueDate: addDays(new Date(), 30),
				installmentsPaid: 0,
				companyName: company.name,
				employerEmail: employee.email,
				employeeCreditScore: 650,
			},
		});
	}
}

async function main() {
	await clearSeedData();
	await createSeedData();
}

main()
	.catch((error) => {
		console.error("Error running database seed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
