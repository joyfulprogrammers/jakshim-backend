export abstract class Logger {
  abstract info(message: string, exception?: any): void;

  abstract error(message: string, exception?: any): void;

  abstract warn(message: string, exception?: any): void;

  abstract debug(message: string, exception?: any): void;
}
