import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { AppModule } from "../src/app.module";

describe("Loan System (e2e)", () => {
	let app: INestApplication;
	let createdCompanyId: string;
	let createdEmployeeId: string;
	let createdProposalId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(async () => {
		if (createdProposalId) {
			await request(app.getHttpServer())
				.delete(`/proposals/${createdProposalId}`)
				.catch(() => {});
		}

		if (createdEmployeeId) {
			await request(app.getHttpServer())
				.delete(`/employees/${createdEmployeeId}`)
				.catch(() => {});
		}

		if (createdCompanyId) {
			await request(app.getHttpServer())
				.delete(`/companies/${createdCompanyId}`)
				.catch(() => {});
		}

		createdCompanyId = "";
		createdEmployeeId = "";
		createdProposalId = "";
	});

	it("POST /companies should create a new company", async () => {
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: "TEST_Company Legal Name",
			name: "TEST_Company Name",
			cpf: cpf.generate(),
			email: "test-company@example.com",
		};

		const response = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data.name).toBe(companyData.name);
		expect(response.body.data.email).toBe(companyData.email);
		expect(response.body.data.cpf).toBe(companyData.cpf);
		expect(response.body.data.cnpj).toBe(companyData.cnpj);
		expect(response.body.data.legalName).toBe(companyData.legalName);
		expect(response.body.data).toHaveProperty("createdAt");
		expect(response.body.data).toHaveProperty("updatedAt");
		expect(response.body.data.deletedAt).toBeNull();

		createdCompanyId = response.body.data.id;
	});

	it("POST /employees should create a new employee", async () => {
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: "TEST_Company for Employee",
			name: "TEST_Company Name",
			cpf: cpf.generate(),
			email: "company-for-employee@example.com",
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyId = companyResponse.body.data.id;

		const employeeData = {
			fullName: "TEST_Employee Name",
			cpf: cpf.generate(),
			email: "test-employee@example.com",
			salary: 1000000,
			companyCnpj: companyData.cnpj,
		};

		const response = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data.fullName).toBe(employeeData.fullName);
		expect(response.body.data.email).toBe(employeeData.email);
		expect(response.body.data.cpf).toBe(employeeData.cpf);
		expect(response.body.data.salary).toBe(employeeData.salary);
		expect(response.body.data.companyCnpj).toBe(employeeData.companyCnpj);
		expect(response.body.data).toHaveProperty("createdAt");
		expect(response.body.data).toHaveProperty("updatedAt");
		expect(response.body.data.deletedAt).toBeNull();

		createdEmployeeId = response.body.data.id;
	});

	it("POST /proposals should create a new proposal", async () => {
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: "TEST_Company for Proposal",
			name: "TEST_Company Name for Proposal",
			cpf: cpf.generate(),
			email: "company-for-proposal@example.com",
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyId = companyResponse.body.data.id;

		const employeeCpf = cpf.generate();
		const employeeData = {
			fullName: "TEST_Employee for Proposal",
			cpf: employeeCpf,
			email: "employee-for-proposal@example.com",
			salary: 800000, // R$ 8.000,00 em centavos
			companyCnpj: companyData.cnpj,
		};

		const employeeResponse = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		createdEmployeeId = employeeResponse.body.data.id;

		const proposalData = {
			companyCnpj: companyData.cnpj,
			employeeCpf: employeeCpf,
			totalLoanAmount: "200000",
			numberOfInstallments: "2",
		};

		const response = await request(app.getHttpServer()).post("/proposals").send(proposalData).expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("id");
		expect(response.body.data.status).toBe("approved");
		expect(response.body.data.totalLoanAmount).toBe(200000);
		expect(response.body.data.numberOfInstallments).toBe(2);
		expect(response.body.data.installmentAmount).toBe(100000);
		expect(response.body.data.installmentsPaid).toBe(0);
		expect(response.body.data.companyName).toBe(companyData.name);
		expect(response.body.data.employerEmail).toBe(employeeData.email);
		expect(response.body.data).toHaveProperty("firstDueDate");
		expect(response.body.data).toHaveProperty("createdAt");
		expect(response.body.data).toHaveProperty("updatedAt");
		expect(response.body.data.deletedAt).toBeNull();

		createdProposalId = response.body.data.id;
	});

	it("should create complete loan flow: company -> employee -> proposal", async () => {
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: "TEST_Complete Flow Company",
			name: "TEST_Flow Company",
			cpf: cpf.generate(),
			email: "flow-company@example.com",
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyId = companyResponse.body.data.id;
		expect(companyResponse.body.success).toBe(true);

		const employeeCpf = cpf.generate();
		const employeeData = {
			fullName: "TEST_Flow Employee",
			cpf: employeeCpf,
			email: "flow-employee@example.com",
			salary: 1200000,
			companyCnpj: companyData.cnpj,
		};

		const employeeResponse = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		createdEmployeeId = employeeResponse.body.data.id;
		expect(employeeResponse.body.success).toBe(true);
		expect(employeeResponse.body.data.companyCnpj).toBe(companyData.cnpj);

		const proposalData = {
			companyCnpj: companyData.cnpj,
			employeeCpf: employeeCpf,
			totalLoanAmount: "500000",
			numberOfInstallments: "5",
		};

		const proposalResponse = await request(app.getHttpServer()).post("/proposals").send(proposalData).expect(201);

		createdProposalId = proposalResponse.body.data.id;
		expect(proposalResponse.body.success).toBe(true);
		expect(proposalResponse.body.data.companyName).toBe(companyData.name);
		expect(proposalResponse.body.data.employerEmail).toBe(employeeData.email);
		expect(proposalResponse.body.data.installmentAmount).toBe(100000);

		expect(proposalResponse.body.data.totalLoanAmount).toBe(500000);
		expect(proposalResponse.body.data.numberOfInstallments).toBe(5);
		expect(proposalResponse.body.data.status).toBe("approved");
	});

	it("should handle employee without company", async () => {
		const employeeData = {
			fullName: "TEST_Independent Employee",
			cpf: cpf.generate(),
			email: "independent@example.com",
			salary: 600000,
		};

		const response = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.data.companyCnpj).toBeNull();
		expect(response.body.data.currentlyEmployed).toBe(false);

		createdEmployeeId = response.body.data.id;
	});

	it("should validate minimum salary requirement", async () => {
		const employeeData = {
			fullName: "TEST_Low Salary Employee",
			cpf: cpf.generate(),
			email: "lowsalary@example.com",
			salary: 50000,
		};

		await request(app.getHttpServer()).post("/employees").send(employeeData).expect(400);
	});

	it("should validate maximum salary requirement", async () => {
		const employeeData = {
			fullName: "TEST_High Salary Employee",
			cpf: cpf.generate(),
			email: "highsalary@example.com",
			salary: 1500000,
		};

		await request(app.getHttpServer()).post("/employees").send(employeeData).expect(400);
	});
});
