import { Test, TestingModule } from "@nestjs/testing";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";

describe("CompanyController", () => {
	let controller: CompanyController;

	const mockCompanyService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CompanyController],
			providers: [{ provide: CompanyService, useValue: mockCompanyService }],
		}).compile();

		controller = module.get<CompanyController>(CompanyController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a company and return success response", async () => {
			const dto: CreateCompanyDto = {
				legalName: "Green Valley Ltda",
				name: "Green Valley",
				email: "contact@greenvalley.com",
				cpf: "123.456.789-00",
				cnpj: "12.345.678/0001-90"
			  };
			const createdCompany = { id: "company-1", ...dto };

			mockCompanyService.create.mockResolvedValue(createdCompany);

			const response = await controller.create(dto);
			expect(response).toEqual({ success: true, data: createdCompany });
			expect(mockCompanyService.create).toHaveBeenCalledWith(dto);
		});
	});

	describe("findAll", () => {
		it("should return all companies", async () => {
			const companies = [{ id: "company-1", name: "Company 1" }];
			mockCompanyService.findAll.mockResolvedValue(companies);

			const response = await controller.findAll();
			expect(response).toEqual({ success: true, data: companies });
			expect(mockCompanyService.findAll).toHaveBeenCalled();
		});
	});

	describe("findOne", () => {
		it("should return a single company by id", async () => {
			const company = { id: "company-1", name: "Company 1" };
			mockCompanyService.findOne.mockResolvedValue(company);

			const response = await controller.findOne("company-1");
			expect(response).toEqual({ success: true, data: company });
			expect(mockCompanyService.findOne).toHaveBeenCalledWith("company-1");
		});
	});

	describe("update", () => {
		it("should update a company", async () => {
			const dto: UpdateCompanyDto = { name: "Company Updated" };
			const updatedCompany = { id: "company-1", name: "Company Updated" };

			mockCompanyService.update.mockResolvedValue(updatedCompany);

			const response = await controller.update("company-1", dto);
			expect(response).toEqual({ success: true, data: updatedCompany });
			expect(mockCompanyService.update).toHaveBeenCalledWith("company-1", dto);
		});
	});

	describe("remove", () => {
		it("should delete a company", async () => {
			const deletedCompany = { id: "company-1", name: "Company to delete" };
			mockCompanyService.remove.mockResolvedValue(deletedCompany);

			const response = await controller.remove("company-1");
			expect(response).toEqual({ success: true, data: deletedCompany });
			expect(mockCompanyService.remove).toHaveBeenCalledWith("company-1");
		});
	});
});
