import 'reflect-metadata';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './AppModule';
import { BadParameterExceptionFilter } from './exceptions/BadParameterExceptionFilter';
import { HttpExceptionFilter } from './exceptions/HttpExceptionFilter';
import { CustomValidationError } from './exceptions/CustomValidationError';
import { SessionName } from './constant/SessionConstant';
import { Logger } from './libs/logger/Logger';
import { NotFoundExceptionFilter } from './exceptions/NotFoundExceptionFilter';
import { synchronizeEntities } from './libs/synchronizeEntities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  try {
    await synchronizeEntities();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  app.useGlobalFilters(
    new NotFoundExceptionFilter(app.get(Logger)),
    new BadParameterExceptionFilter(app.get(Logger)),
    new HttpExceptionFilter(app.get(Logger)),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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

  const config = new DocumentBuilder()
    .setTitle('작심 API')
    .setDescription('작심 API 문서')
    .setVersion('1.0')
    .addCookieAuth(SessionName)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`jakshim-backend가 ${port}번 포트에서 실행 중입니다.`);
}

void bootstrap();
