"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const custom_logger_1 = require("./utils/custom-logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new custom_logger_1.CustomLogger(),
    });
    app.enableCors({
        origin: "*",
    });
    app.use((0, helmet_1.default)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Credit Fit API Documentation")
        .setDescription("")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    await app.listen(process.env.PORT ?? 3000);
    console.log("\n\n\n🚀 Credit-Fit NestJS API Server running on http://localhost:3000");
    console.log("\n\n\n🚀 Swagger API Docs running on http://localhost:3000/api-docs");
}
bootstrap().catch((err) => {
    console.error("Failed to start Credit-Fit NestJS API Server: ", err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map