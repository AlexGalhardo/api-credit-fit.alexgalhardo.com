import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CompanyController } from "./domain/company/company.controller";
import { EmployeeController } from "./domain/employee/employee.controller";
import { ProposalController } from "./domain/proposal/proposal.controller";
import { AppController } from "./app.controller";
import { RepositoryModule } from "./repository/repository.module";
import { AppService } from "./app.service";
import { CompanyService } from "./domain/company/company.service";
import { EmployeeService } from "./domain/employee/employee.service";
import { ProposalService } from "./domain/proposal/proposal.service";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot([
			{
				ttl: 1000,
				limit: 100,
			},
		]),
		RepositoryModule,
	],
	controllers: [AppController, CompanyController, EmployeeController, ProposalController],
	providers: [
		AppService,
		CompanyService,
		EmployeeService,
		ProposalService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
