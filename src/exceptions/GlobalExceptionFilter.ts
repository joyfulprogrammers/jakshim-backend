import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '../libs/logger/Logger';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '../libs/res/ResponseEntity';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost): any {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.error(`GlobalExceptionFilter: url=${request.url}`, exception);

    response
      .status(HttpStatus.OK)
      .json(instanceToPlain(ResponseEntity.ERROR()));
  }
}
