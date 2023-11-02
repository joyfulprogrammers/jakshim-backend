import { INestApplication } from '@nestjs/common';

export function setCors<T extends INestApplication>(profile: string, app: T) {
  if (profile === 'local' || profile === 'development') {
    app.enableCors({
      origin: ['http://localhost:3000'],
      credentials: true,
    });

    return;
  }

  app.enableCors({
    origin: [],
    credentials: true,
  });
}
