import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './AppModule';
import { synchronizeEntities } from './libs/synchronizeEntities';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  try {
    await synchronizeEntities();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`jakshim-backend가 ${port}번 포트에서 실행 중입니다.`);
}

void bootstrap();
