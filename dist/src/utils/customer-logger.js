"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
const fs = require("node:fs");
const path = require("node:path");
const pino_1 = require("pino");
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const errorStream = pino_1.default.destination(path.join(logDir, "errors.json"));
const warnStream = pino_1.default.destination(path.join(logDir, "warnings.json"));
const infoStream = pino_1.default.destination(path.join(logDir, "info.json"));
const debugStream = pino_1.default.destination(path.join(logDir, "debug.json"));
class CustomLogger {
    loggers = {
        error: (0, pino_1.default)({
            level: "error",
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            formatters: {
                log: (log) => ({
                    timestamp: log.time,
                    trace: log.trace,
                }),
            },
        }, errorStream),
        warn: (0, pino_1.default)({
            level: "warn",
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
        }, warnStream),
        info: (0, pino_1.default)({
            level: "info",
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
        }, infoStream),
        debug: (0, pino_1.default)({
            level: "debug",
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
        }, debugStream),
        console: (0, pino_1.default)({
            level: "debug",
            transport: {
                target: "pino-pretty",
                options: { colorize: true },
            },
        }),
    };
    log(message) {
        this.loggers.info.info(message);
        this.loggers.console.info(message);
    }
    error(message, trace) {
        this.loggers.error.error({ trace });
        this.loggers.console.error(`${message}\n${trace}`);
    }
    warn(message) {
        this.loggers.warn.warn(message);
        this.loggers.console.warn(message);
    }
    debug(message) {
        this.loggers.debug.debug(message);
        this.loggers.console.debug(message);
    }
    verbose(message) {
        this.loggers.debug.debug(message);
        this.loggers.console.debug(message);
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=customer-logger.js.map