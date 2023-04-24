import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '../libs/res/ResponseEntity';
import { ResponseStatus } from '../libs/res/ResponseStatus';
import { Logger } from '../libs/logger/Logger';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: NotFoundException, host: ArgumentsHost): any {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.message;
    const statusCode = HttpStatus[exception.getStatus()];

    this.logger.info(`NotFoundException: url=${request.url}`, exception);

    response
      .status(HttpStatus.OK)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH(message, statusCode as ResponseStatus),
        ),
      );
  }
}
