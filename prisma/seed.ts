import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { cpf } from "cpf-cnpj-validator";
import { addDays } from "date-fns";
import slugify from "slugify";

const prisma = new PrismaClient();

function createEmailFromName(name: string) {
	const cleanName = name.replace(/^SEED -\s*/i, "");
	return `${slugify(cleanName, { lower: true, strict: true })}@gmail.com`;
}

async function clearSeedData() {
	await prisma.proposal.deleteMany({
		where: {
			company: {
				name: {
					startsWith: "SEED -",
				},
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
		{ cnpj: "11444777000161", name: "SEED - Tech Solutions Ltda" },
		{ cnpj: "22555888000172", name: "SEED - Inovação Digital S.A." },
		{ cnpj: "33666999000183", name: "SEED - Consultoria Moderna Ltda" },
		{ cnpj: "44777000100014", name: "SEED - Logística Rápida ME" },
		{ cnpj: "55888000200025", name: "SEED - AgroTech Brasil Ltda" },
		{ cnpj: "66999000300036", name: "SEED - EducaMais S.A." },
		{ cnpj: "77000100400047", name: "SEED - Construtora Futura Ltda" },
		{ cnpj: "88000200500058", name: "SEED - Serviços Médicos Avançados" },
		{ cnpj: "99000300600069", name: "SEED - Mercado Online Varejo Ltda" },
		{ cnpj: "10101010000070", name: "SEED - Green Energy Solutions S.A." },
	];

	const companies: Awaited<ReturnType<typeof prisma.company.create>>[] = [];

	for (const { name, cnpj: cnpjValue } of mockCompanies) {
		const company = await prisma.company.create({
			data: {
				name,
				email: createEmailFromName(name),
				cpf: cpf.generate(),
				cnpj: cnpjValue,
				legalName: name.replace("SEED - ", "") + " LTDA",
			},
		});
		companies.push(company);
		console.log(`✅ Created mocked company: ${company.name}`);
	}

	const employers: Awaited<ReturnType<typeof prisma.employee.create>>[] = [];

	for (let salary = 1500000; salary >= 300000; salary -= 300000) {
		const fullName = `SEED - EMPREGADO ${salary}`;
		const company = faker.helpers.arrayElement(companies);

		const employee = await prisma.employee.create({
			data: {
				fullName,
				email: createEmailFromName(fullName),
				cpf: cpf.generate(),
				salary,
				currentlyEmployed: true,
				companyCnpj: company.cnpj,
			},
		});

		employers.push(employee);
		console.log(`✅ Created fixed salary employee: ${employee.fullName}`);
	}

	{
		const fullName = "SEED - EMPREGADO";
		const company = faker.helpers.arrayElement(companies);

		const employee = await prisma.employee.create({
			data: {
				fullName,
				email: createEmailFromName(fullName),
				cpf: cpf.generate(),
				salary: 1500000,
				currentlyEmployed: true,
				companyCnpj: company.cnpj,
			},
		});

		employers.push(employee);
		console.log(`✅ Created final generic employee: ${employee.fullName}`);
	}

	const loanValues: number[] = [];
	for (let val = 100_000; val <= 1_000_000; val += 100_000) {
		loanValues.push(val);
	}

	for (const amount of loanValues) {
		const company = faker.helpers.arrayElement(companies);
		const employee = faker.helpers.arrayElement(employers);
		const numberOfInstallments = faker.number.int({ min: 1, max: 4 });
		const installmentAmount = Math.floor(amount / numberOfInstallments);

		await prisma.proposal.create({
			data: {
				status: faker.helpers.arrayElement(["approved", "rejected"]),
				totalLoanAmount: amount,
				numberOfInstallments,
				installmentAmount,
				firstDueDate: addDays(new Date(), 30).toISOString(),
				installmentsPaid: 0,
				companyName: company.name,
				employerEmail: employee.email,
			},
		});

		console.log(`✅ Created proposal of ${amount} for ${employee.fullName}`);
	}
}

async function main() {
	console.log("🧹 Cleaning old SEED data...");
	await clearSeedData();

	console.log("🌱 Creating new SEED data...");
	await createSeedData();

	console.log("✅ Seed finished!");
}

main()
	.catch((error) => {
		console.error("❌ Error running database seed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
