type LogLevel = "info" | "warn" | "error";

const format = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  return {
    level,
    message,
    meta,
    timestamp,
  };
};

export const logger = {
  info(message: string, meta?: unknown) {
    console.log(format("info", message, meta));
  },
  warn(message: string, meta?: unknown) {
    console.warn(format("warn", message, meta));
  },
  error(message: string, meta?: unknown) {
    console.error(format("error", message, meta));
  },
};
