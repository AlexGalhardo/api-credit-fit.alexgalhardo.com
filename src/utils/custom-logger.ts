import * as fs from "node:fs";
import * as path from "node:path";
import { LoggerService } from "@nestjs/common";
import pino from "pino";

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

const errorStream = pino.destination(path.join(logDir, "errors.json"));
const warnStream = pino.destination(path.join(logDir, "warnings.json"));
const infoStream = pino.destination(path.join(logDir, "info.json"));
const debugStream = pino.destination(path.join(logDir, "debug.json"));

export class CustomLogger implements LoggerService {
	private readonly loggers = {
		error: pino(
			{
				level: "error",
				timestamp: pino.stdTimeFunctions.isoTime,
				formatters: {
					log: (log) => ({
						timestamp: log.time,
						trace: log.trace,
					}),
				},
			},
			errorStream,
		),
		warn: pino(
			{
				level: "warn",
				timestamp: pino.stdTimeFunctions.isoTime,
			},
			warnStream,
		),
		info: pino(
			{
				level: "info",
				timestamp: pino.stdTimeFunctions.isoTime,
			},
			infoStream,
		),
		debug: pino(
			{
				level: "debug",
				timestamp: pino.stdTimeFunctions.isoTime,
			},
			debugStream,
		),
		console: pino({
			level: "debug",
			transport: {
				target: "pino-pretty",
				options: { colorize: true },
			},
		}),
	};

	log(message: string) {
		this.loggers.info.info(message);
		this.loggers.console.info(message);
	}

	error(message: string, trace?: string) {
		this.loggers.error.error({ trace });
		this.loggers.console.error(`${message}\n${trace}`);
	}

	warn(message: string) {
		this.loggers.warn.warn(message);
		this.loggers.console.warn(message);
	}

	debug(message: string) {
		this.loggers.debug.debug(message);
		this.loggers.console.debug(message);
	}

	verbose(message: string) {
		this.loggers.debug.debug(message);
		this.loggers.console.debug(message);
	}
}
