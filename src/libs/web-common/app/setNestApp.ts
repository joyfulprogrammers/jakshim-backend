import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NotFoundExceptionFilter } from '../../../exceptions/NotFoundExceptionFilter';
import { Logger } from '../../logger/Logger';
import { BadParameterExceptionFilter } from '../../../exceptions/BadParameterExceptionFilter';
import { HttpExceptionFilter } from '../../../exceptions/HttpExceptionFilter';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from '../../../exceptions/CustomValidationError';
import { FormatQueryInterceptor } from '../interceptor/FormatQueryInterceptor';

export function setNestApp<T extends INestApplication>(app: T): void {
  app.useGlobalFilters(
    new NotFoundExceptionFilter(app.get(Logger)),
    new BadParameterExceptionFilter(app.get(Logger)),
    new HttpExceptionFilter(app.get(Logger)),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new FormatQueryInterceptor(),
  );

  // 이렇게 해야 @Body()를 사용한 후 매개변수를 받으면 인스턴스화를 자동으로 진행한다.
  // https://github.com/nestjs/nest/issues/552
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        value: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new BadRequestException(
          validationErrors.map((error) => new CustomValidationError(error)),
        ),
    }),
  );
}
