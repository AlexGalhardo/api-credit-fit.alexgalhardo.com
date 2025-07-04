"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const company_controller_1 = require("./domain/company/company.controller");
const company_service_1 = require("./domain/company/company.service");
const employee_controller_1 = require("./domain/employee/employee.controller");
const employee_service_1 = require("./domain/employee/employee.service");
const proposal_controller_1 = require("./domain/proposal/proposal.controller");
const proposal_service_1 = require("./domain/proposal/proposal.service");
const repository_module_1 = require("./repository/repository.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1000,
                    limit: 10,
                },
            ]),
            repository_module_1.RepositoryModule,
        ],
        controllers: [app_controller_1.AppController, company_controller_1.CompanyController, employee_controller_1.EmployeeController, proposal_controller_1.ProposalController],
        providers: [
            app_service_1.AppService,
            company_service_1.CompanyService,
            employee_service_1.EmployeeService,
            proposal_service_1.ProposalService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map