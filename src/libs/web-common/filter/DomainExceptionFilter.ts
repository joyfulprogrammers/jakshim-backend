import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '../../exception/DomainException';
import { Request, Response } from 'express';
import { ResponseEntity } from '../../res/ResponseEntity';
import { ResponseStatus } from '../../res/ResponseStatus';
import { instanceToPlain } from 'class-transformer';
import { Logger } from '../../logger/Logger';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: DomainException, host: ArgumentsHost): any {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.info(
      this.getErrorLogMessageTemplate(request, exception),
      exception,
    );

    return response
      .status(HttpStatus.OK)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH(
            exception.responseMessage,
            HttpStatus[exception.statusCode] as ResponseStatus,
          ),
        ),
      );
  }

  private getErrorLogMessageTemplate(
    request: Request,
    exception: DomainException,
  ): string {
    return [
      `Domain Exception: `,
      `${exception.message}`,
      `parameter=${JSON.stringify(exception.parameter)}`,
      `path=${request.url}`,
      Object.keys(request.body).length > 0
        ? `body=${JSON.stringify(request.body)}`
        : null,
      Object.keys(request.query).length > 0
        ? `query=${JSON.stringify(request.query)}`
        : null,
    ]
      .filter(Boolean)
      .join(', ');
  }
}
