import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CompanyController } from "./domain/company/company.controller";
import { CompanyService } from "./domain/company/company.service";
import { EmployeeController } from "./domain/employee/employee.controller";
import { EmployeeService } from "./domain/employee/employee.service";
import { ProposalController } from "./domain/proposal/proposal.controller";
import { ProposalService } from "./domain/proposal/proposal.service";
import { RepositoryModule } from "./repository/repository.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot([
			{
				ttl: 1000,
				limit: 10, // = 10 request per second
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
