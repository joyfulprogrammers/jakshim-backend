export abstract class Logger {
  abstract info(message: string): void;

  abstract error(message: string): void;

  abstract warn(message: string): void;

  abstract debug(message: string): void;
}
