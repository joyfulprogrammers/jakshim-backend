import { Duration } from '@js-joda/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Server } from 'http';
import * as passport from 'passport';
import config from './config/mikro-orm.config';
import { SessionMiddleware } from './middleware/SessionMiddleware';
import { AuthModule } from './module/auth/AuthModule';
import { RedisModule } from './module/redis/RedisModule';
import { SessionOptionModule } from './module/session/SessionOptionModule';
import { UserModule } from './module/user/UserModule';
import { HabitApiModule } from './module/habit/HabitApiModule';
import { AchievementApiModule } from './module/achievement/AchievementApiModule';
import { BadhabitApiModule } from './module/badhabit/BadhabitApiModule';
import { LoggerModule } from './libs/logger/LoggerModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    RedisModule.register(),
    LoggerModule.register(),
    SessionOptionModule.register(),
    // route modules
    AuthModule,
    UserModule,
    HabitApiModule,
    AchievementApiModule,
    BadhabitApiModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly adpaterHost: HttpAdapterHost) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware, passport.initialize(), passport.session())
      .forRoutes('*');
  }

  onApplicationBootstrap() {
    const server: Server = this.adpaterHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = Duration.ofSeconds(61).toMillis();
  }
}
