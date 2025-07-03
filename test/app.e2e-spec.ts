import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { AppModule } from "../src/app.module";

describe("Loan System (e2e)", () => {
	let app: INestApplication;
	let createdCompanyIds: string[] = [];
	let createdEmployeeIds: string[] = [];
	let createdProposalIds: string[] = [];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		for (const proposalId of createdProposalIds) {
			await request(app.getHttpServer())
				.delete(`/proposals/${proposalId}`)
				.catch(() => {});
		}

		for (const employeeId of createdEmployeeIds) {
			await request(app.getHttpServer())
				.delete(`/employees/${employeeId}`)
				.catch(() => {});
		}

		for (const companyId of createdCompanyIds) {
			await request(app.getHttpServer())
				.delete(`/companies/${companyId}`)
				.catch(() => {});
		}

		await app.close();
	});

	afterEach(async () => {
		createdCompanyIds = [];
		createdEmployeeIds = [];
		createdProposalIds = [];
	});

	it("POST /companies should create a new company", async () => {
		const timestamp = Date.now();
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: `TEST_Company Legal Name ${timestamp}`,
			name: `TEST_Company Name ${timestamp}`,
			cpf: cpf.generate(),
			email: `test-company-${timestamp}@example.com`,
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

		createdCompanyIds.push(response.body.data.id);
	});

	it("POST /employees should create a new employee", async () => {
		const timestamp = Date.now();
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: `TEST_Company for Employee ${timestamp}`,
			name: `TEST_Company Name ${timestamp}`,
			cpf: cpf.generate(),
			email: `company-for-employee-${timestamp}@example.com`,
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyIds.push(companyResponse.body.data.id);

		const employeeData = {
			fullName: `Employee ${timestamp}`,
			cpf: cpf.generate(),
			email: `test-employee-${timestamp}@example.com`,
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

		createdEmployeeIds.push(response.body.data.id);
	});

	it("POST /proposals should create a new proposal", async () => {
		const timestamp = Date.now();
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: `Company Legal ${timestamp}`,
			name: `Company ${timestamp}`,
			cpf: cpf.generate(),
			email: `company-${timestamp}@example.com`,
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyIds.push(companyResponse.body.data.id);

		const employeeCpf = cpf.generate();
		const employeeData = {
			fullName: `Employee ${timestamp}`,
			cpf: employeeCpf,
			email: `employee-${timestamp}@example.com`,
			salary: 1000000,
			companyCnpj: companyData.cnpj,
		};

		const employeeResponse = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		createdEmployeeIds.push(employeeResponse.body.data.id);

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

		createdProposalIds.push(response.body.data.id);
	});

	it("should create complete loan flow: company -> employee -> proposal", async () => {
		const timestamp = Date.now();
		const companyData = {
			cnpj: cnpj.generate(),
			legalName: `TEST_Complete Flow Company ${timestamp}`,
			name: `TEST_Flow Company ${timestamp}`,
			cpf: cpf.generate(),
			email: `flow-company-${timestamp}@example.com`,
		};

		const companyResponse = await request(app.getHttpServer()).post("/companies").send(companyData).expect(201);

		createdCompanyIds.push(companyResponse.body.data.id);
		expect(companyResponse.body.success).toBe(true);

		const employeeCpf = cpf.generate();
		const employeeData = {
			fullName: `Flow Employee ${timestamp}`,
			cpf: employeeCpf,
			email: `flow-employee-${timestamp}@example.com`,
			salary: 1200000,
			companyCnpj: companyData.cnpj,
		};

		const employeeResponse = await request(app.getHttpServer()).post("/employees").send(employeeData).expect(201);

		createdEmployeeIds.push(employeeResponse.body.data.id);
		expect(employeeResponse.body.success).toBe(true);
		expect(employeeResponse.body.data.companyCnpj).toBe(companyData.cnpj);

		const proposalData = {
			companyCnpj: companyData.cnpj,
			employeeCpf: employeeCpf,
			totalLoanAmount: "500000",
			numberOfInstallments: "5",
		};

		const proposalResponse = await request(app.getHttpServer()).post("/proposals").send(proposalData).expect(201);

		createdProposalIds.push(proposalResponse.body.data.id);
		expect(proposalResponse.body.success).toBe(true);
		expect(proposalResponse.body.data.companyName).toBe(companyData.name);
		expect(proposalResponse.body.data.employerEmail).toBe(employeeData.email);
		expect(proposalResponse.body.data.installmentAmount).toBe(100000);

		expect(proposalResponse.body.data.totalLoanAmount).toBe(500000);
		expect(proposalResponse.body.data.numberOfInstallments).toBe(5);
		expect(proposalResponse.body.data.status).toBe("approved");
	});

	it("should validate minimum salary requirement", async () => {
		const timestamp = Date.now();
		const employeeData = {
			fullName: `Low Salary ${timestamp}`,
			cpf: cpf.generate(),
			email: `lowsalary-${timestamp}@example.com`,
			salary: 50000,
		};

		await request(app.getHttpServer()).post("/employees").send(employeeData).expect(400);
	});

	it("should validate maximum salary requirement", async () => {
		const timestamp = Date.now();
		const employeeData = {
			fullName: `High Salary ${timestamp}`,
			cpf: cpf.generate(),
			email: `highsalary-${timestamp}@example.com`,
			salary: 1500000,
		};

		await request(app.getHttpServer()).post("/employees").send(employeeData).expect(400);
	});
});
