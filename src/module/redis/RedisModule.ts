import { DynamicModule } from '@nestjs/common';
import { SessionConstant } from '../../constant/SessionConstant';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: SessionConstant.REDIS,
          useFactory: (configService: ConfigService) =>
            new Redis(configService.getOrThrow<string>('REDIS_URL')),
          inject: [ConfigService],
        },
      ],
      exports: [SessionConstant.REDIS],
    };
  }
}
