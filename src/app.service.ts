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
		console.log("logindto -> ", dto);
		if (dto.email === "admin@gmail.com" && dto.password === "admin123") {
			return {
				id: "1",
				name: "ADMIN",
				email: "admin@gmail.com",
				role: "admin",
			};
		} else if (dto.email === "empregado@gmail.com" && dto.password === "empregado123") {
			return {
				id: "2",
				name: "EMPREGADO",
				email: "empregado@gmail.com",
				role: "employee",
			};
		}

		return {
			id: null,
			name: null,
			email: null,
			role: null,
		};
	}
}
