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

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    RedisModule.register('localhost', 6385),
    SessionOptionModule.register('BzBdidyyqF5wglAu8DpnH5NY0hBGBy4k', 30),

    // route modules
    AuthModule,
    UserModule,
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
