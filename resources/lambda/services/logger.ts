import winston from "winston";
import { type LoggerOptions, type Logger } from "winston";

interface SecureLogger extends Logger {
  secure: (message: string, meta?: any) => Logger;
}

const loggerOptions: LoggerOptions = {
  level:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === "production" ? "info" : "silly"),
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
};

const logger: SecureLogger = winston.createLogger(
  loggerOptions
) as SecureLogger;

logger.secure = function (message: string, meta?: any): Logger {
  if (process.env.NODE_ENV === "production") {
    this.log("info", "*****", meta);
    return this;
  }

  this.log("info", message, meta);
  return this;
};

export default logger;
