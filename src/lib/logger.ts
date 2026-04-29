import { env } from "@/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogData = Record<string, unknown>;

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = env.NODE_ENV === "development";

const MIN_LEVEL: LogLevel =
  (env.LOG_LEVEL as LogLevel | undefined) ?? (isDev ? "debug" : "info");

const DEV_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";

function serializeData(data: LogData): LogData {
  const out: LogData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Error) {
      out[key] = {
        message: value.message,
        name: value.name,
        stack: value.stack,
      };
    } else {
      out[key] = value;
    }
  }
  return out;
}

function write(level: LogLevel, message: string, data?: LogData): void {
  if (LEVEL_RANK[level] < LEVEL_RANK[MIN_LEVEL]) return;

  if (isDev) {
    const color = DEV_COLORS[level];
    const time = new Date().toTimeString().slice(0, 8);
    const tag = `${color}[${level.toUpperCase().padEnd(5)}]${RESET}`;
    const meta = data ? " " + JSON.stringify(serializeData(data), null, 2) : "";
    console[level === "debug" ? "log" : level](
      `${tag} ${time} ${message}${meta}`,
    );
  } else {
    const entry: Record<string, unknown> = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data ? serializeData(data) : {}),
    };
    console[level === "debug" ? "log" : level](JSON.stringify(entry));
  }
}

export const logger = {
  debug: (message: string, data?: LogData) => write("debug", message, data),
  info: (message: string, data?: LogData) => write("info", message, data),
  warn: (message: string, data?: LogData) => write("warn", message, data),
  error: (message: string, data?: LogData) => write("error", message, data),
};
