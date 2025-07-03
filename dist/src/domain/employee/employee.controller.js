"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const customer_logger_1 = require("../../utils/customer-logger");
const functions_1 = require("../../utils/functions");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const employee_service_1 = require("./employee.service");
let EmployeeController = class EmployeeController {
    employeeService;
    logger = new customer_logger_1.CustomLogger();
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async create(dto) {
        try {
            const result = await this.employeeService.create(dto);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error("Error creating employee", (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || "Unknown error while creating employee",
            });
        }
    }
    async findAll() {
        try {
            const result = await this.employeeService.findAll();
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error("Error fetching employees", (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || "Unknown error while fetching employees",
            });
        }
    }
    async findOne(id) {
        try {
            const result = await this.employeeService.findOne(id);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error fetching employee with id ${id}`, (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || `Unknown error while fetching employee with id ${id}`,
            });
        }
    }
    async update(id, dto) {
        try {
            const result = await this.employeeService.update(id, dto);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error updating employee with id ${id}`, (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || `Unknown error while updating employee with id ${id}`,
            });
        }
    }
    async remove(id) {
        try {
            const result = await this.employeeService.remove(id);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error removing employee with id ${id}`, (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || `Unknown error while removing employee with id ${id}`,
            });
        }
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)("employees"),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map