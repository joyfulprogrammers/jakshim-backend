import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { ResponseEntity } from 'src/libs/res/ResponseEntity';
import { ResponseStatus } from 'src/libs/res/ResponseStatus';
import { Logger } from '../../logger/Logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost): any {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.message;
    const statusCode = HttpStatus[exception.getStatus()];

    this.logger.info(`HttpException: url=${request.url}`, exception);

    response
      .status(HttpStatus.OK)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH(message, statusCode as ResponseStatus),
        ),
      );
  }
}
