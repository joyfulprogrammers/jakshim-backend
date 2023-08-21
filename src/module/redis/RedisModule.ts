import { DynamicModule } from '@nestjs/common';
import { SessionConstant } from '../../constant/SessionConstant';
import { Redis } from 'ioredis';

export class RedisModule {
  static register(): DynamicModule {
    const redisClient = process.env.REDIS_URL
      ? new Redis(process.env.REDIS_URL + '?family=6' || '')
      : new Redis({
          host: 'localhost',
          port: 6385,
        });

    return {
      module: RedisModule,
      providers: [
        {
          provide: SessionConstant.REDIS,
          useValue: redisClient,
        },
      ],
      exports: [SessionConstant.REDIS],
    };
  }
}
