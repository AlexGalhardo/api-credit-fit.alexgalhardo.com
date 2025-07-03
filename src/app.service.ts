import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";

@Injectable()
export class AppService {
	async index() {
		return {
			success: true,
		};
	}

	async login(dto: LoginDto) {
		console.log("login dto -> ", dto);
		if (dto.email === "admin@gmail.com" && dto.password === "admin123") {
			return {
				id: "1",
				name: "ADMIN",
				email: "admin@gmail.com",
				role: "admin",
				salary: 10000,
				cpf: "22550521560",
				companyCnpj: "78581373000190",
			};
		}

		const fixedEmployees = [
			{
				id: "2",
				name: "EMPREGADO",
				email: "empregado@gmail.com",
				salary: 15000,
				cpf: "04501133880",
				companyCnpj: "84207733000191",
			},
			{
				id: "3",
				name: "EMPREGADO 12",
				email: "empregado-12@gmail.com",
				salary: 12000,
				cpf: "27147123123",
				companyCnpj: "63604249000126",
			},
			{
				id: "4",
				name: "EMPREGADO 9",
				email: "empregado-9@gmail.com",
				salary: 9000,
				cpf: "52522513630",
				companyCnpj: "20824809000145",
			},
			{
				id: "5",
				name: "EMPREGADO 6",
				email: "empregado-6@gmail.com",
				salary: 6000,
				cpf: "26385255107",
				companyCnpj: "13734757000150",
			},
			{
				id: "6",
				name: "EMPREGADO 3",
				email: "empregado-3@gmail.com",
				salary: 3000,
				cpf: "22521727890",
				companyCnpj: "83604036000101",
			},
		];

		if (dto.password === "empregado123") {
			const found = fixedEmployees.find((emp) => emp.email === dto.email);

			if (found) {
				return {
					id: found.id,
					name: found.name,
					email: found.email,
					role: "employee",
					salary: found.salary * 100,
					cpf: found.cpf,
					companyCnpj: found.companyCnpj,
				};
			}
		}

		return {
			id: null,
			name: null,
			email: null,
			role: null,
			salary: null,
			cpf: null,
			companyCnpj: null,
		};
	}
}
