import { DynamicModule } from '@nestjs/common';
import { SessionConstant } from '../../constant/SessionConstant';
import { Redis } from 'ioredis';

export class RedisModule {
  static register(): DynamicModule {
    const redisClient = new Redis(process.env.REDIS_URL as string);

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
