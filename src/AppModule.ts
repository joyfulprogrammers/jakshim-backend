import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import config from './config/mikro-orm.config';
import { RedisModule } from './module/redis/RedisModule';
import { SessionOptionModule } from './module/session/SessionOptionModule';
import { UserModule } from './module/user/UserModule';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    RedisModule.register('localhost', 6385),
    SessionOptionModule.register('BzBdidyyqF5wglAu8DpnH5NY0hBGBy4k', 30),

    // route modules
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
