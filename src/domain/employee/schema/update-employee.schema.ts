import { createEmployeeSchema } from "./create-employee.schema";

export const updateEmployeeSchema = createEmployeeSchema.partial();
