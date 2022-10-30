import { DynamicModule } from '@nestjs/common';
import * as Redis from 'redis';
import { SessionConstant } from '../../constant/SessionConstant';

export class RedisModule {
  static register(host: string, port: number): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: SessionConstant.REDIS,
          useValue: Redis.createClient({ url: `redis://${host}:${port}` }),
        },
      ],
      exports: [SessionConstant.REDIS],
    };
  }
}
