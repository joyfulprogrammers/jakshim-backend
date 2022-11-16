import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { synchronizeEntities } from './libs/synchronizeEntities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    await synchronizeEntities();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  // 이렇게 해야 @Body()를 사용한 후 매개변수를 받으면 인스턴스화를 자동으로 진행한다.
  // https://github.com/nestjs/nest/issues/552
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`jakshim-backend가 ${port}번 포트에서 실행 중입니다.`);
}

void bootstrap();
