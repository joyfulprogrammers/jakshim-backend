import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { setNestApp } from './libs/web-common/app/setNestApp';
import { setCors } from './libs/web-common/app/setCors';
import { setSwagger } from './libs/web-common/app/setSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV?.includes('local')
      ? ['error', 'warn', 'log']
      : ['error', 'warn'],
  });

  // try {
  //   await synchronizeEntities();
  // } catch (error) {
  //   eslint-disable-next-line no-console
  // console.error(error);
  // }

  setNestApp(app);
  setCors(process.env.NODE_ENV ?? 'local', app);
  setSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`jakshim-backend가 ${port}번 포트에서 실행 중입니다.`);
}

void bootstrap();
