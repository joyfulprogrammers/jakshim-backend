import { DynamicModule } from '@nestjs/common';
import { SessionConstant } from '../../constant/SessionConstant';
import { Redis } from 'ioredis';

export class RedisModule {
  static register(host: string, port: number): DynamicModule {
    const redisClient = new Redis({
      host,
      port,
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
