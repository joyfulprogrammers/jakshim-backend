import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ResponseEntity } from '../libs/res/ResponseEntity';
import { ResponseStatus } from '../libs/res/ResponseStatus';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.message;
    const statusCode = HttpStatus[exception.getStatus()];

    response
      .status(HttpStatus.OK)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH(message, statusCode as ResponseStatus),
        ),
      );
  }
}
