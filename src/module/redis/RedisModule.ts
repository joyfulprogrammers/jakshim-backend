import { DynamicModule } from '@nestjs/common';
import * as Redis from 'redis';
import { SessionConstant } from '../../constant/SessionConstant';

export class RedisModule {
  static register(host: string, port: number): DynamicModule {
    const redisClient = Redis.createClient({ url: `redis://${host}:${port}` });
    void redisClient.connect();

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
