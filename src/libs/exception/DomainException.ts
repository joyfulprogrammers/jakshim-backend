import { HttpStatus } from '@nestjs/common';
import { masking } from '../util/masking';

interface DomainExceptionArg {
  message: string;
  responseMessage?: string;
  parameter?: object;
  isMasking?: boolean;
}

export class DomainException extends Error {
  private readonly _statusCode: HttpStatus;
  private readonly _responseMessage?: string;
  private readonly _parameter?: object;

  constructor(statusCode: HttpStatus, arg: DomainExceptionArg) {
    super(arg.message);
    this._statusCode = statusCode;
    this._responseMessage = arg.responseMessage;

    if (this.isMasking(arg)) {
      this._parameter = this.maskingParameter(arg.parameter as object);
    } else {
      this._parameter = arg.parameter;
    }
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(arg: DomainExceptionArg) {
    return new DomainException(HttpStatus.BAD_REQUEST, arg);
  }

  static Unauthorized(arg: DomainExceptionArg) {
    return new DomainException(HttpStatus.UNAUTHORIZED, arg);
  }

  static NotFound(arg: DomainExceptionArg) {
    return new DomainException(HttpStatus.NOT_FOUND, arg);
  }

  static Conflict(arg: DomainExceptionArg) {
    return new DomainException(HttpStatus.CONFLICT, arg);
  }

  private isMasking(arg: DomainExceptionArg): boolean {
    return (
      !!arg?.isMasking &&
      !!arg?.parameter &&
      !!Object.keys(arg.parameter).length
    );
  }

  private maskingParameter(parameter: object): object {
    return Object.entries(parameter)
      .map(([key, value]) => ({
        [key]: masking(value),
      }))
      .reduce((acc, cur) => Object.assign(acc, cur));
  }

  get statusCode(): HttpStatus {
    return this._statusCode;
  }

  get responseMessage(): string {
    return this._responseMessage ?? this.message;
  }

  get parameter(): object | undefined {
    return this._parameter;
  }
}
