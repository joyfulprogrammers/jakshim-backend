import { Logger } from '../../../src/libs/logger/Logger';

export class StubLogger extends Logger {
  private static logger = new StubLogger();

  message: string;
  err?: Error;
  logLevel?: string;

  private constructor() {
    super();
  }

  static getInstance() {
    return StubLogger.logger;
  }

  override info(message: string, error?: Error): void {
    this.message = message;
    this.err = error;
    this.logLevel = 'info';
  }

  override error(message: string, error?: Error): void {
    this.message = message;
    this.err = error;
    this.logLevel = 'error';
  }

  override warn(message: string, error?: Error): void {
    this.message = message;
    this.err = error;
    this.logLevel = 'warn';
  }

  override debug(message: string, error?: Error): void {
    this.message = message;
    this.err = error;
    this.logLevel = 'debug';
  }

  clear() {
    this.message = '';
    this.err = undefined;
    this.logLevel = undefined;

    return undefined;
  }
}
