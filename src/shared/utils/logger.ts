const isDevelopment = import.meta.env.MODE === "development";

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  log(...args: unknown[]): void {
    if (isDevelopment) {
      console.log(`[${this.getTimestamp()}] [LOG]`, ...args);
    }
  }

  error(...args: unknown[]): void {
    console.error(`[${this.getTimestamp()}] [ERROR]`, ...args);
  }

  warn(...args: unknown[]): void {
    if (isDevelopment) {
      console.warn(`[${this.getTimestamp()}] [WARN]`, ...args);
    }
  }

  info(...args: unknown[]): void {
    if (isDevelopment) {
      console.info(`[${this.getTimestamp()}] [INFO]`, ...args);
    }
  }
}

export const logger = new Logger();
