import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ErrorResponseStatus } from 'src/libs/res/ErrorResponseStatusResponseStatus';
import { ResponseEntity } from 'src/libs/res/ResponseEntity';
import { CustomValidationError } from './CustomValidationError';

@Catch(BadRequestException)
export class BadParameterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const responseBody = exception.response;
    const errorData = responseBody.message.map((validationError) =>
      this.getCustomValidationError(validationError),
    );

    response
      .status(HttpStatus.OK)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH_DATA<CustomValidationError[]>(
            ErrorResponseStatus.BAD_PARAMETER.message,
            ErrorResponseStatus.BAD_PARAMETER.code,
            errorData,
          ),
        ),
      );
  }

  private getCustomValidationError(
    responseBody: ValidationError,
  ): CustomValidationError {
    return new CustomValidationError(responseBody);
  }
}
