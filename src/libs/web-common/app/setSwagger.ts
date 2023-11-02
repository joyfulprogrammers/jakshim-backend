import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SessionName } from '../../../constant/SessionConstant';

export function setSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('작심 API')
    .setDescription('작심 API 문서')
    .setVersion('1.0')
    .addCookieAuth(SessionName)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
