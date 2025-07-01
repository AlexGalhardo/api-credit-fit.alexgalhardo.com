import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { cpf, cnpj } from "cpf-cnpj-validator";
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
	const companies: Awaited<ReturnType<typeof prisma.company.create>>[] = [];

	for (let i = 0; i < 10; i++) {
		const name = `SEED - ${faker.company.name()}`;
		const company = await prisma.company.create({
			data: {
				name,
				email: createEmailFromName(name),
				cpf: cpf.generate(),
				cnpj: cnpj.generate(),
				legalName: `${faker.company.name()} Ltda`,
			},
		});
		companies.push(company);
		console.log(`✅ Created company: ${company.name}`);
	}

	const employers: Awaited<ReturnType<typeof prisma.employee.create>>[] = [];

	for (let i = 0; i < 50; i++) {
		const fullName = `SEED - ${faker.person.fullName()}`;
		const hasCompany = i < 45;
		const company = hasCompany ? faker.helpers.arrayElement(companies) : null;

		const employee = await prisma.employee.create({
			data: {
				fullName,
				email: createEmailFromName(fullName),
				cpf: cpf.generate(),
				salary: faker.number.int({ min: 1200, max: 10000 }),
				currentlyEmployed: true,
				companyId: company?.id ?? null,
			},
		});

		employers.push(employee);
		console.log(`✅ Created employee: ${employee.fullName}`);
	}

	const loanValues: number[] = [];
	for (let val = 100_000; val <= 1_000_000; val += 100_000) {
		loanValues.push(val);
	}

	for (const amount of loanValues) {
		const company = faker.helpers.arrayElement(companies);
		const employee = faker.helpers.arrayElement(employers);
		const numberOfInstallments = faker.number.int({ min: 1, max: 10 });
		const installmentAmount = Math.floor(amount / numberOfInstallments);

		const proposal = await prisma.proposal.create({
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
		console.error("Error running database seed: ", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
