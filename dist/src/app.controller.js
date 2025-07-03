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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const customer_logger_1 = require("./utils/customer-logger");
const functions_1 = require("./utils/functions");
const login_dto_1 = require("./dtos/login.dto");
let AppController = class AppController {
    appService;
    logger = new customer_logger_1.CustomLogger();
    constructor(appService) {
        this.appService = appService;
    }
    async getDashboard() {
        try {
            return await this.appService.index();
        }
        catch (error) {
            this.logger.error("Error fetching dashboard", (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || "Unknown error while fetching dashboard",
            });
        }
    }
    async login(dto) {
        try {
            const { id, name, email, role, salary, cpf, companyCnpj } = await this.appService.login(dto);
            if (!id || !name || !email || !role || !salary || !cpf || !companyCnpj)
                return { success: false, error: "Invalid credentials" };
            return { success: true, data: { id, name, email, role, salary, cpf, companyCnpj } };
        }
        catch (error) {
            this.logger.error("Error logging in", (0, functions_1.getErrorStack)(error));
            throw new common_1.BadRequestException({
                success: false,
                error: (0, functions_1.getErrorMessage)(error) || "Unknown error while logging in",
            });
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)("/login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map