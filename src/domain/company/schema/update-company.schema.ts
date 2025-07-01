import { createCompanySchema } from "./create-company.schema";

export const updateCompanySchema = (createCompanySchema as any)._def.schema.partial();
