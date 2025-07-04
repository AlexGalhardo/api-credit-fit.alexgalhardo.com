import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { CustomLogger } from "./utils/custom-logger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new CustomLogger(),
	});

	app.enableCors({
		origin: "*",
	});

	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle("Credit Fit API Documentation")
		.setDescription("")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api-docs", app, document);

	await app.listen(process.env.PORT ?? 3000);

	console.log("\n\n\n🚀 Credit-Fit NestJS API Server running on http://localhost:3000");

	console.log("\n\n\n🚀 Swagger API Docs running on http://localhost:3000/api-docs");
}

bootstrap().catch((err) => {
	console.error("Failed to start Credit-Fit NestJS API Server: ", err);
	process.exit(1);
});
