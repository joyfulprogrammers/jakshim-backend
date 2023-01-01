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

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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
