import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NotFoundExceptionFilter } from '../filter/NotFoundExceptionFilter';
import { Logger } from '../../logger/Logger';
import { BadParameterExceptionFilter } from '../filter/BadParameterExceptionFilter';
import { HttpExceptionFilter } from '../filter/HttpExceptionFilter';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from '../../exception/CustomValidationError';
import { FormatQueryInterceptor } from '../interceptor/FormatQueryInterceptor';
import { GlobalExceptionFilter } from '../filter/GlobalExceptionFilter';
import { DomainExceptionFilter } from '../filter/DomainExceptionFilter';

export function setNestApp<T extends INestApplication>(app: T): void {
  const logger = app.get(Logger);

  app.useGlobalFilters(
    new GlobalExceptionFilter(logger),
    new HttpExceptionFilter(logger),
    new NotFoundExceptionFilter(logger),
    new DomainExceptionFilter(logger),
    new BadParameterExceptionFilter(logger),
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
